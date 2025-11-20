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
        Schema::table('doctor_profiles', function (Blueprint $table) {
            $table->string('specialty')->nullable()->after('user_id');
            $table->string('license_number')->nullable()->after('specialty');
            $table->string('country')->nullable()->after('city');
            $table->integer('experience_years')->default(0)->after('bio');
            $table->decimal('consultation_fee', 10, 2)->default(0)->after('experience_years');
            $table->json('languages')->nullable()->after('consultation_fee');
            $table->boolean('is_available')->default(true)->after('languages');
            $table->string('professional_document')->nullable()->after('is_available');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('doctor_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'specialty',
                'license_number',
                'country',
                'experience_years',
                'consultation_fee',
                'languages',
                'is_available',
                'professional_document'
            ]);
        });
    }
};
