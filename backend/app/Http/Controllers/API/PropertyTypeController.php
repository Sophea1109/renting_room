<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PropertyType;

class PropertyTypeController extends Controller
{
    // List all types (Accessible by everyone or admins depending on route middleware)
    public function index()
    {
        return response()->json([
            'data' => PropertyType::all()
        ]);
    }

    // Create a new property type
    public function store(Request $request)
    {
        if (!auth()->user()->isAdmin()) {
            return response()->json([
                'message' => 'Only admin can create property types'
            ], 403);
        }

        $request->validate([
            'name' => 'required|unique:property_types,name'
        ]);

        $type = PropertyType::create([
            'name' => $request->name
        ]);

        return response()->json([
            'message' => 'Property type created successfully',
            'data' => $type
        ], 201);
    }

    // Update an existing property type
    public function update(Request $request, $id)
    {
        if (!auth()->user()->isAdmin()) {
            return response()->json([
                'message' => 'Only admin can edit property types'
            ], 403);
        }

        $type = PropertyType::findOrFail($id);

        $request->validate([
            'name' => 'required|unique:property_types,name,' . $type->id
        ]);

        $type->update([
            'name' => $request->name
        ]);

        return response()->json([
            'message' => 'Property type updated successfully',
            'data' => $type
        ]);
    }

    // Delete a property type
    public function destroy($id)
    {
        if (!auth()->user()->isAdmin()) {
            return response()->json([
                'message' => 'Only admin can delete property types'
            ], 403);
        }

        $type = PropertyType::findOrFail($id);
        $type->delete();

        return response()->json([
            'message' => 'Property type deleted successfully'
        ]);
    }
}