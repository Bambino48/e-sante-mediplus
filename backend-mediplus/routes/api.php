<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DoctorController;

// Phase 1 — Auth & Profil
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Profil médecin (dashboard pro)
    Route::get('/doctor/profile',  [DoctorController::class, 'myProfile']);
    Route::post('/doctor/profile', [DoctorController::class, 'storeProfile']);
    Route::put('/doctor/profile',  [DoctorController::class, 'updateProfile']);
});

// Phase 2 — Recherche & Listing (publiques)
Route::get('/search',      [DoctorController::class, 'search']);
Route::get('/doctor/{id}', [DoctorController::class, 'show']);
Route::get('/specialties', [DoctorController::class, 'specialties']);
