<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShortlinkClick extends Model
{
    use HasFactory;

    /** @var array<int, string> */
    protected $fillable = [
        'shortlink_id',
        'shortlink_variant_id',
    ];

    public function shortlink(): BelongsTo {
        return $this->belongsTo(Shortlink::class);
    }

    public function variant(): BelongsTo {
        return $this->belongsTo(ShortlinkVariant::class);
    }
}
