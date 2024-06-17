<?php

namespace App\Http\Resources;

use App\Helpers\Helper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'username' => $this->username,
            'name' => $this->name,
            'email' => $this->email,
            'last_seen_at' => Helper::userLastActivityStatus($this->last_seen_at),
            'messages' => MessageResource::collection($this->whenLoaded('messages')),
            'messages_count' => $this->whenCounted('messages', $this->messages_count),
            'receive_messages' => MessageResource::collection($this->whenLoaded('receiveMessages')),
            'send_messages' => MessageResource::collection($this->whenLoaded('sendMessages')),
            'is_friend' => DB::table('user_friend')
                ->whereExists(fn ($query) => $query->where('user_id', $this->id)->where('friend_id', auth()->id()))
                ->orWhereExists(fn ($query) => $query->where('user_id', auth()->id())->where('friend_id', $this->id))
        ];
    }
}
