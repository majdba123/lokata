<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use App\Http\Resources\ProductResource;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;


class ProductController extends Controller
{

    public function index(): JsonResponse
    {
        $products = Product::all();
        return response()->json(ProductResource::collection($products));
    }

    public function store(Request $request): JsonResponse
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
        $products = Product::where('sub__category_id', $subCategoryId)->get();
        return response()->json(ProductResource::collection($products));
    }

    public function filterProducts(Request $request): JsonResponse
{
    // ... (other setup) ...
    $query = Product::query();

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
