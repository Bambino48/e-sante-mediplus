<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pharmacy extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'city',
        'country',
        'postal_code',
        'latitude',
        'longitude',
        'license_number',
        'manager_name',
        'description',
        'opening_hours',
        'services',
        'emergency_contact',
        'is_active',
        'is_verified',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_active' => 'boolean',
        'is_verified' => 'boolean',
        'opening_hours' => 'array',
        'services' => 'array',
    ];
}
