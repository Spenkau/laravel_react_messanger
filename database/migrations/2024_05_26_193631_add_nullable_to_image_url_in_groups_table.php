<?php

use App\Enums\GroupAccessEnum;
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
        Schema::table('groups', function (Blueprint $table) {
            $table->string('image_url')->nullable()->after('description');
            $table->enum('access', GroupAccessEnum::toArray())->default(GroupAccessEnum::PUBLIC->value)->after('image_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('groups', function (Blueprint $table) {
            $table->dropColumn('image_url');
            $table->dropColumn('access');
        });
    }
};
