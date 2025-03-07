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
            $validatedData = $request->validate([
                'title' => 'required|string|max:255|unique:products',
                'price' => 'required|numeric|min:0',
                'sub__category_id' => 'required|numeric|exists:sub__categories,id',
                'discreption' => 'required|string',
                'image' => 'required|string',
                'brand_id' => 'required|numeric|exists:brands,id',
            ]);

            $product = Auth::user()->vendor->product()->create($validatedData);
            $product->sub_category()->associate($validatedData['sub__category_id']);
            $product->save();

            return response()->json(new ProductResource($product), 201);
            
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json(new ProductResource($product));
    }
    
    public function update(Request $request, Product $product): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'title' => 'nullable|string|max:255|unique:products',
                'price' => 'nullable|numeric|min:0',
                'sub__category_id' => 'nullable|numeric|exists:sub__categories,id',
                'discreption' => 'nullable|string',
                'image' => 'nullable|string',
                'brand_id' => 'nullable|numeric|exists:brands,id',
            ]);

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
        $query = Product::query();

        if ($request->has('sub_category_id')) {
            $query->where('sub__category_id', $request->input('sub_category_id'));
        }

        if ($request->has('brand_id')) {
            $query->where('brand_id', $request->input('brand_id'));
        }

        if ($request->has('search') && $request->filled('search')) {
            $searchTerm = $request->input('search');
            $query->where('title', 'like', "%$searchTerm%");
        }

         if ($request->has('min_price') && $request->filled('min_price')) {
            $minPrice = $request->input('min_price');
            $query->where('price', '>=', $minPrice);
        }
        if ($request->has('max_price') && $request->filled('max_price')) {
            $maxPrice = $request->input('max_price');
            $query->where('price', '<=', $maxPrice);
        }


        $products = $query->get();

        return response()->json(ProductResource::collection($products));
    }

}    
