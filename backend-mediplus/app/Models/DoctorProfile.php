<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class DoctorProfile extends Model
{
    protected $fillable = [
        'user_id',
        'specialty',
        'license_number',
        'address',
        'city',
        'country',
        'bio',
        'experience_years',
        'consultation_fee',
        'languages',
        'availability',
        'is_available',
        'rating',
        'professional_document',
        'phone',
        'fees',
        'primary_specialty',
    ];

    protected $casts = [
        'rating' => 'float',
        'experience_years' => 'integer',
        'consultation_fee' => 'decimal:2',
        'is_available' => 'boolean',
        'languages' => 'array',
        'availability' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
