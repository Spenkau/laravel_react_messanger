<?php

use App\Global\Enums\LimitEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('name', LimitEnum::NAME_LENGTH->value);
            $table->text('description');
            $table->string('image_url');

            $table->timestamps();
        });

        Schema::create('user_group', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('group_id')
                ->constrained('groups')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->string('second_name')->nullable();

            $table->timestamps();
        });

        Schema::create('message_group', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->string('message')->nullable();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('group_id')
                ->constrained('groups')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->timestamps();
        });

        Schema::create('message_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('message_id')
                ->constrained('message_group')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->string('name');
            $table->string('path', 1024);
            $table->string('mime', 255);
            $table->integer('size');
            $table->timestamps();
        });

        Schema::table('groups', function (Blueprint $table) {
            $table->foreignId('last_message_id')
                ->nullable()
                ->constrained('message_group')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groups');
        Schema::dropIfExists('user_group');
        Schema::dropIfExists('message_group');
        Schema::dropIfExists('message_attachments');
    }
};
