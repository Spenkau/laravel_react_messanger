<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\User;
use App\Models\UserGroup;
use Illuminate\Database\Seeder;

class UserGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        for ($i = 0; $i < 50; $i++) {
            UserGroup::create([
                'user_id' => fake()->numberBetween(1, 50),
                'group_id' => fake()->unique()->numberBetween(1, 50)
            ]);
        }
    }
}
