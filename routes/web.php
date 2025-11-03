<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [App\Http\Controllers\AcademicController::class, 'index'])->name('dashboard');

    Route::get('schedule', [App\Http\Controllers\AcademicController::class, 'index'])->name('schedule');

    Route::get('chat', [App\Http\Controllers\ChatController::class, 'index'])->name('chat');
    Route::post('schedule/store-class', [App\Http\Controllers\AcademicController::class, 'storeClassSchedule']);
    Route::patch('schedule/update-class/{classSchedule}', [App\Http\Controllers\AcademicController::class, 'updateClassSchedule']);
    Route::delete('schedule/destroy-class/{classSchedule}', [App\Http\Controllers\AcademicController::class, 'destroyClassSchedule']);
    Route::post('schedule/store-assignment', [App\Http\Controllers\AcademicController::class, 'storeAssignment']);
    Route::patch('schedule/update-assignment/{assignment}', [App\Http\Controllers\AcademicController::class, 'updateAssignment']);
    Route::patch('schedule/toggle-assignment/{assignment}', [App\Http\Controllers\AcademicController::class, 'toggleAssignmentStatus']);
    Route::delete('schedule/destroy-assignment/{assignment}', [App\Http\Controllers\AcademicController::class, 'destroyAssignment']);
    Route::post('schedule/store-organization', [App\Http\Controllers\AcademicController::class, 'storeOrganization']);
    Route::patch('schedule/update-organization/{organization}', [App\Http\Controllers\AcademicController::class, 'updateOrganization']);
    Route::delete('schedule/destroy-organization/{organization}', [App\Http\Controllers\AcademicController::class, 'destroyOrganization']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
