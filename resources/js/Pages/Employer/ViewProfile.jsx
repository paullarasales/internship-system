import React from "react";
import { usePage } from "@inertiajs/react";
import EmployerLayout from "@/Layouts/EmployerLayout";

export default function ViewProfile() {
    const { profile } = usePage().props;

    return (
        <EmployerLayout>
            <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded">
                <h1 className="text-2xl font-bold mb-4">Student Profile</h1>

                {profile.profile_picture && (
                    <div className="mb-4">
                        <img
                            src={`/profiles/${profile.profile_picture}`}
                            alt="Profile"
                            className="w-32 h-32 object-cover rounded-full mt-2"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <p>
                        <strong>Name:</strong> {profile.first_name}{" "}
                        {profile.middle_name} {profile.last_name}
                    </p>
                    <p>
                        <strong>School ID:</strong> {profile.school_id}
                    </p>
                    <p>
                        <strong>Year Level:</strong> {profile.year_level}
                    </p>
                    <p>
                        <strong>Skills:</strong> {profile.skills}
                    </p>
                    <p>
                        <strong>Bio:</strong> {profile.bio}
                    </p>
                </div>
            </div>
        </EmployerLayout>
    );
}
