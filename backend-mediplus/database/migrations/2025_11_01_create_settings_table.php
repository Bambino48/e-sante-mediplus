<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value')->nullable();
            $table->timestamps();
        });

        DB::table('settings')->insert([
            ['key' => 'languages', 'value' => json_encode(['fr', 'en'])],
            ['key' => 'app_name', 'value' => json_encode('MediPlus')],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
