<?php

namespace App\Http\Controllers;

use App\Http\Requests\Group\StoreRequest;
use App\Http\Requests\GroupMessage\StoreRequest as StoreMessageRequest;
use App\Http\Requests\GroupMessage\UpdateRequest;
use App\Http\Resources\GroupCollection;
use App\Models\Group;
use App\Models\MessageGroup;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        return inertia('Group/Index', [
            'groups' => GroupCollection::make($this->getUserGroups($request->all())),
        ]);
    }

    public function show(int $id)
    {
        $selectedGroup = Group::find($id);


        return inertia('Group/Show', [
            'group' => $selectedGroup,
            'groups' => GroupCollection::make($this->getUserGroups()),
            'group_messages' => MessageGroup::query()
                ->where('group_id', '=', 2)
                ->join('users', 'message_group.user_id', '=', 'users.id')
                ->select('message_group.*', 'users.name as user_name')
                ->orderBy('created_at', 'desc')
                ->get(),
            ''
        ]);
    }

    public function store(StoreRequest $request)
    {
        if ($request->hasFile('image')) {
            $this->storeImage($request->file('image'));
        }

        $group = Group::create(Arr::except($request->validated(), 'image'));

        $group->users()->attach(Auth::id());

        return redirect()->back();
    }

    public function storeMessage(StoreMessageRequest $request)
    {
        $message = MessageGroup::create($request->validated());

        broadcast($message);

        return redirect()->back();
    }

    public function updateMessage(UpdateRequest $request)
    {
        MessageGroup::query()->update($request->validated());
    }

    public function destroyMessage(MessageGroup $message)
    {
        if ($message->user_id != Auth::id()) {
            abort(403);
        }

        $message->delete();
    }

    /**
     * @param array|null $query
     * @return Collection
     */
    public function getUserGroups(array|null $query = null): Collection
    {
        return Group::when(
            $query,
            fn($q) => $q->filter($query)
        )->whereHas('users', function($query) {
            $query->where('user_id', 51);
        })->with('users')->get();
    }

    public function getImage()
    {
        Storage::putFile(
            'images'
        );

        return Storage::url();
    }

    public function storeImage($image)
    {

    }
}
