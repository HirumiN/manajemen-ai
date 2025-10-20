<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClassSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'day',
        'start_time',
        'end_time',
        'lecturer',
        'room',
        'credits',
        'user_id',
    ];

    protected $table = 'class_schedules';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
