<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Group;
use App\Models\User;
use Inertia\Inertia;

class GroupController extends Controller
{
    public function create()
    {
        // Only coordinators should access this, add middleware as needed
        $instructors = User::where('role', 'instructor')->get(['id', 'name']);
        return Inertia::render('Coordinator/GroupCreate', [
            'instructors' => $instructors,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'section' => 'required|string|max:255',
            'instructor_id' => 'required|exists:users,id',
        ]);

        $group = Group::create($request->only(['name', 'section', 'instructor_id']));

        return redirect()->route('coordinator.groups')->with('success', 'Group created successfully.');
    }

    public function assignStudents(Request $request, Group $group)
    {
        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:users,id',
        ]);

        $group->students()->sync($request->student_ids);

        // Auto-approve verification for each student added to the group
        foreach ($request->student_ids as $studentId) {
            $user = \App\Models\User::find($studentId);
            if ($user) {
                $verification = $user->verification;
                if ($verification) {
                    $verification->status = 'approved';
                    $verification->save();
                } else {
                    \App\Models\Verification::create([
                        'user_id' => $user->id,
                        'status' => 'approved',
                    ]);
                }
            }
        }

        return redirect()->route('groups.show', $group)->with('success', 'Students assigned successfully and verification auto-approved.');
    }

    public function index()
    {
        $groups = Group::with('students.studentProfile')
            ->where('instructor_id', auth()->id())
            ->get();

        return Inertia::render('Instructor/Groups', [
            'groups' => $groups,
        ]);
    }

      public function showGroup(Group $group)
    {
        $group->load(['instructor', 'students.studentProfile']);

        $documents = $group->documents()->get()->map(function ($doc) {
            return [
                'id' => $doc->id,
                'name' => $doc->original_name,
                'url' => asset('storage/' . $doc->file_path),
            ];
        });

        $users = User::select('id', 'name', 'role')->get();
        return Inertia::render('Instructor/GroupShow', [
            'group' => $group,
            'users' => $users,
            'documents' => $documents,
        ]);
    }
}
