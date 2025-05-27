import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Dashboard({
    internships,
    isApproved,
    existingApplication,
    studentProfile, // <- added
}) {
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const { processing } = useForm();

    useEffect(() => {
        if (internships && Array.isArray(internships)) {
            setLoading(false);
        }
    }, [internships]);

    const handleApply = (internshipId) => {
        if (
            existingApplication &&
            existingApplication.internship_id === internshipId
        ) {
            setErrorMessage(
                "You’ve already submitted your application for this internship."
            );
            return;
        }

        router.post(
            "/student/application",
            { internship_id: internshipId },
            {
                preserveScroll: true,
                onSuccess: () => setErrorMessage(""),
                onError: () =>
                    setErrorMessage(
                        "You’ve already submitted your application for this internship."
                    ),
            }
        );
    };

    if (loading) {
        return (
            <AuthenticatedLayout>
                <Head title="Student Dashboard" />
                <div className="max-w-3xl mx-auto p-6 text-center">
                    <h1 className="text-2xl font-semibold mb-2">
                        Loading Internships...
                    </h1>
                    <p className="text-gray-500">Please wait a moment.</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Student Dashboard" />
            <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <aside className="bg-white border rounded-xl shadow-sm overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500 relative">
                        {studentProfile?.profile_picture && (
                            <img
                                src={`/profiles/${studentProfile.profile_picture}`}
                                alt="Profile"
                                className="w-24 h-24 object-cover rounded-full border-4 border-white absolute -bottom-12 left-6"
                            />
                        )}
                    </div>

                    <div className="pt-16 px-6 pb-6 space-y-4">
                        {studentProfile ? (
                            <>
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {studentProfile.first_name}{" "}
                                        {studentProfile.last_name}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {studentProfile.year_level} Year
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        School ID: {studentProfile.school_id}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-md font-semibold mb-2">
                                        Skills
                                    </h3>
                                    <p className="text-gray-700 text-sm">
                                        {studentProfile.skills ||
                                            "No skills listed."}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-md font-semibold mb-2">
                                        Bio
                                    </h3>
                                    <p className="text-gray-700 text-sm">
                                        {studentProfile.bio ||
                                            "No bio provided."}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500">No profile found.</p>
                        )}
                    </div>
                </aside>

                <section className="md:col-span-2 space-y-6">
                    {internships.length === 0 ? (
                        <p className="text-gray-600 text-center">
                            No internships available right now. Please check
                            back later.
                        </p>
                    ) : (
                        internships.map((internship) => (
                            <section
                                key={internship.id}
                                className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300 space-y-3"
                            >
                                <div className="flex items-center gap-4">
                                    {internship.profile_picture ? (
                                        <img
                                            src={`/${internship.profile_picture}`}
                                            alt="Profile"
                                            className="w-12 h-12 rounded-full object-cover border"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-lg font-bold">
                                            {internship.company_name?.[0] ||
                                                "?"}
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {internship.title}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            {internship.company_name ||
                                                "Unknown Company"}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-700">
                                    {internship.description?.slice(0, 160) ||
                                        "No description provided."}
                                    {internship.description?.length > 160 &&
                                        "..."}
                                </p>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() =>
                                            setSelectedInternship(internship)
                                        }
                                        className="text-sm text-indigo-600 font-medium hover:underline"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </section>
                        ))
                    )}
                </section>
            </main>

            {selectedInternship && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white max-w-4xl w-full rounded-lg shadow-xl overflow-y-auto max-h-[90vh] p-6 relative">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
                            onClick={() => setSelectedInternship(null)}
                        >
                            &times;
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-indigo-700">
                                    {selectedInternship.title}
                                </h2>
                                <h3 className="font-semibold mb-2 text-lg">
                                    Description
                                </h3>
                                <p className="text-gray-700">
                                    {selectedInternship.description ||
                                        "No description available."}
                                </p>

                                {selectedInternship.requirements && (
                                    <div className="mt-4">
                                        <h3 className="font-semibold text-lg">
                                            Requirements
                                        </h3>
                                        <ul className="list-disc list-inside text-gray-700">
                                            {selectedInternship.requirements
                                                .split(",")
                                                .map((item, i) => (
                                                    <li key={i}>
                                                        {item.trim()}
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-4">
                                    Company Details
                                </h3>
                                <p className="text-gray-700">
                                    <strong>Company:</strong>{" "}
                                    {selectedInternship.company_name || "N/A"}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Address:</strong>{" "}
                                    {selectedInternship.company_address ||
                                        "N/A"}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Contact Person:</strong>{" "}
                                    {selectedInternship.contact_name || "N/A"}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Phone:</strong>{" "}
                                    {selectedInternship.contact_number || "N/A"}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Email:</strong>{" "}
                                    {selectedInternship.company_email || "N/A"}
                                </p>
                                <p className="text-gray-700 mt-2">
                                    <strong>Website:</strong>{" "}
                                    <a
                                        href={selectedInternship.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:underline"
                                    >
                                        {selectedInternship.website || "N/A"}
                                    </a>
                                </p>

                                <div className="mt-4">
                                    <h4 className="font-semibold">
                                        About the Company
                                    </h4>
                                    <p className="text-gray-700">
                                        {selectedInternship.company_description ||
                                            "No description available."}
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        handleApply(selectedInternship.id)
                                    }
                                    disabled={
                                        processing ||
                                        (typeof isApproved !== "undefined" &&
                                            !isApproved)
                                    }
                                    className={`mt-6 px-4 py-2 rounded-lg text-white w-full bg-green-600 hover:bg-green-700`}
                                >
                                    {processing
                                        ? "Applying..."
                                        : existingApplication?.internship_id ===
                                          selectedInternship.id
                                        ? "You Already Applied"
                                        : "Apply for Internship"}
                                </button>
                                {errorMessage && (
                                    <div className="mt-4 text-red-500 font-semibold">
                                        {errorMessage}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
