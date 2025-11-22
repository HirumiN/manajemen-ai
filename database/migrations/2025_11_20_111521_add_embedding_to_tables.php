<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Aktifkan ekstensi vector
        DB::statement('CREATE EXTENSION IF NOT EXISTS vector');

        // 2. Tambahkan ke Class Schedules (Jadwal Kuliah) - BARU
        if (Schema::hasTable('class_schedules')) {
            DB::statement('ALTER TABLE class_schedules ADD COLUMN IF NOT EXISTS embedding vector(768)');
        }

        // 3. Tambahkan ke Assignments (Tugas)
        if (Schema::hasTable('assignments')) {
            DB::statement('ALTER TABLE assignments ADD COLUMN IF NOT EXISTS embedding vector(768)');
        }

        // 4. Tambahkan ke Organizations (Organisasi)
        if (Schema::hasTable('organizations')) {
            DB::statement('ALTER TABLE organizations ADD COLUMN IF NOT EXISTS embedding vector(768)');
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('class_schedules')) {
            DB::statement('ALTER TABLE class_schedules DROP COLUMN IF EXISTS embedding');
        }
        if (Schema::hasTable('assignments')) {
            DB::statement('ALTER TABLE assignments DROP COLUMN IF EXISTS embedding');
        }
        if (Schema::hasTable('organizations')) {
            DB::statement('ALTER TABLE organizations DROP COLUMN IF EXISTS embedding');
        }
    }
};