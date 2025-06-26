<?php

namespace App\Http\Controllers;

use App\Models\Sub_Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Resources\SubCategoryWithProductsResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class SubCategoryController extends Controller
{

    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255|unique:sub__categories',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imageFile = $request->file('image');
            $imageName = Str::random(32) . '.' . $imageFile->getClientOriginalExtension();
            $imagePath = 'subcategories/' . $imageName;
            Storage::disk('public')->put($imagePath, file_get_contents($imageFile));
        }

        $subCategory = Sub_Category::create([
            'category_id' => $request->category_id,
            'title' => $request->title,
            'image' => $imagePath ? asset('api/storage/' . $imagePath) : null,
        ]);

        return response()->json([
            'success' => true,
            'data' => $subCategory,
            'message' => 'تم إنشاء التصنيف الفرعي بنجاح'
        ], 201);
    }

    public function update(Request $request, Sub_Category $subCategory): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'sometimes|exists:categories,id',
            'title' => 'nullable|string|max:255|unique:sub__categories,title,' . $subCategory->id,
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = [
            'title' => $request->title ?? $subCategory->title,
            'category_id' => $request->category_id ?? $subCategory->category_id,
        ];

        if ($request->hasFile('image')) {
            // حذف الصورة القديمة إذا كانت موجودة
            if ($subCategory->image) {
                $oldImagePath = str_replace(asset('storage/'), '', $subCategory->image);
                Storage::disk('public')->delete($oldImagePath);
            }

            $imageFile = $request->file('image');
            $imageName = Str::random(32) . '.' . $imageFile->getClientOriginalExtension();
            $imagePath = 'subcategories/' . $imageName;
            Storage::disk('public')->put($imagePath, file_get_contents($imageFile));
            $data['image'] = asset('api/storage/' . $imagePath);
        }

        $subCategory->update($data);

        return response()->json([
            'success' => true,
            'data' => $subCategory,
            'message' => 'تم تحديث التصنيف الفرعي بنجاح'
        ], 200);
    }

    public function destroy(Sub_Category $subCategory): JsonResponse
    {
        $subCategory->product->delete();
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
