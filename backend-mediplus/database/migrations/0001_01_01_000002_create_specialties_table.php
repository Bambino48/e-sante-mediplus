<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('specialties', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        // Optionnel: quelques valeurs seed légères
        DB::table('specialties')->insert([
            ['name' => 'Cardiologie'],
            ['name' => 'Dermatologie'],
            ['name' => 'Pédiatrie'],
            ['name' => 'Gynécologie'],
            ['name' => 'ORL'],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('specialties');
    }
};
