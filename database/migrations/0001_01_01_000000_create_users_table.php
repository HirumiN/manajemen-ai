<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ---------------- USERS ----------------
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        // ---------------- PASSWORD RESET ----------------
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // ---------------- SESSIONS ----------------
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        // ---------------- INTERESTS ----------------
        Schema::create('interests', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        // ---------------- HOBBIES ----------------
        Schema::create('hobbies', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        // ---------------- SKILLS ----------------
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        // ---------------- CLASS SCHEDULES ----------------
        Schema::create('class_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('day', 20);
            $table->time('start_time');
            $table->time('end_time');
            $table->string('lecturer', 100);
            $table->string('room', 50)->nullable();
            $table->integer('credits')->nullable();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        // ---------------- ASSIGNMENTS ----------------
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->date('deadline');
            $table->string('status', 20)->default('in-progress');
            $table->enum('type', ['akademik', 'non-akademik'])->default('akademik');
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            $table->timestamps();
        });

        // ---------------- ORGANIZATIONS ----------------
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('role')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        // ---------------- WORK EXPERIENCES ----------------
        Schema::create('work_experiences', function (Blueprint $table) {
            $table->id();
            $table->string('position', 150);
            $table->string('company', 150);
            $table->string('location', 150);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        // ---------------- EDUCATION ----------------
        Schema::create('educations', function (Blueprint $table) {
            $table->id();
            $table->string('degree', 150)->nullable();
            $table->string('institution', 150);
            $table->string('location', 150);
            $table->text('description')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->decimal('gpa', 3, 2)->nullable();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('educations');
        Schema::dropIfExists('work_experiences');
        Schema::dropIfExists('organizations');
        Schema::dropIfExists('assignments');
        Schema::dropIfExists('class_schedules');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('hobbies');
        Schema::dropIfExists('interests');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
