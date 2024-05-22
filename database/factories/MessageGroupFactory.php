<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MessageGroup>
 */
class MessageGroupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => fake()->uuid,
            'message' => fake()->realText(),
            'user_id' => User::query()->whereId(fake()->numberBetween(50, 52)),
            'group_id' => fake()->numberBetween(1, 5)
        ];
    }
}
