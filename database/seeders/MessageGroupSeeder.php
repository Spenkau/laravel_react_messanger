<?php

namespace Database\Seeders;

use App\Models\MessageGroup;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MessageGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 0; $i < 50; $i++) {
            MessageGroup::create([
                'uuid' => fake()->uuid,
                'message' => fake()->realText(),
                'user_id' => fake()->numberBetween(1, 50),
                'group_id' => fake()->numberBetween(1, 50)
            ]);
        }
    }
}
