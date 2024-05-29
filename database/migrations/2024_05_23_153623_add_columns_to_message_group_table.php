<?php

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
        Schema::table('message_group', function (Blueprint $table) {
            $table->unsignedBigInteger('reply_id')->nullable()->after('message');

            $table->foreign('reply_id')
                ->references('id')
                ->on('message_group')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();



            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('message_group', function (Blueprint $table) {
            $table->dropColumn('reply_id');
            $table->dropSoftDeletes();
        });
    }
};
