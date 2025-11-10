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
        Schema::dropIfExists('doctor_specialty');
        Schema::dropIfExists('specialties');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recréer les tables si nécessaire (mais on ne le fait pas car on supprime définitivement)
    }
};
