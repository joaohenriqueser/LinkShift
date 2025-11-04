<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shortlink extends Model
{
    use HasFactory;

   /** @var array<int, string> */
    protected $fillable = [
        'user_id',
        'slug',
        'title',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function variants(): HasMany {
        return $this->hasMany(ShortlinkVariant::class);
    }

    public function clicks(): HasMany {
        return $this->hasMany(ShortlinkClick::class);
    }


}
