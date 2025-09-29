<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Assignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'deadline',
        'status',
        'user_id',
    ];

    protected $casts = [
        'deadline' => 'date',
    ];

    protected $table = 'assignments';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
