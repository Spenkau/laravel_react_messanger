<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\ProfileController;
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
    $messages = MessageGroup::query()
        ->where('group_id', '=', 2)
        ->join('users', 'message_group.user_id', '=', 'users.id')
        ->select('message_group.*', 'users.name as user_name')
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json(['groups' => $messages]);
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
            Route::prefix('message')
                ->name('message.')
                ->group(function () {
                    Route::post('store', 'storeMessage')->name('store');
                    Route::patch('update', 'updateMessage')->name('update');
                    Route::delete('delete/{message}', 'destroyMessage')->name('destroy');
                });
        });


    Route::prefix('friend')
        ->controller(FriendController::class)
        ->name('friend.')
        ->group(function () {
            Route::get('', 'index')->name('index');
            Route::get('json', 'json')->name('json');
            Route::get('bid', 'showBids')->name('bid');
            Route::post('', 'store')->name('store');
            Route::delete('{id}', 'destroy')->name('delete')->whereNumber('id');
        });
});

require __DIR__ . '/auth.php';
