<?php

/**
 * Routes API - Mediplus Backend
 *
 * Architecture RESTful pour plateforme de télémédecine
 * Authentification via Laravel Sanctum
 * Organisation modulaire par domaines métier
 *
 * @author Senior Backend Developer
 * @version 1.0.0
 * @package Mediplus\Api\Routes
 */

use Illuminate\Support\Facades\Route;

// === Import des Contrôleurs Métier ===
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
use App\Http\Controllers\Api\PatientProfileController;
use App\Http\Controllers\Api\MedicationController;

// ===========================================================
// Phase 1 — Authentification & Gestion des Profils
// ===========================================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // =======================================================
    // Phase 2 — Gestion des Profils Médicaux
    // =======================================================
    Route::get('/doctor/profile', [DoctorController::class, 'myProfile']);
    Route::post('/doctor/profile', [DoctorController::class, 'storeProfile']);
    Route::put('/doctor/profile', [DoctorController::class, 'updateProfile']);

    // =======================================================
    // Phase 3 — Système de Rendez-vous et Disponibilités
    // =======================================================
    Route::get('/pro/availability', [AvailabilityController::class, 'index']);
    Route::post('/pro/availability', [AvailabilityController::class, 'store']);

    Route::get('/patient/appointments', [AppointmentController::class, 'index']);
    Route::get('/patient/appointments/next', [AppointmentController::class, 'next']);
    Route::post('/patient/appointments', [AppointmentController::class, 'store']);
    Route::post('/pro/appointments/{id}/confirm', [AppointmentController::class, 'confirm']);

    // =======================================================
    // Phase 4 — Infrastructure de Téléconsultation
    // =======================================================
    Route::post('/teleconsult/create', [TeleconsultController::class, 'create']);
    Route::get('/teleconsult/token/{roomId}', [TeleconsultController::class, 'token']);
    Route::post('/teleconsult/end/{roomId}', [TeleconsultController::class, 'end']);

    // =======================================================
    // Phase 5 — Gestion des Prescriptions et Ordonnances
    // =======================================================
    Route::post('/pro/prescriptions', [PrescriptionController::class, 'store']);
    Route::get('/patient/prescriptions', [PrescriptionController::class, 'patientList']);
    Route::get('/patient/prescriptions/{id}/download', [PrescriptionController::class, 'download']);

    // =======================================================
    // Phase 5b — Gestion des Médicaments
    // =======================================================
    Route::get('/medications', [MedicationController::class, 'index']);
    Route::get('/medications/today', [MedicationController::class, 'today']);
    Route::get('/medications/{id}', [MedicationController::class, 'show']);
    Route::post('/medications', [MedicationController::class, 'store']);
    Route::put('/medications/{id}', [MedicationController::class, 'update']);
    Route::delete('/medications/{id}', [MedicationController::class, 'destroy']);
    Route::get('/prescriptions/{prescriptionId}/medications', [MedicationController::class, 'byPrescription']);

    // =======================================================
    // Phase 6 — Intelligence Artificielle de Triage Médical
    // =======================================================
    Route::post('/triage', [TriageController::class, 'analyze']);
    Route::get('/triage/history', [TriageController::class, 'history']);

    // =======================================================
    // Phase 7 — Système de Paiement et Facturation
    // =======================================================
    Route::post('/payment/create', [PaymentController::class, 'create']);
    Route::post('/payment/verify', [PaymentController::class, 'verify']);
    Route::get('/pro/billing', [PaymentController::class, 'billing']);

    // =======================================================
    // Phase 8 — Administration et Système de Notifications
    // =======================================================
    Route::get('/admin/users', [AdminController::class, 'users']);
    Route::put('/admin/users/{id}', [AdminController::class, 'updateRole']);
    Route::get('/admin/catalog', [AdminController::class, 'catalog']);
    Route::get('/admin/reports', [AdminController::class, 'reports']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread', [NotificationController::class, 'unread']);

    // =======================================================
    // Phase 9 — Configuration et Intégrations Système
    // =======================================================
    Route::get('/config/settings', [ConfigController::class, 'index']);
    Route::put('/config/settings', [ConfigController::class, 'update']);
    Route::get('/config/languages', [ConfigController::class, 'languages']);

    Route::prefix('patient')->group(function () {
        Route::get('/profile', [PatientProfileController::class, 'show']);
        Route::post('/profile', [PatientProfileController::class, 'store']);
        Route::put('/profile', [PatientProfileController::class, 'update']);
        Route::delete('/profile', [PatientProfileController::class, 'destroy']);
    });
});

// ===========================================================
// Routes Publiques - Recherche et Catalogue (Phase 2)
// ===========================================================
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/search', [DoctorController::class, 'search']);
Route::get('/doctor/{id}', [DoctorController::class, 'show']);
Route::get('/specialties', [DoctorController::class, 'specialties']);
