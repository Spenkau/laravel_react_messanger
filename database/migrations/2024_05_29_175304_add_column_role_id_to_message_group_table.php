<?php

use Database\Seeders\GroupRolesSeeder;
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
        app()->make(GroupRolesSeeder::class)->run();

        Schema::table('message_group', function (Blueprint $table) {
            $table->unsignedBigInteger('role_id')->default(1)->after('user_id');

            $table->foreign('role_id')->references('id')->on('group_roles')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('message_group', function (Blueprint $table) {
            $table->dropColumn('role_id');
        });
    }
};
