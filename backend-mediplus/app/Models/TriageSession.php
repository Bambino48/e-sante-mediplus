<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TriageSession extends Model
{
    protected $fillable = ['patient_id', 'symptoms', 'result'];

    protected $casts = [
        'symptoms' => 'array',
        'result' => 'array',
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }
}
