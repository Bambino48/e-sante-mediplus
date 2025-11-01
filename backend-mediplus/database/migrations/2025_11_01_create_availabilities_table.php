<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->constrained('users')->onDelete('cascade');
            $table->boolean('is_recurring')->default(true);
            $table->unsignedTinyInteger('day_of_week')->nullable(); // 1..7 (Lun..Dim) si récurrent
            $table->time('start_time');
            $table->time('end_time');
            $table->date('date')->nullable(); // si non récurrent
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('availabilities');
    }
};
