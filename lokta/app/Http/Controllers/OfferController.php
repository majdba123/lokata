<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    /**
     * Display a listing of the resource with optional filtering.
     */
    public function index(Request $request)
    {
        // Start with all offers
        $query = Offer::query();

        // Filter by title if provided
        if ($request->has('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        if ($request->has('level')) {
            $query->where('level', 'like', '%' . $request->level . '%');
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

        // Get the filtered results
        $offers = $query->get();

        return response()->json($offers);
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
    public function destroy($id)
    {
        $offer = Offer::find($id);
        $offer->delete();

        return response()->json([
            'message' => 'Offer deleted successfully'
        ]);
    }
}
