<?php

use Illuminate\Support\Facades\Route;

// === Import des Contrôleurs ===
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\AvailabilityController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\TeleconsultController;
use App\Http\Controllers\Api\PrescriptionController;
use App\Http\Controllers\Api\TriageController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ConfigController;

// ===========================================================
// 🩵 Phase 1 — Authentification & Profil
// ===========================================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // =======================================================
    // 🩺 Phase 2 — Recherche & Profil Médecin
    // =======================================================
    Route::get('/doctor/profile', [DoctorController::class, 'myProfile']);
    Route::post('/doctor/profile', [DoctorController::class, 'storeProfile']);
    Route::put('/doctor/profile', [DoctorController::class, 'updateProfile']);

    // =======================================================
    // 🗓️ Phase 3 — Disponibilités & Rendez-vous
    // =======================================================
    Route::get('/pro/availability', [AvailabilityController::class, 'index']);
    Route::post('/pro/availability', [AvailabilityController::class, 'store']);

    Route::get('/patient/appointments', [AppointmentController::class, 'index']);
    Route::post('/patient/appointments', [AppointmentController::class, 'store']);
    Route::post('/pro/appointments/{id}/confirm', [AppointmentController::class, 'confirm']);

    // =======================================================
    // 💻 Phase 4 — Téléconsultation
    // =======================================================
    Route::post('/teleconsult/create', [TeleconsultController::class, 'create']);
    Route::get('/teleconsult/token/{roomId}', [TeleconsultController::class, 'token']);
    Route::post('/teleconsult/end/{roomId}', [TeleconsultController::class, 'end']);

    // =======================================================
    // 💊 Phase 5 — Prescriptions & Ordonnances
    // =======================================================
    Route::post('/pro/prescriptions', [PrescriptionController::class, 'store']);
    Route::get('/patient/prescriptions', [PrescriptionController::class, 'patientList']);
    Route::get('/patient/prescriptions/{id}/download', [PrescriptionController::class, 'download']);

    // =======================================================
    // 🧠 Phase 6 — Triage Médical IA
    // =======================================================
    Route::post('/triage', [TriageController::class, 'analyze']);
    Route::get('/triage/history', [TriageController::class, 'history']);

    // =======================================================
    // 💳 Phase 7 — Paiement & Facturation
    // =======================================================
    Route::post('/payment/create', [PaymentController::class, 'create']);
    Route::post('/payment/verify', [PaymentController::class, 'verify']);
    Route::get('/pro/billing', [PaymentController::class, 'billing']);

    // =======================================================
    // 🛠️ Phase 8 — Administration & Notifications
    // =======================================================
    Route::get('/admin/users', [AdminController::class, 'users']);
    Route::put('/admin/users/{id}', [AdminController::class, 'updateRole']);
    Route::get('/admin/catalog', [AdminController::class, 'catalog']);
    Route::get('/admin/reports', [AdminController::class, 'reports']);

    Route::get('/notifications', [NotificationController::class, 'index']);

    // =======================================================
    // ⚙️ Phase 9 — Configuration & Intégrations
    // =======================================================
    Route::get('/config/settings', [ConfigController::class, 'index']);
    Route::put('/config/settings', [ConfigController::class, 'update']);
    Route::get('/config/languages', [ConfigController::class, 'languages']);
});

// ===========================================================
// 🌍 Routes Publiques (Phase 2)
// ===========================================================
Route::get('/search', [DoctorController::class, 'search']);
Route::get('/doctor/{id}', [DoctorController::class, 'show']);
Route::get('/specialties', [DoctorController::class, 'specialties']);
