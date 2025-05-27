<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudentProfile;
use App\Models\User;
use App\Models\Internship;
use App\Models\Application;
use App\Models\InternshipRequirement;
use App\Notifications\NewRequirementsSubmitted;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentProfileController extends Controller
{
    public function dashboard()
    {
        $internships = Internship::with('employerProfile.user')
            ->select('id', 'title', 'requirements', 'description', 'employer_profile_id')
            ->get()
            ->map(function ($internship) {
                return [
                    'id' => $internship->id,
                    'title' => $internship->title,
                    'requirements' => $internship->requirements,
                    'description' => $internship->description,
                    'company_name' => optional($internship->employerProfile)->company_name,
                    'contact_name' => optional($internship->employerProfile)->contact_name,
                    'contact_number' => optional($internship->employerProfile)->contact_number,
                    'company_description' => optional($internship->employerProfile)->description,
                    'website' => optional($internship->employerProfile)->website,
                    'company_email' => optional($internship->employerProfile)->company_email,
                    'company_address' => optional($internship->employerProfile)->company_address,
                    'profile_picture' => optional($internship->employerProfile)->profile_picture,
                ];
            });
            $user = auth()->user();

        $user = auth()->user()->load('studentProfile');
        return Inertia::render('Dashboard', [
            'internships' => $internships,
            'isApproved' => $user->verification && $user->verification->status === 'approved',
            'studentProfile' => $user->studentProfile,
        ]);
    }

    public function notification()
    {
        $notifications = auth()->user()->notifications;
        $user = auth()->user()->load('studentProfile');

        return Inertia::render('Notification', [
            'notifications' => $notifications,
            'studentProfile' => $user->studentProfile,
        ]);
    }

    public function edit()
    {
        $student = Auth::user()->studentProfile;

        return Inertia::render('Profile', [
            'studentProfile' => $student
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'school_id' => 'required|string|max:255|unique:student_profiles,school_id',
            'year_level' => 'required|string|max:255',
            'skills' => 'nullable|string',
            'bio' => 'nullable|string|max:1000',
        ]);

        $user = auth()->user();

        if ($user->studentProfile) {
            return back()->with('error', 'You already submitted your profile.');
        }

        $path = null;

        if ($request->hasFile('profile_picture')) {
            $filename = time() . '_' . $request->file('profile_picture')->getClientOriginalName();
            $request->file('profile_picture')->move(public_path('profiles'), $filename);
            $path = $filename;
        }

        StudentProfile::create([
            'user_id' => $user->id,
            'profile_picture' => $path,
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'school_id' => $request->school_id,
            'year_level' => $request->year_level,
            'skills' => $request->skills,
            'bio' => $request->bio,
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Student profile submitted successfully!');
    }

    public function update(Request $request)
    {
        $request->validate([
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'school_id' => 'required|string|max:255',
            'year_level' => 'required|string|max:255',
            'skills' => 'nullable|string',
            'bio' => 'nullable|string|max:1000',
        ]);

        $user = auth()->user();
        $profile = $user->studentProfile;

        if (!$profile) {
            return back()->with('error', 'No profile found to update.');
        }

        if ($request->hasFile('profile_picture')) {
            if ($profile->profile_picture && file_exists(public_path('profiles/' . $profile->profile_picture))) {
                unlink(public_path('profiles/' . $profile->profile_picture));
            }

            $filename = time() . '_' . $request->file('profile_picture')->getClientOriginalName();
            $request->file('profile_picture')->move(public_path('profiles'), $filename);
            $profile->profile_picture = $filename;
        }

        $profile->first_name = $request->first_name;
        $profile->middle_name = $request->middle_name;
        $profile->last_name = $request->last_name;
        $profile->school_id = $request->school_id;
        $profile->year_level = $request->year_level;
        $profile->skills = $request->skills;
        $profile->bio = $request->bio;

        $profile->save();

        return redirect()->back()->with('success', 'Profile updated successfully!');
    }

    public function showRequirements()
    {
        $user = auth()->user();
        $requirements = $user->internshipRequirements;

        return Inertia::render('RequirementForm', [
            'requirements' => $requirements
        ]);
    }

    public function submitRequirements(Request $request)
    {
        $request->validate([
            'resume' => 'required|file|mimes:docx,pdf,jpg,jpeg,png|max:2048',
            'endorsement_letter' => 'required|file|mimes:docx,pdf,jpg,jpeg,png|max:2048',
            'good_moral' => 'required|file|mimes:docx,pdf,jpg,jpeg,png|max:2048',
            'tor' => 'required|file|mimes:docx,pdf,jpg,jpeg,png|max:2048',
            'moa' => 'required|file|mimes:docx,pdf,jpg,jpeg,png|max:2048',
            'clearance' => 'required|file|mimes:docx,pdf,jpg,jpeg,png|max:2048',
        ]);

        $user = Auth::user();

        $paths = [
            'resume' => $request->file('resume')->store('requirements', 'public'),
            'endorsement_letter' => $request->file('endorsement_letter')->store('requirements', 'public'),
            'good_moral' => $request->file('good_moral')->store('requirements', 'public'),
            'tor' => $request->file('tor')->store('requirements', 'public'),
            'moa' => $request->file('moa')->store('requirements', 'public'),
            'clearance' => $request->file('clearance')->store('requirements', 'public'),
        ];

        $requirements = InternshipRequirement::updateOrCreate(
            ['user_id' => $user->id],
            array_merge($paths, ['status' => 'pending'])
        );

        $employers = User::where('role', 'employer')->get();
        foreach ($employers as $employer) {
            $employer->notify(new NewRequirementsSubmitted($user));
        }

        return redirect()->back()->with('success', 'Internship requirements submitted. Please wait for approval.');
    }

    public function application()
    {
        $student = Auth::user();

        $applications = Application::with('internship')
            ->where('student_id', $student->id)
            ->latest()
            ->get();

        $user = auth()->user()->load('studentProfile');
        return Inertia::render('Applications', [
            'applications' => $applications,
            'studentProfile' => $user->studentProfile,
        ]);
    }
}
