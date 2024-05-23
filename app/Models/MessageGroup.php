<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MessageGroup extends Model
{
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'message_group';

    /**
     * @var string[]
     */
    protected $fillable = [
        'uuid',
        'message',
        'user_id',
        'group_id',
    ];

    /**
     * @return BelongsTo
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
