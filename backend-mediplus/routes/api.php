<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AvailabilityController;
use App\Http\Controllers\Api\TeleconsultController;
use App\Http\Controllers\Api\PrescriptionController;
use App\Http\Controllers\Api\TriageController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ConfigController;

// ===== PHASE 1 - AUTHENTIFICATION & PROFIL =====
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
});

// ===== PHASE 2 - RECHERCHE & LISTING =====
Route::get('/search', [DoctorController::class, 'search']);
Route::get('/specialties', [DoctorController::class, 'specialties']);
Route::get('/doctor/{id}', [DoctorController::class, 'show']);

// ===== PHASE 3 - DISPONIBILITÉS & RÉSERVATIONS =====
Route::middleware('auth:sanctum')->group(function () {
    // Disponibilités
    Route::get('/pro/availability', [AvailabilityController::class, 'index']);
    Route::post('/pro/availability', [AvailabilityController::class, 'store']);
    Route::put('/pro/availability/{id}', [AvailabilityController::class, 'update']);
    Route::delete('/pro/availability/{id}', [AvailabilityController::class, 'destroy']);

    // Rendez-vous
    Route::post('/patient/appointments', [AppointmentController::class, 'store']);
    Route::get('/patient/appointments', [AppointmentController::class, 'patientList']);
    Route::get('/pro/appointments', [AppointmentController::class, 'doctorList']);
    Route::post('/pro/appointments/{id}/confirm', [AppointmentController::class, 'confirm']);
    Route::post('/pro/appointments/{id}/reject', [AppointmentController::class, 'reject']);
    Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
});

// ===== PHASE 4 - TÉLÉCONSULTATION =====
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/teleconsult/create', [TeleconsultController::class, 'create']);
    Route::get('/teleconsult/token/{roomId}', [TeleconsultController::class, 'getToken']);
    Route::post('/teleconsult/end/{roomId}', [TeleconsultController::class, 'end']);
    Route::get('/teleconsult/history', [TeleconsultController::class, 'history']);
});

// ===== PHASE 5 - PRESCRIPTIONS & ORDONNANCES =====
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/pro/prescriptions', [PrescriptionController::class, 'store']);
    Route::get('/patient/prescriptions', [PrescriptionController::class, 'patientList']);
    Route::get('/patient/prescriptions/{id}', [PrescriptionController::class, 'show']);
    Route::get('/patient/prescriptions/{id}/download', [PrescriptionController::class, 'download']);
    Route::put('/pro/prescriptions/{id}', [PrescriptionController::class, 'update']);
});

// ===== PHASE 6 - TRIAGE MÉDICAL IA =====
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/triage', [TriageController::class, 'analyze']);
    Route::get('/triage/history', [TriageController::class, 'history']);
    Route::get('/triage/{id}', [TriageController::class, 'show']);
});

// ===== PHASE 7 - PAIEMENT & FACTURATION =====
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/payment/create', [PaymentController::class, 'create']);
    Route::post('/payment/verify', [PaymentController::class, 'verify']);
    Route::get('/payment/history', [PaymentController::class, 'history']);
    Route::get('/pro/billing', [PaymentController::class, 'billing']);
});

// ===== PHASE 8 - ADMINISTRATION & NOTIFICATIONS =====
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::put('/admin/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
        Route::get('/admin/catalog', [AdminController::class, 'catalog']);
        Route::post('/admin/catalog', [AdminController::class, 'storeCatalog']);
        Route::get('/admin/reports', [AdminController::class, 'reports']);
    });
});

// ===== PHASE 9 - CONFIGURATION & INTÉGRATIONS =====
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/config/settings', [ConfigController::class, 'settings']);
    Route::put('/config/settings', [ConfigController::class, 'updateSettings']);
    Route::get('/config/languages', [ConfigController::class, 'languages']);
});

// ===== TEST ROUTE =====
Route::get('/test', function () {
    return response()->json(['status' => 'ok']);
});
