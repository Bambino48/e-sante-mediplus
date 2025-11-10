<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('doctor_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Profil
            $table->string('city')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->integer('fees')->default(0); // tarif consultation en F CFA
            $table->text('bio')->nullable();
            $table->json('availability')->nullable(); // ex: ["Lun 08:00-12:00", ...]
            $table->float('rating')->default(0);

            // Spécialité principale (facile pour recherche)
            $table->string('primary_specialty')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctor_profiles');
    }
};
