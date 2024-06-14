<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FriendController extends Controller
{
    public function index()
    {
        return inertia('Friend/Index', [
            'friends' => Auth::user()->friends
        ]);
    }

    public function show(string $name)
    {
        return response()->json([
            'success' => true,
            'data' => UserResource::collection(
                Auth::user()->query()
                    ->where('name', 'LIKE', "%$name%")
                    ->orWhere('email', 'LIKE', "%$name%")
                    ->get()
            )
        ]);
    }

    public function showBids()
    {
        return response()->json([
            'success' => true,
            'data' => UserResource::collection(Auth::user()->friendRequest()->get())
        ]);
    }

    public function acceptBid(int $friendId)
    {
        $friend = Auth::user()
            ->friends()
            ->where('friend_id', '=', $friendId)
            ->first();

        $friend->update(['is_accepted' => true]);
    }

    public function store(Request $request)
    {
        try {
            $user = auth()->user();
            $friend = User::query()->findOrFail($request->friend_id);

            $user->friends()->attach($friend->id);

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
