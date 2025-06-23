<?php



namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    //

    public function index()
    {
        $brands = Brand::with('subcategory')->get();

        return response()->json([
            'brands' => $brands
        ], 200);
    }



    public function by_sub_category($subcategory_id)
    {
        $brands = Brand::where('sub__category_id', $subcategory_id)
        ->with('subcategory')
        ->paginate(10);

        return response()->json([
        'brands' => $brands
        ], 200);
    }


    public function by_category($category_id)
    {
        $brands = Brand::whereHas('category', function($query) use ($category_id) {
                $query->where('categories.id', $category_id); // Specify table name here
            })
            ->with(['subcategory', 'category'])
            ->paginate(10);

        return response()->json([
            'brands' => $brands
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:brands,name',
            'sub__category_id' => 'required|exists:sub__categories,id', // تأكد أن الـ Subcategory موجودة
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $brand = Brand::create([
            'name' => $request->name,
            'sub__category_id' => $request->sub__category_id, // تعيين الـ Subcategory
        ]);

        return response()->json([
            'message' => 'Brand created successfully',
            'brand' => $brand->load('subcategory') // تحميل العلاقة
        ], 201);
    }


    public function show($brand)
    {
        $brand = Brand::with('subcategory')->find($brand); // مع العلاقة

        if (!$brand) {
            return response()->json([
                'message' => 'Brand not found'
            ], 404);
        }

        return response()->json([
            'brand' => $brand
        ], 200);
    }

    public function update(Request $request, Brand $brand)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255|unique:brands,name,' . $brand->id,
            'sub__category_id' => 'nullable|exists:sub__categories,id', // يمكن تحديثها أو تركها كما هي
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // تحديث الحقول إذا كانت موجودة في الطلب
        if ($request->has('name')) {
            $brand->name = $request->name;
        }

        if ($request->has('sub__category_id')) {
            $brand->sub__category_id = $request->sub__category_id;
        }

        $brand->save();

        return response()->json([
            'message' => 'Brand updated successfully',
            'brand' => $brand->load('subcategory') // مع العلاقة
        ], 200);
    }
    public function destroy(Brand $brand)
    {

        $brand->products->delete();
        $brand->delete();

        return response()->json([
            'message' => 'Brand deleted successfully'
        ], 200);
    }
}
