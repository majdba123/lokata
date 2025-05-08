<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\CategoryNavbar;
use Illuminate\Http\Request;

class CategoryNavbarController extends Controller
{
    const MAX_CATEGORIES = 6;

    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => CategoryNavbar::with('category')->get(),
            'count' => CategoryNavbar::count()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_ids' => 'required|array|max:'.self::MAX_CATEGORIES,
            'category_ids.*' => 'exists:categories,id'
        ]);

        $currentCount = CategoryNavbar::count();
        $newCount = count(array_diff($validated['category_ids'], CategoryNavbar::pluck('category_id')->toArray()));

        if (($currentCount + $newCount) > self::MAX_CATEGORIES) {
            return response()->json([
                'success' => false,
                'message' => 'تجاوز الحد الأقصى ('.self::MAX_CATEGORIES.') للتصنيفات في النافبار'
            ], 422);
        }

        CategoryNavbar::addCategories($validated['category_ids']);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث تصنيفات النافبار بنجاح',
            'added_count' => $newCount
        ]);
    }



    public function destroy($id)
    {
        CategoryNavbar::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم الحذف بنجاح'
        ]);
    }
}
