<?php

namespace App\Http\Controllers\API;

use App\Models\Property;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class PropertyController extends Controller

{
    /**
     * Store a newly created property.
     */
    public function store(Request $request)
    {
        // Check role
        if (!in_array(Auth::user()->role, ['admin', 'owner'])) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string',
            'location' => 'required|string',
            'property_type_id' => 'required|exists:property_types,id',
            'image' => 'nullable|string',
            'star_rating' => 'nullable|numeric',
            'floor' => 'nullable|integer',
            'have_gym' => 'boolean',
            'have_swing' => 'boolean',
            'have_park' => 'boolean',
            'price' => 'required|numeric',
            'price_type' => 'required|in:month,year,day',
            'has_units' => 'boolean',
            'tittle' => 'required|string',
            'descrepton' => 'nullable|string',
            'bedrooma' => 'required|string',
            'has_kitchen' => 'boolean',
            'size_house' => 'nullable|numeric',
            'bathroom' => 'required|string',
        ]);

        $validated['user_id'] = Auth::id();

        $property = Property::create($validated);

        return response()->json([
            'message' => 'Property created successfully',
            'data' => $property
        ]);
    }
}