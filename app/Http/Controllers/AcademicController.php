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
        $user = Auth::user();

        $classSchedules = ClassSchedule::where('user_id', $user->id)->get();
        $assignments = Assignment::where('user_id', $user->id)->get();
        $organizations = Organization::where('user_id', $user->id)->get();

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
            'time' => 'required|string|max:10',
            'lecturer' => 'required|string|max:100',
        ]);

        ClassSchedule::create([
            'name' => $request->name,
            'day' => $request->day,
            'time' => $request->time,
            'lecturer' => $request->lecturer,
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
            'time' => 'required|string|max:10',
            'lecturer' => 'required|string|max:100',
        ]);

        $classSchedule->update($request->only(['name', 'day', 'time', 'lecturer']));

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
            'status' => 'required|string|max:20',
        ]);

        Assignment::create([
            'name' => $request->name,
            'deadline' => $request->deadline,
            'status' => $request->status,
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
            'status' => 'required|string|max:20',
        ]);

        $assignment->update($request->only(['name', 'deadline', 'status']));

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
            'description' => 'nullable|string',
        ]);

        Organization::create([
            'name' => $request->name,
            'description' => $request->description,
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
