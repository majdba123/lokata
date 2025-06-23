<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use App\Http\Resources\ProductResource;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Offer;
use App\Models\Paymentway;
use App\Models\Sub_Category;
use App\Models\User;
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
        $products = Product::where('status', 'completed')->get();
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




    public function show(int $product): JsonResponse
    {
        // if product not found

        $product = Product::find($product);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json(new ProductResource($product));
    }


























































    public function store(Request $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            $ownerId = Auth::id();
            $validationRules = [
                'title' => 'required|string|max:255|unique:products',
                'price' => 'required|numeric|min:0',
                'sub__category_id' => 'required|numeric|exists:sub__categories,id',
                'description' => 'required|string',
                'city' => 'required|string',
                'images' => 'required|array',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
                'brand_id' => 'required|numeric|exists:brands,id',
                'currency' => 'required|string|in:sy,us',
                'offer_id' => [
                    'required',
                    'numeric',
                    Rule::exists('offers', 'id')->where('status', 1)
                ],
                'paymentway_id' => [
                    'required',
                    'numeric',
                    Rule::exists('paymentways', 'id')->where('status', 1)
                ],
            ];
            if ($request->paymentway_id != 1) {
                $validationRules['payment_inputs'] = 'required|array';
            }

            $validatedData = $request->validate($validationRules);
            $brand = Brand::findOrFail($validatedData['brand_id']);

            if ($brand->sub__category_id != $validatedData['sub__category_id']) {
                throw ValidationException::withMessages([
                    'brand_id' => ['البراند المحدد لا ينتمي إلى التصنيف الفرعي المحدد.']
                ]);
            }

            $paymentway = Paymentway::with('Paymentway_input')->findOrFail($validatedData['paymentway_id']);
            $offer = Offer::findOrFail($validatedData['offer_id']);

            // معالجة الصور
            $uploadedImages = [];
            foreach ($request->file('images') as $imageFile) {
                $imageName = Str::random(32) . '.' . $imageFile->getClientOriginalExtension();
                $imagePath = 'products/' . $imageName;
                Storage::disk('public')->put($imagePath, file_get_contents($imageFile));
                $uploadedImages[] = asset('api/storage/' . $imagePath);
            }

            // معالجة حقول الدفع
            $processedPaymentInputs = [];
            if ($validatedData['paymentway_id'] != 1) {
                $processedPaymentInputs = $this->processPaymentInputs($paymentway, $validatedData['payment_inputs'], $request);
            }

            $productData = [
                'title' => $validatedData['title'],
                'price' => $validatedData['price'],
                'sub__category_id' => $validatedData['sub__category_id'],
                'description' => $validatedData['description'],
                'city' => $validatedData['city'],
                'images' => json_encode($uploadedImages), // تخزين مصفوفة مسارات الصور
                'brand_id' => $validatedData['brand_id'],
                'currency' => $validatedData['currency'],
                'owner_id' => $ownerId,
                'offer_id' => $validatedData['offer_id'],
                'paymentway_id' => $validatedData['paymentway_id'],
                'payment_inputs' => json_encode($processedPaymentInputs),
                'status' => 'pending',
                'start_date' => null,
                'end_date' => null,
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
                    $value = asset('api/storage/payment_inputs/' . $imageName);
                }
            }

            $processedInputs[$input->name] = $value;
        }

        return $processedInputs;
    }



























































public function update(Request $request, $id): JsonResponse
{
    try {
        $product = Product::findOrFail($id);

        if (!(Auth::id() == $product->owner_id || Auth::user()->role == 'admin')) {
            return response()->json(['message' => 'غير مصرح لك بتعديل هذا المنتج'], 403);
        }

        $validatedData = $request->validate([
            'title' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'sub__category_id' => 'nullable|numeric|exists:sub__categories,id',
            'description' => 'nullable|string',
            'city' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'brand_id' => 'nullable|numeric|exists:brands,id',
            'currency' => 'nullable|string|in:sy,us',
        ]);

        // التحقق من أن البراند ينتمي إلى التصنيف الفرعي إذا تم توفيرهما
        if (isset($validatedData['brand_id'])) {
            $brand = Brand::find($validatedData['brand_id']);
            $subCategoryId = $validatedData['sub__category_id'] ?? $product->sub__category_id;

            if ($brand->sub__category_id != $subCategoryId) {
                throw ValidationException::withMessages([
                    'brand_id' => ['البراند المحدد لا ينتمي إلى التصنيف الفرعي المحدد.']
                ]);
            }
        }

        // معالجة الصور الجديدة إذا تم رفعها
        if ($request->hasFile('images')) {
            $uploadedImages = [];

            // حذف الصور القديمة إذا كانت موجودة
            if ($product->images) {
                foreach (json_decode($product->images) as $oldImage) {
                    $oldImagePath = str_replace(asset('api/storage/'), '', $oldImage);
                    Storage::disk('public')->delete($oldImagePath);
                }
            }

            // رفع الصور الجديدة
            foreach ($request->file('images') as $imageFile) {
                $imageName = Str::random(32) . '.' . $imageFile->getClientOriginalExtension();
                $imagePath = 'products/' . $imageName;
                Storage::disk('public')->put($imagePath, file_get_contents($imageFile));
                $uploadedImages[] = asset('api/storage/' . $imagePath);
            }

            $validatedData['images'] = json_encode($uploadedImages);
        }

        // تحديث الحالة فقط إذا كانت الحالة الأصلية completed
        if ($product->status === 'completed') {
            $validatedData['status'] = 'reupdate';
        }
        // إذا كانت pending تبقى كما هي (لا نضيفها لـ validatedData)

        $product->update($validatedData);

        if (isset($validatedData['sub__category_id'])) {
            $product->sub_category()->associate($validatedData['sub__category_id']);
            $product->save();
        }

        return response()->json(new ProductResource($product));
    } catch (ValidationException $e) {
        return response()->json(['errors' => $e->errors()], 422);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'حدث خطأ أثناء تحديث المنتج: ' . $e->getMessage()
        ], 500);
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
            ->where('status', 'completed')
            ->get();

        return response()->json(ProductResource::collection($products));
    }


    public function filterProducts(Request $request): JsonResponse
    {
        $query = Product::query()->where('status', 'completed');

        // فلترة حسب category_id (جلب جميع منتجات sub_categories التابعة له)
        if ($request->has('category_id')) {
            $query->whereHas('sub_category', function ($q) use ($request) {
                $q->where('category_id', $request->input('category_id'));
            });
        }

        // ... (بقية الفلاتر الحالية تبقى كما هي) ...
        if ($request->has('sub_category_id')) {
            $query->where('sub__category_id', $request->input('sub_category_id'));
        }

        if ($request->has('subcategory_title')) {
            $query->whereHas('sub_category', function ($q) use ($request) {
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
            $query->where(function ($q) use ($searchTerms) {
                foreach ($searchTerms as $term) {
                    $q->orWhere('title', 'like', "%$term%")
                        ->orWhere('description', 'like', "%$term%");
                }
            });
        }

        // --- PRICE FILTERS ---
        if ($request->has('min_price') && $request->filled('min_price')) {
            $minPrice = (int) $request->input('min_price');
            $query->where('price', '>=', $minPrice);
        }
        if ($request->has('max_price') && $request->filled('max_price')) {
            $maxPrice = (int) $request->input('max_price');
            $query->where('price', '<=', $maxPrice);
        }
        // --- END PRICE FILTERS ---

        $products = $query->get();

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



    /**
     * تحديث حالة المنتج (للاستخدام من قبل الأدمن فقط)
     *
     * @param Request $request
     * @param Product $product
     * @return JsonResponse
     */
   public function updateStatus(Request $request, $id): JsonResponse
    {
        $product = Product::find($id);
        try {
            $request->validate([
                'status' => 'required|string|in:completed,rejected',
            ]);

            // التحقق من شرط is_show_payment إذا كانت الحالة المطلوبة هي completed
            if ($request->status === 'completed' && $product->is_show_payment != 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'يجب عليك مشاهدة تفاصيل الدفع أولاً قبل الموافقة على المنتج'
                ], 422);
            }

            DB::beginTransaction();

            $product->status = $request->status;

            if ($request->status === 'completed') {
                // إذا كانت الحالة complete، نضيف تواريخ البدء والانتهاء
                $product->start_date = now();

                // جلب عدد أشهر العرض من الـ offer المرتبط
                $offer = Offer::find($product->offer_id);
                if ($offer) {
                    $product->end_date = now()->addDays($offer->count_month);
                } else {
                    throw new \Exception('لا يوجد عرض مرتبط بهذا المنتج');
                }
            } else {
                // إذا كانت الحالة rejected، نلغي التواريخ
                $product->start_date = null;
                $product->end_date = null;
            }

            $product->save();
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
            Log::error('Product status update failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'فشل في تحديث حالة المنتج: ' . $e->getMessage()
            ], 500);
        }
    }




    /**
 * تحديث حالة مشاهدة تفاصيل الدفع للمنتج
 *
 * @param int $id معرف المنتج
 * @return JsonResponse
 */
    public function markPaymentAsViewed($id): JsonResponse
    {
        try {
            $product = Product::findOrFail($id);

            DB::beginTransaction();

            $product->is_show_payment = 1;
            $product->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث حالة مشاهدة تفاصيل الدفع بنجاح',
                'data' => new ProductResource($product)
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update payment view status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'فشل في تحديث حالة مشاهدة تفاصيل الدفع: ' . $e->getMessage()
            ], 500);
        }
    }


    public function adminProducts(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'status' => 'nullable|string|in:pending,rejected,completed,expired',
                'offer_id' => 'nullable|numeric|exists:offers,id',
            ]);

            $query = Product::query();

            // فلترة حسب الحالة إذا تم توفيرها
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // فلترة حسب offer_id إذا تم توفيره
            if ($request->has('offer_id')) {
                $query->where('offer_id', $request->offer_id);
            }

            // ترتيب النتائج حسب تاريخ الإنشاء (الأحدث أولاً)
            $query->orderBy('created_at', 'desc');

            // جلب النتائج مع العلاقات المطلوبة
            $products = $query->with(['sub_category', 'brand', 'offer', 'paymentway'])
                ->get();

            return response()->json([
                'success' => true,
                'data' => ProductResource::collection($products)
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Admin products fetch failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'فشل في جلب المنتجات: ' . $e->getMessage()
            ], 500);
        }
    }













    public function getStats()
    {
        // إحصائيات المنتجات حسب الحالة
        $productStats = [
            'pending' => Product::where('status', 'pending')->count(),
            'rejected' => Product::where('status', 'expired')->count(),
            'completed' => Product::where('status', 'completed')->count(),
            'total' => Product::count(),
        ];

        // إحصائيات الفئات والتصنيفات الفرعية
        $categoryStats = [
            'categories' => Category::count(),
            'sub_categories' => Sub_Category::count(),
        ];

        // إجمالي الربح من المنتجات (بناءً على سعر العرض)
        $totalProfit = Product::where('status', 'completed')
            ->with('offer')
            ->get()
            ->sum(function ($product) {
                return $product->offer ? $product->offer->price : 0;
            });

        // إحصائيات العروض
        $offerStats = [
            'level_1' => Product::whereHas('offer', function ($q) {
                $q->where('level', 1);
            })->count(),
            'level_2' => Product::whereHas('offer', function ($q) {
                $q->where('level', 2);
            })->count(),
            'level_3' => Product::whereHas('offer', function ($q) {
                $q->where('level', 3);
            })->count(),
        ];

        // إحصائيات المستخدمين
        $userStats = [
            'total_users' => User::count(),
            'vendors' => User::has('vendor')->count(),
            'regular_users' => User::doesntHave('vendor')->count(),
        ];

        // إحصائيات البراندات
        $brandStats = [
            'total_brands' => Brand::count(),
            'brands_with_products' => Brand::has('products')->count(),
            'brands_without_products' => Brand::doesntHave('products')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'product_stats' => $productStats,
                'category_stats' => $categoryStats,
                'total_profit' => $totalProfit,
                'offer_stats' => $offerStats,
                'user_stats' => $userStats,
                'brand_stats' => $brandStats,
            ]
        ]);
    }
}
