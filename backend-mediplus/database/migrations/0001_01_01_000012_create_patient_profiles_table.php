<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patient_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // 🩺 Informations personnelles
            $table->date('date_of_birth')->nullable();
            $table->string('gender', 20)->nullable(); // "Masculin", "Féminin", etc.
            $table->string('blood_group', 5)->nullable(); // "A+", "O-", etc.
            $table->float('height')->nullable(); // en cm
            $table->float('weight')->nullable(); // en kg

            // 📋 Informations médicales
            $table->text('allergies')->nullable();
            $table->text('chronic_diseases')->nullable();
            $table->text('medications')->nullable();
            $table->text('emergency_contact')->nullable();

            // 🏠 Adresse
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patient_profiles');
    }
};
