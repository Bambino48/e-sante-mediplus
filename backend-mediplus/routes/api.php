<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DoctorController;

// === 🔐 Auth ===
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/doctor/profile-test', [DoctorController::class, 'myProfile']); // sans middleware

// === 🌍 Public ===
Route::get('/search', [DoctorController::class, 'search']);
Route::get('/specialties', [DoctorController::class, 'specialties']);
Route::get('/doctor/{id}', [DoctorController::class, 'show']);

// === 🔒 Auth Sanctum ===
Route::middleware('auth:sanctum')->group(function () {

    // 👤 User
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // 👨‍⚕️ Doctor
    Route::get('/doctor/profile', [DoctorController::class, 'myProfile']);
    Route::post('/doctor/profile', [DoctorController::class, 'storeProfile']);
    Route::put('/doctor/profile', [DoctorController::class, 'updateProfile']);
});
