<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CompanyApplication;
use Inertia\Inertia;

class ApplyController extends Controller
{
    public function create()
    {
        $verification = auth()->user()->companyApplication;
        // dd($verification);
        return Inertia::render('Employer/Verify', [
            'verification' => $verification,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'business_permit_path' => 'required|file|mimes:pdf|max:2048',
        ]);

        $user = Auth::user();

        if ($user->companyApplication && $user->companyApplication === 'pending') {
            return back()->withErrors(['business_permit_path' => 'Verification already submitted.']);
        }

        if ($request->hasFile('business_permit_path')) {
            $file = $request->file('business_permit_path');
            $filename = time() . '_' . $file->getClientOriginalName();
            $destination = public_path('uploads/business_permits');

            if (!file_exists($destination)) {
                mkdir($destination, 0775, true);
            }

            $file->move($destination, $filename);

            $companyApp = new CompanyApplication();
            $companyApp->user_id = $user->id;
            $companyApp->business_permit_path = 'uploads/business_permits' . $filename;
            $companyApp->status = 'pending';
            $companyApp->save();

            return back()->with('success', 'Business permit submitted successfully!');
        }

        return back()->withErrors(['business_permit_path' => 'File upload failed']);
    }

    public function getApplications()
    {
        $applications = CompanyApplication::all();
    }
}
