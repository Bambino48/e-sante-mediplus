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
        Schema::create('medications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prescription_id')->constrained('prescriptions')->onDelete('cascade');
            $table->string('name');
            $table->string('dosage'); // ex: "500mg", "10ml"
            $table->integer('frequency'); // nombre de prises par jour
            $table->json('times')->nullable(); // ex: ["08:00", "13:00", "21:00"]
            $table->integer('duration_days'); // durée du traitement en jours
            $table->date('start_date'); // date de début du traitement
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medications');
    }
};
