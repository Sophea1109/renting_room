<?php

namespace App\Http\Controllers\API;

use App\Models\Unit;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class UnitController extends Controller
{
    public function store(Request $request)
    {
        // Role check
        if (!in_array(Auth::user()->role, ['admin', 'owner'])) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'unit_name' => 'required|string',
            'bedrooms' => 'nullable|integer',
            'bathrooms' => 'nullable|integer',
            'price' => 'required|numeric',
            'has_kitchen' => 'boolean',
            'status' => 'nullable|string',
        ]);

        // Optional: verify ownership
        $property = Property::findOrFail($validated['property_id']);

        if (
            Auth::user()->role !== 'admin' &&
            $property->user_id !== Auth::id()
        ) {
            return response()->json([
                'message' => 'You do not own this property'
            ], 403);
        }

        $unit = Unit::create($validated);

        return response()->json([
            'message' => 'Unit created successfully',
            'data' => $unit
        ]);
    }
}