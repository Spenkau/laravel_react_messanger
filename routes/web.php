<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\YandexVideoController;
use App\Http\Resources\UserResource;
use App\Models\Group;
use App\Models\MessageGroup;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('test', function () {
//    $groups = Group::whereHas('users', function($query) {
//        $query->where('user_id', 51);
//    })->with('users')->get();
    return response()->json(['data' => \App\Models\Chat::query()->where('message', 'test')->get()]);
});

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/about-us', function () {
    return Inertia::render('AboutUs');
})->name('about-us');

Route::get('/meet', function () {
    return Inertia::render('Meet');
})->name('meet');

Route::get('user/show/{id}', fn (Request $request) => response()->json(['data' => UserResource::make(User::query()->firstWhere('id', '=', $request->id))]))->whereNumber('id');

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'user.last.seen.at'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('chat')
        ->controller(ChatController::class)
        ->group(function () {
            Route::get('', 'index')->name('chat.index');
            Route::delete('delete/{chat}', 'destroy')->name('chat.destroy');
            Route::prefix('{user:uuid}')
                ->group(function () {
                    Route::get('', 'show')->name('chat.show');
                    Route::post('', 'chat')->name('chat.store');
                });
        });

    Route::prefix('group')
        ->controller(GroupController::class)
        ->name('group.')
        ->group(function () {
            Route::get('', 'index')->name('index');
            Route::get('/search', 'search')->name('search');
            Route::get('{id}', 'show')->name('show');
            Route::post('', 'store')->name('store');
            Route::post('/add-friend', 'addFriend')->name('add-friend');
            Route::delete('/{id}', 'delete')->name('delete')->whereNumber('id');
            Route::delete('/{groupId}/user/{userId}', 'detachUser')->name('delete-user');
            Route::put('/{groupId}/user/{userId}/role', 'changeUserRole')->name('change-user');
            Route::prefix('message')
                ->name('message.')
                ->group(function () {
                    Route::post('store', 'storeMessage')->name('store');
                    Route::put('update', 'updateMessage')->name('update');
                    Route::delete('delete/{message}', 'destroyMessage')->name('destroy');
                });
        });


    Route::prefix('friend')
        ->controller(FriendController::class)
        ->name('friend.')
        ->group(function () {
            Route::get('', 'index')->name('index');
            Route::get('{name}', 'findUser')->name('find');
            Route::get('json', 'json')->name('json');
            Route::get('bid', 'showBids')->name('bid');
            Route::post('sendBid', 'sendBid')->name('sendBid');
            Route::post('acceptBid', 'acceptBid')->name('acceptBid');
            Route::post('rejectBid', 'rejectBid')->name('rejectBid');
            Route::delete('{id}', 'destroy')->name('delete')->whereNumber('id');
        });
});

Route::get('friendsInJson', function () {
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

    return response()->json(['data' => $meSent->union($toMeSent)->where('users.id', '<>', auth()->id())->get()]);
});

Route::get('showBids', function () {

    $bids = User::query()
        ->join('user_friend', 'users.id', '=', 'user_friend.friend_id')
        ->where('user_friend.user_id', '=', auth()->id())
        ->where('user_friend.is_accepted', false)
        ->select('users.*')->get();

    return response()->json([
        'success' => true,
        'data' => UserResource::collection($bids)
    ]);
});

Route::post('create-meeting', [YandexVideoController::class, 'createMeeting']);

require __DIR__ . '/auth.php';
