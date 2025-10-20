<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\ClassSchedule;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AcademicController extends Controller
{
    public function index()
    {
        $classSchedules = ClassSchedule::where('user_id', Auth::id())->get();
        $assignments = Assignment::where('user_id', Auth::id())->get();
        $organizations = Organization::where('user_id', Auth::id())->get();

        return Inertia::render('schedule', [
            'classSchedules' => $classSchedules,
            'assignments' => $assignments,
            'organizations' => $organizations,
        ]);
    }

    public function storeClassSchedule(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'day' => 'required|string|max:20',
            'time' => 'required|string',
            'lecturer' => 'required|string|max:100',
            'room' => 'nullable|string|max:50',
            'credits' => 'nullable|integer|min:0|max:6',
        ]);

        // Parse time into start_time and end_time
        $times = explode('-', $request->time);
        $startTime = $times[0] ?? null;
        $endTime = $times[1] ?? null;

        ClassSchedule::create([
            'name' => $request->name,
            'day' => $request->day,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'lecturer' => $request->lecturer,
            'room' => $request->room,
            'credits' => $request->credits,
            'user_id' => Auth::id(),
        ]);

        return redirect()->back();
    }

    public function updateClassSchedule(Request $request, ClassSchedule $classSchedule)
    {
        if ($classSchedule->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:100',
            'day' => 'required|string|max:20',
            'time' => 'required|string',
            'lecturer' => 'required|string|max:100',
            'room' => 'nullable|string|max:50',
            'credits' => 'nullable|integer|min:1|max:6',
        ]);

        // Parse time into start_time and end_time
        $times = explode('-', $request->time);
        $startTime = $times[0] ?? null;
        $endTime = $times[1] ?? null;

        $classSchedule->update([
            'name' => $request->name,
            'day' => $request->day,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'lecturer' => $request->lecturer,
            'room' => $request->room,
            'credits' => $request->credits,
        ]);

        return redirect()->back();
    }

    public function destroyClassSchedule(ClassSchedule $classSchedule)
    {
        if ($classSchedule->user_id !== Auth::id()) {
            abort(403);
        }

        $classSchedule->delete();

        return redirect()->back();
    }

    public function storeAssignment(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:150',
            'deadline' => 'required|date',
        ]);

        Assignment::create([
            'name' => $request->name,
            'deadline' => $request->deadline,
            'status' => 'pending',
            'type' => 'akademik',
            'user_id' => Auth::id(),
        ]);

        return redirect()->back();
    }

    public function updateAssignment(Request $request, Assignment $assignment)
    {
        if ($assignment->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:150',
            'deadline' => 'required|date',
        ]);

        $assignment->update([
            'name' => $request->name,
            'deadline' => $request->deadline,
            'status' => 'pending',
            'type' => 'akademik',
        ]);

        return redirect()->back();
    }

    public function destroyAssignment(Assignment $assignment)
    {
        if ($assignment->user_id !== Auth::id()) {
            abort(403);
        }

        $assignment->delete();

        return redirect()->back();
    }

    public function toggleAssignmentStatus(Assignment $assignment)
    {
        if ($assignment->user_id !== Auth::id()) {
            abort(403);
        }

        $assignment->status = $assignment->status === 'pending' ? 'in-progress' : ($assignment->status === 'in-progress' ? 'completed' : 'pending');
        $assignment->save();

        return redirect()->back();
    }

    public function storeOrganization(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
        ]);

        Organization::create([
            'name' => $request->name,
            'role' => '',
            'description' => '',
            'user_id' => Auth::id(),
        ]);

        return redirect()->back();
    }

    public function updateOrganization(Request $request, Organization $organization)
    {
        if ($organization->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
        ]);

        $organization->update($request->only(['name', 'description']));

        return redirect()->back();
    }

    public function destroyOrganization(Organization $organization)
    {
        if ($organization->user_id !== Auth::id()) {
            abort(403);
        }

        $organization->delete();

        return redirect()->back();
    }
}
