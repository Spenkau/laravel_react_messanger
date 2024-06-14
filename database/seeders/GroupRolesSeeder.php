<?php

namespace Database\Seeders;

use App\Enums\GroupRoleEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GroupRolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        array_map(function($enum) {
            DB::table('group_roles')->insert([
                'id' => $enum->value,
                'name' => strtolower($enum->name),
            ]);
        }, GroupRoleEnum::cases());
    }
}
