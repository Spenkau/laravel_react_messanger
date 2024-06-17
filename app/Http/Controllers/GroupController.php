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
            'group' => $selectedGroup,
            'groups' => GroupCollection::make($this->getUserGroups($request->query())),
            'group_messages' => MessageGroup::query()
                ->where('group_id', '=', $selectedGroup->id)
                ->join('users', 'message_group.user_id', '=', 'users.id')
                ->select('message_group.*', 'users.name as user_name')
                ->orderBy('created_at', 'desc')
                ->get(),
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

        $group->users()->attach(Auth::id());

        return redirect()->back();
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

            DB::table('user_group')->insert(['user_id' => $friend->id, 'group_id' => $group->id]);

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
     * @return void
     */
    public function updateMessage(UpdateRequest $request)
    {
        MessageGroup::query()->update($request->validated());
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
