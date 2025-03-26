<?php

namespace App\Http\Controllers;

use App\Models\Sub_Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Resources\SubCategoryWithProductsResource;


class SubCategoryController extends Controller
{

    public function create(Request $request): JsonResponse
    {
        
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:sub__categories',
            'image' => 'required|string',
        ]);

        $subCategory = Sub_Category::create($validated);
        return response()->json($subCategory, 201);
    }


    public function update(Request $request, Sub_Category $subCategory): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255|unique:sub__categories,title,' . $subCategory->id,
            'image' => 'nullable|string',
        ]);

        $subCategory->update($validated);

        return response()->json($subCategory, 200);
    }

    public function destroy(Sub_Category $subCategory): JsonResponse
    {
        $subCategory->delete();

        return response()->json(['message' => 'Subcategory deleted successfully'], 200);
    }

    public function allSubCategories(): JsonResponse
    {
        $subCategories = Sub_Category::all();

        return response()->json($subCategories, 200);
    }

    public function allSubCategoriesWithLatestProducts(): JsonResponse
    {
        $subCategories = Sub_Category::whereHas('product') // Filter out subcategories without products
        ->with(['product' => function ($query) {
            $query->latest()->take(7);
        }])
        ->get();


        return response()->json(SubCategoryWithProductsResource::collection($subCategories), 200);
    }
}
