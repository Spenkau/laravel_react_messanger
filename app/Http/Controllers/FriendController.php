<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\UserFriend;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FriendController extends Controller
{
    public function index()
    {
        return inertia('Friend/Index', [
            'friends' => $this->getFriends()
        ]);
    }

    public function json()
    {
        return response()->json(['data' => $this->getFriends()]);
    }

    public function getFriends()
    {
        $meSent = User::query()
            ->join('user_friend', 'users.id', '=', 'user_friend.friend_id')
            ->where('user_friend.user_id', '=', auth()->id())
            ->where('user_friend.is_accepted', true)
            ->select('users.*');

        $toMeSent = User::query()
            ->join('user_friend', 'users.id', '=', 'user_friend.user_id')
            ->where('user_friend.friend_id', '=', auth()->id())
            ->where('user_friend.is_accepted', true)
            ->select('users.*');

        return $meSent->union($toMeSent)->where('users.id', '<>', auth()->id())->get();
    }

    public function show(string $name)
    {
        return response()->json([
            'success' => true,
            'data' => UserResource::collection(
                auth()->user()->query()
                    ->where('name', 'LIKE', "%$name%")
                    ->orWhere('email', 'LIKE', "%$name%")
                    ->get()
            )
        ]);
    }

    public function showBids(): \Illuminate\Http\JsonResponse
    {
        $bids = User::query()
            ->join('user_friend', 'users.id', '=', 'user_friend.friend_id')
            ->where('user_friend.user_id', '=', auth()->id())
            ->where('user_friend.is_accepted', false)
            ->select('users.*')->get();

//        $bids = $meSent->union($toMeSent)->where('users.id', '<>', auth()->id())->get();

        return response()->json([
            'success' => true,
            'data' => UserResource::collection($bids)
        ]);
    }

    public function sendBid(Request $request)
    {
        $user = auth()->user();
        $friendId = $request->input('friend_id');

        if ($user->friendsOfMine()->where('friend_id', $friendId)->exists()) {
            return response()->json(['message' => 'Запрос уже отправлен']);
        }

        $user->friendsOfMine()->attach($friendId, ['is_accepted' => false]);

        return response()->json(['message' => 'Запрос успешно отправлен']);
    }

    public function acceptBid(Request $request)
    {
        $friendId = $request->friend_id;

        $rec = UserFriend::query()->where([
            'user_id' => auth()->id(),
            'friend_id' => $friendId
        ])->first();


        if (!$rec) {
            return response()->json(['error' => 'Запрос на дружбу не найден']);
        }

        $rec->update(['is_accepted' => true]);

        return response()->json(['message' => 'Запрос на дружбу принят']);
    }

    public function rejectBid(Request $request)
    {
        $friendId = $request->friend_id;

        $rec = UserFriend::query()->where([
            'user_id' => auth()->id(),
            'friend_id' => $friendId
        ])->first();

        if (! $rec) {
            return response()->json(['message' => 'Запрос на дружбу не найден']);
        }

        $rec->delete();

        return response()->json(['message' => 'Запрос на дружбу отклонен']);
    }

    public function store(Request $request)
    {
        try {
            $user = auth()->user();
            $friend = User::query()->findOrFail($request->friend_id);

            $user->friendsOfMine()->updateExistingPivot($friend->id, ['is_accepted' => 1]);

            return response()->json(['message' => 'Друг добавлен']);
        } catch (\Exception $exception) {
            return response()->json(['error' => 'Ошибка добавления в друзья']);
        }
    }

    public function destroy(int $friendId)
    {
        $user = auth()->user();
        $friend = User::findOrFail($friendId);

        $user->friends()->detach($friend->id);

        return response()->json(['message' => "$friend->name удален из списка друзей!"]);
    }

    public function findUser(string $name): \Illuminate\Http\JsonResponse
    {
        $users = User::query()->where('name', 'LIKE', "%$name%")
            ->orWhere('email', 'LIKE', "%$name%")
            ->get();

        return response()->json([
            'success' => true,
            'data' => UserResource::collection($users)
        ]);
    }
}
