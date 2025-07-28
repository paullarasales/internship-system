<?php

namespace App\Http\Controllers;

use App\Notifications\ApplicationStatusNotification;
use App\Models\InternshipRequirement;
use App\Models\CompanyApplication;
use App\Models\Internship;
use App\Models\User;
use App\Models\EmployerProfile;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\StudentProfile;
use Inertia\Inertia;

class EmployerController extends Controller
{
    public function dashboard()
    {
        $currentApplications = Application::count();
        $previousApplications = Application::whereMonth('created_at', now()->subMonth()->month)->count();

        $currentInternships = Internship::count();
        $previousInternships = Internship::whereMonth('created_at', now()->subMonth()->month)->count();

        $currentInterns = Application::where('status', 'accepted')->count();
        $previousInterns = Application::where('status', 'accepted')->whereMonth('created_at', now()->subMonth()->month)->count();

        $notifications = auth()->user()->notifications()->latest()->take(5)->get();
        $companyProfile = auth()->user()->employerProfile;

        return Inertia::render('Employer/Dashboard', [
            'applicationStats' => [
                'count' => $currentApplications,
                'change' => $this->calculateChange($currentApplications, $previousApplications),
            ],
            'internshipStats' => [
                'count' => $currentInternships,
                'change' => $this->calculateChange($currentInternships, $previousInternships),
            ],
            'internStats' => [
                'count' => $currentInterns,
                'change' => $this->calculateChange($currentInterns, $previousInterns),
            ],
            'notifications' => $notifications,
            'companyProfile' => $companyProfile,
        ]);
    }

    private function calculateChange($current, $previous)
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }

        return round((($current - $previous) / $previous) * 100);
    }


    public function employerProfile()
    {
        $profiles = EmployerProfile::where('user_id', Auth::id())->get();

        return Inertia::render('Employer/Index', [
            'profiles' => $profiles,
        ]);
    }

    public function create()
    {
        $hasProfile = EmployerProfile::where('user_id', Auth::id())->exists();
        return Inertia::render('Employer/Create', [
            'hasProfile' => $hasProfile
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'contact_number' => 'required|string|max:255',
            'company_address' => 'required|string|max:255',
            'company_email' => 'required|email',
            'description' => 'nullable|string|max:50',
            'website' => 'required|url',
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('profile_picture')) {
            $validated['profile_picture'] = $request->file('profile_picture')->store('profile_picture', 'public');
        }

        $validated['user_id'] = Auth::id();
        $profile = EmployerProfile::create($validated);

        return redirect()->route('employers.index')->with('success', 'Profile created successfully.');
    }

    public function edit(EmployerProfile $employerProfile)
    {
        return Inertia::render('Employer/Edit', [
            'profile' => $employerProfile
        ]);
    }
    public function update(Request $request, EmployerProfile $employerProfile)
    {
        $validated = $request->validate([
            'company_name' => 'nullable|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:255',
            'company_address' => 'nullable|string|max:255',
            'company_email' => 'nullable|email',
            'description' => 'nullable|string|max:50',
            'website' => 'nullable|url',
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('profile_picture'), $filename);
            $validated['profile_picture'] = 'profile_picture/' . $filename;
        }

        $employerProfile->fill($validated)->save();

        return redirect()->route('employers.index')->with('success', 'Profile updated successfully.');
    }



    public function destroy(EmployerProfile $employerProfile)
    {
        $employerProfile->delete();

        return redirect()->route('employers.index')->with('success', 'Profile deleted successfully.');
    }

    public function applicants()
    {
        $applications = Application::with(['studentProfile', 'internship'])->get();

        return Inertia::render('Employer/Applicants', [
            'applications' => $applications
        ]);
    }

    public function viewProfile($studentId)
    {
        $profile = StudentProfile::where('user_id', $studentId)->firstOrFail();

        return Inertia::render('Employer/ViewProfile', [
            'profile' => $profile
        ]);
    }

    public function updateStatus(Request $request, $applicationId)
    {
        $request->validate([
            'status' => 'required|in:accepted,rejected',
        ]);

        $application = Application::findOrFail($applicationId);
        $application->status = $request->status;
        $application->save();

        if ($application->studentProfile) {
            $studentProfile = $application->studentProfile;
            $studentProfile->status = $request->status;
            $studentProfile->save();

            if ($studentProfile->user) {
                $student = $studentProfile->user;
                $student->notify(new ApplicationStatusNotification(
                    $request->status,
                    optional($application->internship)->title ?? 'the internship'
                ));
            }
        }

        return redirect()->back()->with('success', 'Status updated and student notified.');
    }



    public function notification()
    {
        return Inertia::render('Employer/Notification', [
            'notifications' => auth()->user()->notifications,
        ]);
    }

    public function showRequirements()
    {
        $requirements = InternshipRequirement::with('user')->get();

        return inertia('Employer/Requirements', [
            'requirements' => $requirements,
        ]);
    }

    public function viewRequirementDetails($id)
    {
        $requirement = InternshipRequirement::with('user')->findOrFail($id);

        return inertia('Employer/RequirementDetails', [
            'requirement' => $requirement,
        ]);
    }

    public function approveRequirement($id)
    {
        $requirement = InternshipRequirement::findOrFail($id);
        $requirement->status = 'approved';
        $requirement->save();

        return redirect()->back()->with('message', 'Requirement approved successfully.');
    }

    public function rejectRequirement($id)
    {
        $requirement = InternshipRequirement::findOrFail($id);
        $requirement->status = 'rejected';
        $requirement->save();

        return redirect()->back()->with('message', 'Requirement rejected successfully.');
    }

    public function getInterns()
    {
        $internships = Internship::with([
            'students.studentProfile',
            'applications' => function ($query) {
                $query->where('status', 'accepted')->with('studentProfile');
            }
        ])->get();

        return Inertia::render('Employer/Interns', [
            'internships' => $internships,
        ]);
    }

    public function checkStatus()
    {
        // getting the current user
        $user = auth()->user();

        $application = CompanyApplication::where('user_id', $user->id)->first();

        if (!$application) {
            return response()->json(['status' => 'not_found']);
        }

        return response()->json(['status' => $application->status]);
    }
}
