<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShortlinkVariant extends Model
{
    use HasFactory;

    /** @var array<int, string> */
    protected $fillable = [
        'shortlink_id',
        'url',
        'weight',
    ];

    public function shortlink(): BelongsTo {
        return $this->belongsTo(Shortlink::class);
    }

    public function clicks(): HasMany {
        return $this->hasMany(ShortlinkClick::class);
    }
}
