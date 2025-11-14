<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            // Étendre l'enum status pour inclure plus de valeurs
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'])->default('pending')->change();

            // Ajouter des champs utiles
            $table->unsignedSmallInteger('duration')->default(30)->after('scheduled_at'); // durée en minutes
            $table->boolean('reminder_sent')->default(false)->after('notes');
            $table->text('cancellation_reason')->nullable()->after('reminder_sent');

            // Ajouter des index pour améliorer les performances
            $table->index(['patient_id', 'scheduled_at'], 'idx_appointments_patient_scheduled');
            $table->index(['doctor_id', 'scheduled_at'], 'idx_appointments_doctor_scheduled');
            $table->index('status', 'idx_appointments_status');
            $table->index('scheduled_at', 'idx_appointments_scheduled_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            // Supprimer les index
            $table->dropIndex('idx_appointments_patient_scheduled');
            $table->dropIndex('idx_appointments_doctor_scheduled');
            $table->dropIndex('idx_appointments_status');
            $table->dropIndex('idx_appointments_scheduled_at');

            // Supprimer les colonnes ajoutées
            $table->dropColumn(['duration', 'reminder_sent', 'cancellation_reason']);

            // Revenir à l'enum original
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending')->change();
        });
    }
};
