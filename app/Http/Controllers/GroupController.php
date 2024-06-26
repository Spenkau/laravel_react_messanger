<?php

namespace App\Http\Controllers;

use App\Http\Requests\Group\StoreRequest;
use App\Http\Requests\GroupMessage\StoreRequest as StoreMessageRequest;
use App\Http\Requests\GroupMessage\UpdateRequest;
use App\Http\Resources\GroupCollection;
use App\Models\Group;
use App\Models\MessageGroup;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        return inertia('Group/Index', [
            'groups' => GroupCollection::make($this->getUserGroups($request->all())),
        ]);
    }

    public function jsonGroups()
    {
        return response()->json(['data' => GroupCollection::make($this->getUserGroups())]);
    }

    public function search(Request $request)
    {
        return response()->json(GroupCollection::make($this->getUserGroups($request->query())));
    }

    public function show(int $id, Request $request)
    {
        $selectedGroup = Group::find($id);

        return inertia('Group/Show', [
            'group' => $selectedGroup->load('users'),
            'groups' => GroupCollection::make($this->getUserGroups($request->query())),
            'group_messages' => MessageGroup::query()
                ->where('group_id', '=', $selectedGroup->id)
                ->join('users', 'message_group.user_id', '=', 'users.id')
                ->select('message_group.*', 'users.name as user_name')
                ->orderBy('created_at', 'desc')
                ->get(),
            'groupUser' => $selectedGroup->users()->where('user_id', auth()->id())->first()
        ]);
    }

    /**
     * @param StoreRequest $request
     * @return RedirectResponse
     */
    public function store(StoreRequest $request)
    {
        if ($request->hasFile('image')) {
            $this->storeImage($request->file('image'));
        }

        $group = Group::create(Arr::except($request->validated(), 'image'));

        $group->users()->attach(Auth::id(), ['role_id' => 3]);

        return redirect()->back();
    }

    public function delete(int $id): JsonResponse
    {
        $group = Group::query()->find($id);
        $group->delete();

        return response()->json(['message' => 'Группа удалена!']);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function addFriend(Request $request)
    {
        try {
            $group = Group::findOrFail($request->group_id);
            $friend = User::findOrFail($request->friend_id);

            DB::table('user_group')->insert(['user_id' => $friend->id, 'group_id' => $group->id, 'role_id' => 0]);

            return response()->json(['message' => 'Друг добавлен в группу']);
        } catch (\Exception $exception) {
            return response()->json(['error' => 'Ошибка добавления друга в группу']);
        }
    }

    /**
     * @param StoreMessageRequest $request
     * @return RedirectResponse
     */
    public function storeMessage(StoreMessageRequest $request)
    {
        $message = MessageGroup::create($request->validated());

        broadcast($message);

        return redirect()->back();
    }

    /**
     * @param UpdateRequest $request
     * @return JsonResponse
     */
    public function updateMessage(UpdateRequest $request): JsonResponse
    {
        $data = $request->validated();

        $message = MessageGroup::find($data['id']);
        if ($message) {
            $message->update(['message' => $data['message']]);
        }

        $groupMessages = MessageGroup::query()
            ->where('group_id', '=', $data['group_id'])
            ->join('users', 'message_group.user_id', '=', 'users.id')
            ->select('message_group.*', 'users.name as user_name')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'group_messages' => $groupMessages,
        ]);
    }

    public function detachUser(int $groupId, int $userId)
    {
        try {
            $group = Group::findOrFail($groupId);

            $group->users()->detach($userId);

            return response()->json(['message' => 'Пользователь успешно удален из группы']);
        } catch (\Exception $exception) {
            return response()->json(['error' => 'Ошибка при удалении пользователя из группы'], 500);
        }
    }

    public function changeUserRole(int $groupId, int $userId, Request $request): JsonResponse
    {
        try {
            $group = Group::findOrFail($groupId);

            $group->users()->attach($userId, ['role_id' => $request->role_id]);

            return response()->json(['message' => 'Пользователю успешно изменен статус']);
        } catch (\Exception $exception) {
            return response()->json(['message' => 'Ошибка изменения статуса'], 500);
        }
    }


    /**
     * @param MessageGroup $message
     * @return void
     */
    public function destroyMessage(MessageGroup $message)
    {
        if ($message->user_id != Auth::id()) {
            abort(403);
        }

        $message->delete();
    }

    /**
     * @param array|string|null $query
     * @return Collection
     */
    public function getUserGroups(array|string|null $query = null)
    {
        return Group::query()->when(
            $query,
            fn($q) => $q->filter($query)
        )->whereHas('users', function($query) {
            $query->where('user_id', Auth::id());
        })->with('users')->get();
    }

    public function getImage()
    {
        Storage::putFile(
            'images'
        );

        return Storage::url('public');
    }

    public function storeImage($image)
    {

    }
}
