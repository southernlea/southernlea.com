<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSpecialsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
//        Schema::create('specials', function (Blueprint $table) {
//            $table->increments('id');
//            $table->string('name');
//            $table->string('size')->nullable()->default(null);
//            $table->string('image')->nullable()->default(null);
//            $table->decimal('price', 8,2);
//            $table->timestamps();
//        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('specials');
    }
}
