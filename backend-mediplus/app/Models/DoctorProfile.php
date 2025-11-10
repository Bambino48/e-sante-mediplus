<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class DoctorProfile extends Model
{
    protected $fillable = [
        'user_id',
        'city',
        'address',
        'phone',
        'fees',
        'bio',
        'rating',
        'primary_specialty',
        'specialty',
        'professional_document',
    ];

    protected $casts = [
        'rating' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
