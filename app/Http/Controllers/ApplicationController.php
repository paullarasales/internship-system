<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Internship;
use App\Models\Application;
use Illuminate\Http\Request;
use App\Notifications\NewApplicantNotification;

class ApplicationController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'internship_id' => 'required|exists:internships,id',
        ]);

        $user = auth()->user();
        if (!$user->verification || $user->verification->status !== 'approved') {
            return back()->withErrors(['message' => 'You must be verified to apply for internships.']);
        }

        $existing = Application::where('student_id', $user->id)
            ->where('internship_id', $request->internship_id)
            ->first();

        if ($existing) {
            return back()->withErrors(['message' => 'You have already applied for this internship.']);
        }

        $internship = Internship::find($request->internship_id);

        $application = Application::create([
            'student_id' => $user->id,
            'internship_id' => $request->internship_id,
            'employer_id' => $internship->employer_id,
        ]);

        $employer = User::find($internship->employer_id);

        if ($employer) {
            $studentName = $user->name;
            $internshipTitle = $internship->title;
            $employer->notify(new NewApplicantNotification($studentName, $internshipTitle));
        }

        return back()->with('success', 'Internship application submitted successfully!');
    }
}
