import React from "react";
import { Link, usePage } from "@inertiajs/react";
import EmployerLayout from "@/Layouts/EmployerLayout";

export default function Index() {
    const { profiles } = usePage().props;

    return (
        <EmployerLayout>
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Company Profiles</h1>
                    {profiles.length === 0 && (
                        <Link
                            href="/employers/create"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            + Add Profile
                        </Link>
                    )}
                </div>

                {profiles.length > 0 ? (
                    profiles.map((profile) => (
                        <div
                            key={profile.id}
                            className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6"
                        >
                            <div className="flex-shrink-0">
                                {profile.profile_picture ? (
                                    <img
                                        src={`/${profile.profile_picture}`}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-xl object-cover border"
                                    />
                                ) : (
                                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500 rounded-xl">
                                        No Image
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {profile.company_name}
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    {profile.contact_name} —{" "}
                                    {profile.contact_number}
                                </p>
                                <p className="text-gray-500 text-sm mt-1">
                                    {profile.company_email}
                                </p>
                                <p className="text-gray-500 text-sm mt-1 italic">
                                    {profile.company_address}
                                </p>
                                <p className="text-sm text-blue-500 mt-2">
                                    <a
                                        href={profile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline"
                                    >
                                        {profile.website}
                                    </a>
                                </p>
                                {profile.description && (
                                    <p className="text-sm text-gray-700 mt-4">
                                        {profile.description}
                                    </p>
                                )}
                                <div className="mt-4">
                                    <Link
                                        href={`/employers/${profile.id}/edit`}
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        ✏️ Edit Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 text-center">
                        No profiles found.
                    </div>
                )}
            </div>
        </EmployerLayout>
    );
}
