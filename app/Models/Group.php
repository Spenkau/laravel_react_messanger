<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image_url',
        'last_message_id'
    ];

    /**
     * @return BelongsToMany
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_group', 'group_id', 'user_id');
    }

    /**
     * @return HasMany
     */
    public function messages(): HasMany
    {
        return $this->hasMany(MessageGroup::class, 'group_id', 'id')
            ->orderBy('created_at', 'desc');
    }

    public function scopeFilter(Builder $qb, array $query): Builder
    {
        foreach ($query as $key => $value) {
            if (in_array($key, $this->fillable)) {
                $qb->where($key, $value);
            }
        }

        return $qb;
    }
}
