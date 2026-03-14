<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OwnerDashboardController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (user must be authenticated)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::get('/owner/dashboard', [OwnerDashboardController::class, 'index']);
//update room status
Route::post('/owner/rooms', [OwnerDashboardController::class, 'createRoom']);
Route::patch('/owner/rooms/{room}/status', [OwnerDashboardController::class, 'updateRoomStatus']);