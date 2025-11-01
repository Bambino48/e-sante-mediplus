<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DoctorProfile extends Model
{
    protected $fillable = [
        'user_id',
        'city',
        'address',
        'phone',
        'fees',
        'bio',
        'availability',
        'rating',
        'primary_specialty',
    ];

    protected $casts = [
        'availability' => 'array',
        'rating' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
