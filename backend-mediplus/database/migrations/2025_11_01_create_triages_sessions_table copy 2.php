<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('triage_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->json('symptoms');
            $table->json('result'); // triage IA (diagnostic suggéré, degré urgence, recommandations)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('triage_sessions');
    }
};
