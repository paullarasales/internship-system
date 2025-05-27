import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, Head } from "@inertiajs/react";

export default function Profile({ auth, studentProfile }) {
    const isEditingProfile = !!studentProfile?.id;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        first_name: studentProfile?.first_name || "",
        middle_name: studentProfile?.middle_name || "",
        last_name: studentProfile?.last_name || "",
        school_id: studentProfile?.school_id || "",
        year_level: studentProfile?.year_level || "4th",
        skills: studentProfile?.skills || "",
        bio: studentProfile?.bio || "",
        profile_picture: null,
    });

    const [editing, setEditing] = useState(!isEditingProfile);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formAction = isEditingProfile ? put : post;

        formAction(
            isEditingProfile
                ? route("student.profile.update")
                : route("student.profile.store"),
            {
                onSuccess: () => {
                    setEditing(false);
                },
            }
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Student Profile" />

            <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
                <div className="relative">
                    <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg mb-8">
                        {studentProfile?.profile_picture && (
                            <img
                                src={`/profiles/${studentProfile.profile_picture}`}
                                alt="Profile"
                                className="w-36 h-36 object-cover rounded-full border-4 border-white absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
                            />
                        )}
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        {editing
                            ? isEditingProfile
                                ? "Edit Profile"
                                : "Complete Your Profile"
                            : ""}
                    </h1>
                </div>

                {editing ? (
                    <form
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                        className="space-y-6 mt-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={data.first_name}
                                    onChange={(e) =>
                                        setData("first_name", e.target.value)
                                    }
                                    className="w-full border rounded-md p-3 mt-1"
                                />
                                {errors.first_name && (
                                    <p className="text-red-600 text-xs mt-1">
                                        {errors.first_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Middle Name
                                </label>
                                <input
                                    type="text"
                                    name="middle_name"
                                    value={data.middle_name}
                                    onChange={(e) =>
                                        setData("middle_name", e.target.value)
                                    }
                                    className="w-full border rounded-md p-3 mt-1"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={data.last_name}
                                    onChange={(e) =>
                                        setData("last_name", e.target.value)
                                    }
                                    className="w-full border rounded-md p-3 mt-1"
                                />
                                {errors.last_name && (
                                    <p className="text-red-600 text-xs mt-1">
                                        {errors.last_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    School ID
                                </label>
                                <input
                                    type="text"
                                    name="school_id"
                                    value={data.school_id}
                                    onChange={(e) =>
                                        setData("school_id", e.target.value)
                                    }
                                    className="w-full border rounded-md p-3 mt-1"
                                />
                                {errors.school_id && (
                                    <p className="text-red-600 text-xs mt-1">
                                        {errors.school_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Year Level
                                </label>
                                <input
                                    type="text"
                                    name="year_level"
                                    value={data.year_level}
                                    onChange={(e) =>
                                        setData("year_level", e.target.value)
                                    }
                                    className="w-full border rounded-md p-3 mt-1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Skills
                                </label>
                                <textarea
                                    name="skills"
                                    value={data.skills}
                                    onChange={(e) =>
                                        setData("skills", e.target.value)
                                    }
                                    className="w-full border rounded-md p-3 mt-1"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={data.bio}
                                    onChange={(e) =>
                                        setData("bio", e.target.value)
                                    }
                                    className="w-full border rounded-md p-3 mt-1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Profile Picture
                                </label>
                                <input
                                    type="file"
                                    name="profile_picture"
                                    onChange={(e) =>
                                        setData(
                                            "profile_picture",
                                            e.target.files[0]
                                        )
                                    }
                                    className="w-full border rounded-md p-3 mt-1"
                                />
                                {errors.profile_picture && (
                                    <p className="text-red-600 text-xs mt-1">
                                        {errors.profile_picture}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 text-white px-6 py-3 rounded-md"
                            >
                                Save Profile
                            </button>
                            {isEditingProfile && (
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6 mt-8">
                        <div className="flex items-center space-x-4">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    {studentProfile.first_name}{" "}
                                    {studentProfile.middle_name}{" "}
                                    {studentProfile.last_name}
                                </h2>
                                <p className="text-gray-600">
                                    {studentProfile.year_level} Year
                                </p>
                                <p className="text-gray-600">
                                    School ID: {studentProfile.school_id}
                                </p>
                            </div>
                        </div>

                        <div>
                            <strong>Skills:</strong>{" "}
                            {studentProfile.skills || "N/A"}
                        </div>
                        <div>
                            <strong>Bio:</strong> {studentProfile.bio || "N/A"}
                        </div>

                        <button
                            onClick={() => setEditing(true)}
                            className="mt-4 bg-yellow-500 text-white px-6 py-3 rounded-md"
                        >
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
