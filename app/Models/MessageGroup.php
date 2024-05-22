<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessageGroup extends Model
{
    use HasFactory;

    protected $table = 'message_group';

    protected $fillable = [
        'uuid',
        'message',
        'user_id',
        'group_id',
    ];
}
