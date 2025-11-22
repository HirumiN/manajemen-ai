<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\ClassSchedule;
use App\Models\Organization;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AcademicController extends Controller
{
    /** ---------- MAIN PAGE (Dashboard / Schedule Page) ---------- **/
  public function index(Request $request)
{
    // Ambil semester dari query atau session
    $selectedSemester = $request->semester ?? session('selected_semester');

    // Simpan ke session kalau user baru memilih semester
    if ($request->has('semester')) {
        session(['selected_semester' => $request->semester]);
    }

    // Jika belum ada apa pun -> ambil semester pertama pengguna
    if (!$selectedSemester) {
        $selectedSemester = Semester::where('user_id', Auth::id())->first()?->id;
        session(['selected_semester' => $selectedSemester]);
    }

    $semesters = Semester::where('user_id', Auth::id())->get();

    return inertia('schedule', [
        'semesters' => $semesters,
        'currentSemester' => $semesters->where('id', $selectedSemester)->first(),
        'classSchedules' => ClassSchedule::where('semester_id', $selectedSemester)->get(),
        'organizations' => Organization::where('user_id', Auth::id())->get(),
    ]);
}

    /** ---------- CLASS SCHEDULE CRUD ---------- **/
    public function storeClassSchedule(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:100',
            'day'         => 'required|string|max:20',
            'time'        => 'required|string',
            'lecturer'    => 'required|string|max:100',
            'room'        => 'nullable|string|max:50',
            'credits'     => 'nullable|integer|min:0|max:6',
            'semester_id' => 'required|exists:semesters,id',
        ]);

        [$start, $end] = array_pad(explode('-', $validated['time']), 2, null);

        ClassSchedule::create([
            ...$validated,
            'start_time' => $start,
            'end_time'   => $end,
            'user_id'    => Auth::id(),
        ]);

        return back();
    }

    public function updateClassSchedule(Request $request, ClassSchedule $classSchedule)
    {
        abort_if($classSchedule->user_id !== Auth::id(), 403);

        $validated = $request->validate([
            'name'        => 'required|string|max:100',
            'day'         => 'required|string|max:20',
            'time'        => 'required|string',
            'lecturer'    => 'required|string|max:100',
            'room'        => 'nullable|string|max:50',
            'credits'     => 'nullable|integer|min:1|max:6',
            'semester_id' => 'required|exists:semesters,id',
        ]);

        [$start, $end] = array_pad(explode('-', $validated['time']), 2, null);

        $classSchedule->update([
            ...$validated,
            'start_time' => $start,
            'end_time'   => $end,
        ]);

        return back();
    }

    public function destroyClassSchedule(ClassSchedule $classSchedule)
    {
        abort_if($classSchedule->user_id !== Auth::id(), 403);

        $classSchedule->delete();

        return back();
    }




    /** ---------- ASSIGNMENT CRUD ---------- **/
    public function storeAssignment(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:150',
            'deadline'    => 'required|date',
            'description' => 'nullable|string',
        ]);

        Assignment::create([
            ...$validated,
            'status'   => 'pending',
            'type'     => 'akademik',
            'user_id'  => Auth::id(),
        ]);

        return back();
    }

    public function updateAssignment(Request $request, Assignment $assignment)
    {
        abort_if($assignment->user_id !== Auth::id(), 403);

        $validated = $request->validate([
            'name'        => 'nullable|string|max:150',
            'deadline'    => 'nullable|date',
            'status'      => 'nullable|string|in:pending,in-progress,completed',
            'description' => 'nullable|string',
        ]);

        $assignment->update(array_filter($validated));

        return back();
    }

    public function destroyAssignment(Assignment $assignment)
    {
        abort_if($assignment->user_id !== Auth::id(), 403);

        $assignment->delete();

        return back();
    }

    public function toggleAssignmentStatus(Assignment $assignment)
    {
        abort_if($assignment->user_id !== Auth::id(), 403);

        $assignment->status = match ($assignment->status) {
            'pending'      => 'in-progress',
            'in-progress'  => 'completed',
            default        => 'pending',
        };

        $assignment->save();

        return back();
    }




    /** ---------- ORGANIZATION CRUD ---------- **/
    public function storeOrganization(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:100',
            'position'    => 'nullable|string|max:100',
            'description' => 'nullable|string',
        ]);

        Organization::create([
            ...$validated,
            'user_id' => Auth::id(),
        ]);

        return back();
    }

    public function updateOrganization(Request $request, Organization $organization)
    {
        abort_if($organization->user_id !== Auth::id(), 403);

        $validated = $request->validate([
            'name'        => 'required|string|max:100',
            'position'    => 'nullable|string|max:100',
            'description' => 'nullable|string',
        ]);

        $organization->update($validated);

        return back();
    }

    public function destroyOrganization(Organization $organization)
    {
        abort_if($organization->user_id !== Auth::id(), 403);

        $organization->delete();

        return back();
    }




    /** ---------- SEMESTER CRUD ---------- **/
    public function storeSemester(Request $request)
    {
        $validated = $request->validate([
            'number' => 'required|integer|min:1|max:12|unique:semesters,number,NULL,id,user_id,' . Auth::id(),
        ]);

        Semester::create([
            ...$validated,
            'user_id' => Auth::id(),
        ]);

        return back();
    }

    public function updateSemester(Request $request, Semester $semester)
    {
        abort_if($semester->user_id !== Auth::id(), 403);

        $validated = $request->validate([
            'number' => 'required|integer|min:1|max:12|unique:semesters,number,' . $semester->id . ',id,user_id,' . Auth::id(),
        ]);

        $semester->update($validated);

        return back();
    }

    public function destroySemester(Semester $semester)
    {
        abort_if($semester->user_id !== Auth::id(), 403);

        if ($semester->classSchedules()->exists()) {
            return back()->withErrors(['error' => 'Semester tidak dapat dihapus karena masih memiliki jadwal.']);
        }

        $semester->delete();

        return back();
    }



    /** ---------- Other ---------- **/
    public function chat()
    {
        return Inertia::render('chat');
    }
}
