<?php

namespace App\Http\Controllers;

use App\Models\Sub_Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use App\Models\Category;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class SubCategoryController extends Controller
{

    public function create(Request $request, int $category_id): JsonResponse
    {
          // Check if the category exists
        $category = Category::find($category_id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 400);
        }
        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
                Rule::unique('sub__categories')->where(function ($query) use ($category_id) {
                    return $query->where('category_id', $category_id);
                })
            ],
            'image' => 'required|string',
        ]);

        $subCategory = new Sub_Category($validated);
        $subCategory->category_id = $category_id;
        $subCategory->save();

        return response()->json($subCategory, 201);
    }


    public function update(Request $request, int $category_id, Sub_Category $subCategory): JsonResponse
    {
        // Check if the category exists
        $category = Category::find($category_id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 400);
        }

        // Check if the subcategory belongs to the specified category
        if ($subCategory->category_id !== $category_id) {
            return response()->json(['message' => 'Subcategory does not belong to the specified category.'], 400);
        }


        $validated = $request->validateWithBag('default', [
            'title' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('sub__categories')->where(function ($query) use ($category_id) {
                    return $query->where('category_id', $category_id);
                })
            ],
            'image' => 'nullable|string',
        ]);


        $subCategory->update($validated);

        return response()->json($subCategory, 200);
    }

    public function destroy(int $category_id, Sub_Category $subCategory): JsonResponse
    {
        try {
            // Check if the category exists
            $category = Category::find($category_id);
            if (!$category) {
                return response()->json(['message' => 'Category not found'], 400);
            }

            // Check if the subcategory belongs to the specified category
            if ($subCategory->category_id !== $category_id) {
                return response()->json(['message' => 'Subcategory does not belong to the specified category.'], 400);
            }

            $subCategory->delete();

            return response()->json(['message' => 'Subcategory deleted successfully'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Subcategory not found.'], 404);
        }
    }



}
