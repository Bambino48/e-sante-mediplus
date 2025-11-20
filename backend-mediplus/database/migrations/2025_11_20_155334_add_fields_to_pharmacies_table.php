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
        Schema::table('pharmacies', function (Blueprint $table) {
            $table->string('city')->nullable()->after('name');
            $table->string('country')->nullable()->after('city');
            $table->string('postal_code', 10)->nullable()->after('country');
            $table->string('license_number')->nullable()->after('postal_code');
            $table->string('manager_name')->nullable()->after('license_number');
            $table->text('description')->nullable()->after('manager_name');
            $table->json('opening_hours')->nullable()->after('description');
            $table->json('services')->nullable()->after('opening_hours');
            $table->string('emergency_contact')->nullable()->after('services');
            $table->boolean('is_verified')->default(false)->after('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pharmacies', function (Blueprint $table) {
            $table->dropColumn([
                'city',
                'country',
                'postal_code',
                'license_number',
                'manager_name',
                'description',
                'opening_hours',
                'services',
                'emergency_contact',
                'is_verified'
            ]);
        });
    }
};
