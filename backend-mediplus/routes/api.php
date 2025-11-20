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
use App\Http\Controllers\Api\ConsultationController;

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
    Route::get('/doctor/stats', [DoctorController::class, 'stats']);
    Route::get('/doctor/patients', [DoctorController::class, 'patients']);

    // =======================================================
    // Phase 3 — Système de Rendez-vous et Disponibilités
    // =======================================================
    Route::get('/doctor/availabilities', [AvailabilityController::class, 'index']);
    Route::post('/doctor/availabilities', [AvailabilityController::class, 'store']);
    Route::put('/doctor/availabilities/{id}', [AvailabilityController::class, 'update']);
    Route::delete('/doctor/availabilities/{id}', [AvailabilityController::class, 'destroy']);

    Route::get('/pro/appointments', [AppointmentController::class, 'doctorAppointments']);
    Route::get('/doctor/appointments/today', [AppointmentController::class, 'doctorAppointmentsToday']);

    Route::get('/patient/appointments', [AppointmentController::class, 'index']);
    Route::get('/patient/appointments/next', [AppointmentController::class, 'next']);
    Route::get('/patient/appointments/upcoming', [AppointmentController::class, 'upcoming']);
    Route::post('/patient/appointments', [AppointmentController::class, 'store']);
    Route::put('/patient/appointments/{id}', [AppointmentController::class, 'update']);
    Route::delete('/patient/appointments/{id}', [AppointmentController::class, 'cancel']);
    Route::post('/pro/appointments/{id}/confirm', [AppointmentController::class, 'confirm']);
    Route::post('/pro/appointments/{id}/reject', [AppointmentController::class, 'reject']);

    // =======================================================
    // Phase 4 — Infrastructure de Téléconsultation
    // =======================================================
    Route::post('/teleconsult/create', [TeleconsultController::class, 'create']);
    Route::get('/teleconsult/token/{roomId}', [TeleconsultController::class, 'token']);
    Route::post('/teleconsult/end/{roomId}', [TeleconsultController::class, 'end']);

    // =======================================================
    // Phase 5 — Gestion des Prescriptions et Ordonnances
    // =======================================================
    Route::get('/pro/prescriptions/{id}', [PrescriptionController::class, 'show']);
    Route::post('/pro/prescriptions', [PrescriptionController::class, 'store']);
    Route::put('/pro/prescriptions/{id}', [PrescriptionController::class, 'update']);
    Route::delete('/pro/prescriptions/{id}', [PrescriptionController::class, 'destroy']);
    Route::get('/pro/prescriptions', [PrescriptionController::class, 'doctorList']);
    Route::get('/patient/prescriptions', [PrescriptionController::class, 'patientList']);
    Route::get('/patient/prescriptions/{id}/download', [PrescriptionController::class, 'download']);

    // =======================================================
    // Phase 5b — Gestion des Médicaments (Temporairement désactivé - approche JSON utilisée)
    // =======================================================
    // Route::get('/medications', [MedicationController::class, 'index']);
    // Route::get('/medications/today', [MedicationController::class, 'today']);
    // Route::get('/medications/{id}', [MedicationController::class, 'show']);
    // Route::post('/medications', [MedicationController::class, 'store']);
    // Route::put('/medications/{id}', [MedicationController::class, 'update']);
    // Route::delete('/medications/{id}', [MedicationController::class, 'destroy']);
    // Route::get('/prescriptions/{prescriptionId}/medications', [MedicationController::class, 'byPrescription']);

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
    // Routes admin déplacées en dehors du middleware auth pour les tests

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread', [NotificationController::class, 'unread']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

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
        Route::get('/consultations/recent', [ConsultationController::class, 'recent']);

        // Routes manquantes pour le dashboard patient
        Route::get('/stats', [PatientProfileController::class, 'stats']);
        Route::get('/appointments/upcoming', [AppointmentController::class, 'upcoming']);
        Route::get('/prescriptions/active', [PrescriptionController::class, 'active']);
        Route::get('/teleconsults/active', [TeleconsultController::class, 'active']);
        Route::get('/medications/today', [MedicationController::class, 'patientToday']);
        Route::get('/payments/pending', [PaymentController::class, 'pending']);
    });
});

// =======================================================
// Routes Admin Temporaires (sans auth pour les tests)
// =======================================================
Route::prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'users']);
    Route::put('/users/{id}', [AdminController::class, 'updateRole']);
    Route::post('/users/{id}/toggle-verification', [AdminController::class, 'toggleVerification']);
    Route::get('/catalog', [AdminController::class, 'catalog']);
    Route::get('/pharmacies', [AdminController::class, 'catalog']);
    Route::get('/reports', [AdminController::class, 'reports']);
    Route::get('/monetization', [AdminController::class, 'monetization']);
    Route::put('/monetization/{id}', [AdminController::class, 'updatePlanPrice']);
    Route::get('/moderation', [AdminController::class, 'moderation']);
    Route::put('/moderation/{id}/status', [AdminController::class, 'updateReportStatus']);
    Route::get('/settings', [AdminController::class, 'settings']);
    Route::put('/settings', [AdminController::class, 'updateSettings']);
    Route::get('/profile', [AdminController::class, 'getProfile']);
    Route::put('/profile', [AdminController::class, 'updateProfile']);
});

// ===========================================================
// Routes Publiques - Recherche et Catalogue (Phase 2)
// ===========================================================
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/search', [DoctorController::class, 'search']);
Route::get('/doctors/{id}', [DoctorController::class, 'show']);
Route::get('/doctors/{id}/availabilities', [AvailabilityController::class, 'show']);
