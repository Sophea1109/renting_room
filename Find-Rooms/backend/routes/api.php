<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OwnerDashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\RoomController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (user must be authenticated)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Public room listing for tenants
Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{room}', [RoomController::class, 'show']);

Route::get('/owner/dashboard', [OwnerDashboardController::class, 'index']);
Route::post('/owner/rooms', [OwnerDashboardController::class, 'store']);            // create room
Route::patch('/owner/rooms/{room}', [OwnerDashboardController::class, 'update']);   // edit room details
Route::patch('/owner/rooms/{room}/status', [OwnerDashboardController::class, 'updateRoomStatus']); // update status only
Route::delete('/owner/rooms/{room}', [OwnerDashboardController::class, 'destroy']); // delete room

// Booking routes
Route::post('/bookings', [BookingController::class, 'store']);                              // tenant submits booking
Route::get('/owner/bookings', [BookingController::class, 'index']);                         // owner views all bookings
Route::get('/owner/bookings/pending-count', [BookingController::class, 'pendingCount']);    // notification badge count
Route::patch('/owner/bookings/{booking}/approve', [BookingController::class, 'approve']);   // owner approves
Route::patch('/owner/bookings/{booking}/reject', [BookingController::class, 'reject']);     // owner rejects