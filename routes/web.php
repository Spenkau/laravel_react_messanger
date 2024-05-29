<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\ProfileController;
use App\Models\Group;
use App\Models\MessageGroup;
use App\Models\User;
use Illuminate\Foundation\Application;
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
        ->orderBy('created_at', 'asc')
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

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
            Route::get('{id}', 'show')->name('show');
            Route::post('', 'store')->name('store');
            Route::prefix('message')
                ->name('message.')
                ->group(function () {
                    Route::post('store', 'storeMessage')->name('store');
                    Route::patch('update', 'updateMessage')->name('update');
                    Route::delete('delete/{message}', 'destroyMessage')->name('destroy');
                });
        });

});

require __DIR__ . '/auth.php';
