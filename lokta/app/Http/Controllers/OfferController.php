<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OfferController extends Controller
{
    /**
     * Display a listing of the resource with optional filtering.
     */
    public function index(Request $request)
    {
        // Start with all offers
        $query = Offer::query();

        // Check if user is admin
        $user = Auth::user();
        $isAdmin = $user && $user->role === 'admin';

        // For non-admin users, show only active offers (status = 1)
        if (!$isAdmin) {
            $query->where('status', 1);
        }

        // Filter by title if provided
        if ($request->has('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        // Filter by level if provided
        if ($request->has('level')) {
            $query->where('level', $request->level); // removed 'like' for exact match
        }

        // Filter by price range if provided
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filter by count_month if provided
        if ($request->has('count_month')) {
            $query->where('count_month', $request->count_month);
        }

        // Optional: Filter by status if admin explicitly requests it
        if ($isAdmin && $request->has('status')) {
            $query->where('status', $request->status);
        }

        // Get the filtered results
        $offers = $query->get();

        return response()->json([
            'success' => true,
            'is_admin' => $isAdmin,
            'data' => $offers
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Typically used to return a view for creating a new offer
        // In API context, this might not be needed
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'level' => 'required|integer|in:1,2,3',
            'discription' => 'required|string',
            'count_month' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
        ]);

        // Create the offer
        $offer = Offer::create($validatedData);

        return response()->json([
            'message' => 'Offer created successfully',
            'offer' => $offer
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $offer = Offer::find($id);
        return response()->json($offer);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request ,$id)
    {

        $offer = Offer::find($id);
        // Validate the request data
        $validatedData = $request->validate([
            'title' => 'sometimes|string|max:255',
            'level' => 'sometimes|integer|in:1,2,3',
            'discription' => 'sometimes|string',
            'count_month' => 'sometimes|integer|min:1',
            'price' => 'sometimes|numeric|min:0',
        ]);

        // Update the offer
        $offer->update($validatedData);

        return response()->json([
            'message' => 'Offer updated successfully',
            'offer' => $offer
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request,$id)
    {
        $request->validate([
            'status' => 'required|in:0,1', // يجب أن تكون القيمة 0 أو 1 فقط
        ]);

        // البحث عن العرض
        $offer = Offer::find($id);

        if (!$offer) {
            return response()->json([
                'success' => false,
                'message' => 'العرض غير موجود'
            ], 404);
        }

        // تحديث حالة العرض
        $offer->update(['status' => $request->status]);

        // رسالة الاستجابة حسب الحالة
        $statusMessage = $request->status == 1
            ? 'تم تفعيل العرض بنجاح'
            : 'تم تعطيل العرض بنجاح';

        return response()->json([
            'success' => true,
            'message' => $statusMessage,
            'data' => $offer
        ], 200);
    }
}
