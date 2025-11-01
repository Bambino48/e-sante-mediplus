<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('triages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->json('symptoms');
            $table->string('duration');
            $table->enum('severity', ['mild', 'moderate', 'severe'])->default('mild');
            $table->longText('analysis');
            $table->string('recommendation');
            $table->string('ai_model')->default('openai');
            $table->decimal('confidence_score', 3, 2)->nullable();
            $table->timestamps();

            $table->index('severity');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('triages');
    }
};
