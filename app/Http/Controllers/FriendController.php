<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

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

    public function showBids()
    {
            $bids = User::query()
                ->join('user_friend', 'users.id', '=', 'user_friend.user_id')
                ->where('user_friend.friend_id', auth()->id())
                ->where('user_friend.is_accepted', false)
                ->get(['users.*']);

            return response()->json([
                'success' => true,
                'data' => UserCollection::make($bids)
            ]);
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
}
