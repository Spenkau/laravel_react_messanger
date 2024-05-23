<?php

namespace App\Http\Controllers;

use App\Http\Resources\GroupCollection;
use App\Models\Group;
use App\Models\MessageGroup;
use Illuminate\Database\Eloquent\Collection;

class GroupController extends Controller
{
    public function index()
    {
        return inertia('Group/Index', [
            'groups' => GroupCollection::make($this->getUserGroups()),
        ]);
    }

    public function show(int $id)
    {
        $selectedGroup = Group::find($id);


        return inertia('Group/Show', [
            'group' => $selectedGroup,
            'group_messages' => MessageGroup::query()
                ->where('group_id', '=', 2)
                ->join('users', 'message_group.user_id', '=', 'users.id')
                ->select('message_group.*', 'users.name as user_name')
                ->orderBy('created_at', 'desc')
                ->get(),
            ''
        ]);
    }



    /**
     * @return Collection
     */
    public function getUserGroups(): Collection
    {
        return Group::whereHas('users', function($query) {
            $query->where('user_id', 51);
        })->with('users')->get();
    }
}
