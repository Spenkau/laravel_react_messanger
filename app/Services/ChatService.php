<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class ChatService {
    /**
     * @param int|null $amount
     * @return Collection|array
     */
    public function getChatWithUser(int $amount = null): Collection|array
    {
        return User::query()
            ->whereHas('receiveMessages', function ($query) {
                $query->where('sender_id', auth()->id());
            })
            ->orWhereHas('sendMessages', function ($query) {
                $query->where('receiver_id', auth()->id());
            })
            ->withCount(['messages' => fn($query) => $query->where('receiver_id', auth()->id())->whereNull('seen_at')])
            ->with([
                'sendMessages' => function ($query) {
                    $query->whereIn('id', function ($query) {
                        $query->selectRaw('max(id)')
                            ->from('chats')
                            ->where('receiver_id', auth()->id())
                            ->groupBy('sender_id');
                    });
                },
                'receiveMessages' => function ($query) {
                    $query->whereIn('id', function ($query) {
                        $query->selectRaw('max(id)')
                            ->from('chats')
                            ->where('sender_id', auth()->id())
                            ->groupBy('receiver_id');
                    });
                },
            ])
            ->orderByDesc(function ($query) {
                $query->select('created_at')
                    ->from('chats')
                    ->whereColumn('sender_id', 'users.id')
                    ->orWhereColumn('receiver_id', 'users.id')
                    ->orderByDesc('created_at')
                    ->limit(1);
            })
            ->when(
                $amount,
                fn ($query) => $query->take($amount)
            )
            ->get();
    }
}
