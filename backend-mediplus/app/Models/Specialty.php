<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Specialty extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'icon_url',
    ];

    // Relations
    public function doctors()
    {
        return $this->hasMany(DoctorProfile::class, 'specialty', 'name');
    }

    // Accesseurs
    public function getDoctorCountAttribute()
    {
        return $this->doctors()->count();
    }
}
