<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserCollection;
use App\Models\User;
use App\Services\ChatService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        protected readonly ChatService $chatService
    ) {}

    public function index()
    {
        return inertia('Dashboard', ['users' => UserCollection::make($this->chatService->getChatWithUser(5))]);
    }
}
