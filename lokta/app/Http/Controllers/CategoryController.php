<?php

namespace App\Http\Controllers;
use App\Models\Category;
use App\Models\Sub_Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\SubcategoryResource;



class CategoryController extends Controller
{
    public function create(Request $request) : JsonResponse
    {
        // Validate the request
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:categories',
            'description' => 'required|string|max:255',
            'image' => 'required|string'
        ]);

        // Create new category
        $category = Category::create($validated);

        return response()->json($category, 201);
    }

   

    /**
     * Show the form for editing the specified resource.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'title' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('categories')->ignore($category->id), // Ignore the current category's ID
            ],
            'description' => 'nullable|string|max:255',
            'image' => 'nullable|string',
        ]);

        $category->update($validated);

        return response()->json($category, 200);
    }


    public function destroy(Category $category) : JsonResponse
    {
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully'], 200);
    }

    public function allCategories(): JsonResponse
    {
       
        $categories = Category::with('subCategories')
            ->whereHas('subCategories')
            ->get();

        return response()->json(CategoryResource::collection($categories), 200);
    }

    public function categoryById(Category $category): JsonResponse
    {
        $category->load('subCategories');

        return response()->json(new CategoryResource($category), 200);
    }

    public function allSubCategories() : JsonResponse
    {
        $subCategories = Sub_Category::all();

        return response()->json(SubcategoryResource::collection($subCategories), 200);
    }


}
