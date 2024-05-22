<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Scout\Searchable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, Searchable;

    /**
     * @var string[]
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'uuid',
        'last_seen_at',
    ];

    /**
     * @var string[]
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * @var string[]
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'last_seen_at' => 'datetime',
    ];

    /**
     * @return string
     */
    public function searchableAs(): string
    {
        return 'users_index';
    }

    /**
     * @return array
     */
    public function toSearchableArray(): array
    {
        return [
            'name' => $this->name,
            'username' => $this->username,
        ];
    }

    /**
     * @return HasMany
     */
    public function receiveMessages(): HasMany
    {
        return $this->hasMany(Chat::class, 'receiver_id', 'id')->orderByDesc('id');
    }

    /**
     * @return HasMany
     */
    public function sendMessages(): HasMany
    {
        return $this->hasMany(Chat::class, 'sender_id', 'id')->orderByDesc('id');
    }

    /**
     * @return HasMany
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Chat::class, 'sender_id', 'id');
    }
}
