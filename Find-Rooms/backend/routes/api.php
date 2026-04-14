<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OwnerDashboardController;
use App\Http\Controllers\AuthController;

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

Route::get('/owner/dashboard', [OwnerDashboardController::class, 'index']);
Route::post('/owner/rooms', [OwnerDashboardController::class, 'store']);            // create room
Route::patch('/owner/rooms/{room}', [OwnerDashboardController::class, 'update']);   // edit room details
Route::patch('/owner/rooms/{room}/status', [OwnerDashboardController::class, 'updateRoomStatus']); // update status only
Route::delete('/owner/rooms/{room}', [OwnerDashboardController::class, 'destroy']); // delete room
