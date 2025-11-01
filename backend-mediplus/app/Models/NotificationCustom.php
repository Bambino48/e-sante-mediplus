<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationCustom extends Model
{
    protected $table = 'notifications_custom';

    protected $fillable = ['user_id', 'type', 'data', 'read_at'];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
