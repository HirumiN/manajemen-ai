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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

       // Interests
        Schema::create('interests', function (Blueprint $table) {
            $table->id('id_interest');
            $table->unsignedBigInteger('id_user');
            $table->string('interest_name', 100);
            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        // Hobbies
        Schema::create('hobbies', function (Blueprint $table) {
            $table->id('id_hobby');
            $table->unsignedBigInteger('id_user');
            $table->string('hobby_name', 100);
            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        // Skills
        Schema::create('skills', function (Blueprint $table) {
            $table->id('id_skill');
            $table->unsignedBigInteger('id_user');
            $table->string('skill_name', 100);
            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        // Class Schedules
        Schema::create('class_schedules', function (Blueprint $table) {
            $table->id('id_schedule');
            $table->unsignedBigInteger('id_user');
            $table->string('course_name', 100);
            $table->string('day', 20);
            $table->string('time', 10);
            $table->string('lecturer', 100);
            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        // Student Organizations (UKM)
        Schema::create('organizations', function (Blueprint $table) {
            $table->id('id_org');
            $table->unsignedBigInteger('id_user');
            $table->string('org_name', 100);
            $table->text('description')->nullable();
            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        // Assignments
        Schema::create('assignments', function (Blueprint $table) {
            $table->id('id_assignment');
            $table->unsignedBigInteger('id_user');
            $table->string('assignment_name', 150);
            $table->date('deadline');
            $table->string('status', 20);
            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        // Todo List
        Schema::create('todo_lists', function (Blueprint $table) {
            $table->id('id_todo');
            $table->unsignedBigInteger('id_user');
            $table->string('activity', 150);
            $table->string('priority', 10);
            $table->string('status', 20);
            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        // Work Experience
        Schema::create('work_experiences', function (Blueprint $table) {
            $table->id('id_experience');
            $table->unsignedBigInteger('id_user');
            $table->string('position', 150);
            $table->string('company', 150);
            $table->string('location', 150);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->text('description')->nullable();
            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        // Education
        Schema::create('education', function (Blueprint $table) {
            $table->id('id_education');
            $table->unsignedBigInteger('id_user');
            $table->string('degree', 150)->nullable();
            $table->string('institution', 150);
            $table->string('location', 150);
            $table->text('description')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->decimal('gpa', 3, 2)->nullable();
            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('education');
        Schema::dropIfExists('work_experiences');
        Schema::dropIfExists('todo_lists');
        Schema::dropIfExists('assignments');
        Schema::dropIfExists('organizations');
        Schema::dropIfExists('class_schedules');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('hobbies');
        Schema::dropIfExists('interests');
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
