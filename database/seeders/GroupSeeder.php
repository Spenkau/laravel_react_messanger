<?php

namespace Database\Seeders;

use App\Models\Group;
use Faker\Factory;
use Illuminate\Database\Seeder;

class GroupSeeder extends Seeder
{

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 0; $i < 60; $i++) {
            Group::create([
                'name' => implode('', fake()->words(5)),
                'description' => fake()->realText(),
                'image_url' => fake()->imageUrl,
                'last_message_id' => null
            ]);
        }
    }
}
