<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use App\Http\Resources\ProductResource;
use App\Models\Offer;
use App\Models\Paymentway;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{

    public function index(): JsonResponse
    {
        $products = Product::where('status', 'complete')->get();
        return response()->json(ProductResource::collection($products));
    }

  /*  public function store(Request $request): JsonResponse
    {
        try {
            $ownerId = Auth::id();
            $validatedData = $request->validate([
                'title' => 'required|string|max:255|unique:products',
                'price' => 'required|numeric|min:0',
                'sub__category_id' => 'required|numeric|exists:sub__categories,id',
                'description' => 'required|string',
                'images' => 'required|array',
                'images.*' => 'string',
                'brand_id' => 'required|numeric|exists:brands,id',
                'currency' => 'required|string|in:sy,us', // تحقق باستخدام Validator
                    ]);

            $imagesJson = json_encode($validatedData['images']);
            unset($validatedData['images']);
            $validatedData['owner_id'] = $ownerId;
            $validatedData['images'] = $imagesJson;

            $product = Product::create($validatedData);

            return response()->json(new ProductResource($product));

    return response()->json(new ProductResource($product));

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    public function show(int $product): JsonResponse
    {
        // if product not found

        $product = Product::find($product);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json(new ProductResource($product));
    }*/






























































    public function store(Request $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            $ownerId = Auth::id();

            $validatedData = $request->validate([
                'title' => 'required|string|max:255|unique:products',
                'price' => 'required|numeric|min:0',
                'sub__category_id' => 'required|numeric|exists:sub__categories,id',
                'description' => 'required|string',
                'images' => 'required|array',
                'images.*' => 'string', // أو 'image|mimes:jpeg,png,jpg,gif|max:2048' إذا كنت تستقبل ملفات
                'brand_id' => 'required|numeric|exists:brands,id',
                'currency' => 'required|string|in:sy,us',
                'offer_id' => 'required|numeric|exists:offers,id',
                'paymentway_id' => 'required|numeric|exists:paymentways,id',
                'payment_inputs' => 'required|array'
            ]);

            $paymentway = Paymentway::with('Paymentway_input')->findOrFail($validatedData['paymentway_id']);
            $offer = Offer::findOrFail($validatedData['offer_id']);

            // معالجة حقول الدفع بما في ذلك الصور
            $processedPaymentInputs = $this->processPaymentInputs($paymentway, $validatedData['payment_inputs'], $request);

            $productData = [
                'title' => $validatedData['title'],
                'price' => $validatedData['price'],
                'sub__category_id' => $validatedData['sub__category_id'],
                'description' => $validatedData['description'],
                'images' => json_encode($validatedData['images']),
                'brand_id' => $validatedData['brand_id'],
                'currency' => $validatedData['currency'],
                'owner_id' => $ownerId,
                'offer_id' => $validatedData['offer_id'],
                'paymentway_id' => $validatedData['paymentway_id'],
                'payment_inputs' => json_encode($processedPaymentInputs),
                'status' => 'pending',
                'start_date' => null,
                'end_date' => null
            ];

            $product = Product::create($productData);
            $product->load(['paymentway', 'offer', 'sub_category', 'brand']);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => new ProductResource($product)
            ]);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Product creation failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'فشل في إنشاء المنتج: ' . $e->getMessage()
            ], 500);
        }
    }

    protected function validatePaymentInputs(Paymentway $paymentway, array $paymentInputs, Request $request): void
    {
        $requiredInputs = $paymentway->Paymentway_input;

        foreach ($requiredInputs as $input) {
            if (!array_key_exists($input->name, $paymentInputs)) {
                throw ValidationException::withMessages([
                    'payment_inputs.' . $input->name => "حقل {$input->name} مطلوب لطريقة الدفع هذه"
                ]);
            }

            $value = $paymentInputs[$input->name];

            switch ($input->type) {
                case '0': // نص
                    if (!is_string($value)) {
                        throw ValidationException::withMessages([
                            'payment_inputs.' . $input->name => "حقل {$input->name} يجب أن يكون نصاً"
                        ]);
                    }
                    break;

                case '1': // رقم هاتف
                    if (!preg_match('/^[0-9]{10,15}$/', $value)) {
                        throw ValidationException::withMessages([
                            'payment_inputs.' . $input->name => "حقل {$input->name} يجب أن يكون رقم هاتف صحيح (10-15 رقم)"
                        ]);
                    }
                    break;

                case '2': // صورة
                    if (!$request->hasFile("payment_inputs.{$input->name}")) {
                        throw ValidationException::withMessages([
                            'payment_inputs.' . $input->name => "حقل {$input->name} يجب أن يكون صورة"
                        ]);
                    }
                    break;
            }
        }
    }

    protected function processPaymentInputs(Paymentway $paymentway, array $paymentInputs, Request $request): array
    {
        $processedInputs = [];
        $requiredInputs = $paymentway->Paymentway_input;

        foreach ($requiredInputs as $input) {
            $value = $paymentInputs[$input->name];

            if ($input->type == '2') { // إذا كان نوع الحقل صورة
                $imageFile = $request->file("payment_inputs.{$input->name}");

                if ($imageFile) {
                    $imageName = Str::random(32) . '.' . $imageFile->getClientOriginalExtension();
                    $imagePath = 'payment_inputs/' . $imageName;
                    Storage::disk('public')->put($imagePath, file_get_contents($imageFile));
                    $value = asset('storage/payment_inputs/' . $imageName);
                }
            }

            $processedInputs[$input->name] = $value;
        }

        return $processedInputs;
    }































































    public function update(Request $request, Product $product): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'title' => 'nullable|string|max:255',
                'price' => 'nullable|numeric|min:0',
                'sub__category_id' => 'nullable|numeric|exists:sub__categories,id',
                'description' => 'nullable|string',
                'images' => 'nullable|array',
                'images.*' => 'string',
                'brand_id' => 'nullable|numeric|exists:brands,id',
                'currency' => 'nullable|string|in:sy,us', // تحقق باستخدام Validator
            ]);
            if ($request->has('images')) {
                $imagesJson = json_encode($validatedData['images']);
                unset($validatedData['images']);
                $validatedData['images'] = $imagesJson;
            }


            $product->update($validatedData);
            if (isset($validatedData['sub__category_id'])) {
                $product->sub_category()->associate($validatedData['sub__category_id']);
                $product->save();
            }

            return response()->json(new ProductResource($product));
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully'], 200);
    }

    public function getProductsBySubCategory($subCategoryId): JsonResponse
    {
        $products = Product::where('sub__category_id', $subCategoryId)
        ->where('status', 'complete')
        ->get();

        return response()->json(ProductResource::collection($products));
    }

    public function filterProducts(Request $request): JsonResponse
{
    // ... (other setup) ...
    $query = Product::query()->where('status', 'complete'); // إضافة شرط الحالة هنا

    // ... (sub_category_id, brand_id, search filters remain the same) ...
    // Ensure sub_category_id uses the correct column name (single underscore assumed fixed)
    if ($request->has('sub_category_id')) {
        $query->where('sub__category_id', $request->input('sub_category_id'));
    }

    if($request->has('subcategory_title')) {
        $query->whereHas('sub_category', function($q) use ($request) {
        $q->where('title', 'LIKE', '%' . $request->input('subcategory_title') . '%');
        });
    }

    if ($request->has('brand_id')) {
        $query->where('brand_id', $request->input('brand_id'));
    }


    if ($request->has('currency')) {
        $query->where('currency', $request->input('currency'));
    }

    if ($request->has('search') && $request->filled('search')) {
        $searchTerms = explode(' ', $request->input('search'));
        $query->where(function($q) use ($searchTerms) {
        foreach ($searchTerms as $term) {
            $q->orWhere('title', 'like', "%$term%")
              ->orWhere('description', 'like', "%$term%");
        }
        });
    }

    // --- PRICE FILTERS ---
    if ($request->has('min_price') && $request->filled('min_price')) {
        // Explicitly cast to integer (or float if your price has decimals)
        $minPrice = (int) $request->input('min_price');
        $query->where('price', '>=', $minPrice); // Compare number >= number
    }
    if ($request->has('max_price') && $request->filled('max_price')) {
        // Explicitly cast to integer (or float if your price has decimals)
        $maxPrice = (int) $request->input('max_price');
        $query->where('price', '<=', $maxPrice); // Compare number <= number
    }
    // --- END PRICE FILTERS ---


    $products = $query->get();

    // Optional: Log the final query for debugging if it still fails
    // \Log::info('Final Filter Query:', [\DB::getQueryLog()]); // Requires \DB::enableQueryLog(); earlier

    return response()->json(ProductResource::collection($products));
}

    public function myProducts(): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $products = Product::where('owner_id', Auth::id())->get();

        return response()->json(ProductResource::collection($products), 200);
    }

}
