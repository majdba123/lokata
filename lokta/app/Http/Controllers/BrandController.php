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
        $brands = Brand::all();
        return response()->json([
            'brands' => $brands
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:brands,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }


        $brand = new Brand();
        $brand->name = $request->name;
        $brand->save();

        return response()->json([
            'message' => 'Brand created successfully',
            'brand' => $brand
        ], 201);
    }

    public function show($brand)
    {
        $brand = Brand::find($brand);

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
            'name' => 'nullable|string|max:255|unique:brands,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

    
        $brand->name = $request->name;
        $brand->save();

        return response()->json([
            'message' => 'Brand updated successfully',
            'brand' => $brand
        ], 200);
    }

    public function destroy(Brand $brand)
    {


        $brand->delete();

        return response()->json([
            'message' => 'Brand deleted successfully'
        ], 200);
    }
}
