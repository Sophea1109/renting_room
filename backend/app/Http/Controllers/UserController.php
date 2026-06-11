<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(['users' => User::all()]);
        
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:25',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,user,owner',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
    
        $request->validate([
            'first_name' => 'required|string|max:25',
            'last_name' => 'required|string|max:25',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|in:admin,user,owner',
            'password' => 'nullable|string|min:6',
        ]);
    
        $data = [
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'role' => $request->role,
        ];
    
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }
    
        $user->update($data);
    
        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * Upload user avatar
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);
        
        $user = auth()->user();
        
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            
            // Store new avatar
            $avatar = $request->file('avatar');
            $filename = time() . '_' . uniqid() . '.' . $avatar->getClientOriginalExtension();
            $path = $avatar->storeAs('avatars', $filename, 'public');
            
            $user->avatar = $path;
            $user->save();
            
            return response()->json([
                'message' => 'Avatar uploaded successfully',
                'avatar' => $path
            ]);
        }
        
        return response()->json([
            'message' => 'No file uploaded'
        ], 400);
    }

    /**
     * Get user avatar
     */
    public function getAvatar($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            return response()->json([
                'avatar' => Storage::url($user->avatar)
            ]);
        }
        
        return response()->json([
            'avatar' => null
        ]);
    }
    
}