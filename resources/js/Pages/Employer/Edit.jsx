import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import EmployerLayout from "@/Layouts/EmployerLayout";

export default function Edit() {
    const { profile } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        company_name: profile.company_name || "",
        contact_name: profile.contact_name || "",
        contact_number: profile.contact_number || "",
        company_address: profile.company_address || "",
        company_email: profile.company_email || "",
        description: profile.description || "",
        website: profile.website || "",
        profile_picture: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== "") {
                formData.append(key, value);
            }
        });

        formData.append("_method", "PUT");

        Inertia.post(`/employers/${profile.id}`, formData, {
            forceFormData: true,
        });
    };

    return (
        <EmployerLayout>
            {" "}
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow">
                <h1 className="text-2xl font-bold mb-4">
                    Edit Employer Profile
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    encType="multipart/form-data"
                >
                    <div>
                        <label className="block">Company Name</label>
                        <input
                            type="text"
                            value={data.company_name}
                            onChange={(e) =>
                                setData("company_name", e.target.value)
                            }
                            className="w-full p-2 border rounded"
                        />
                        {errors.company_name && (
                            <div className="text-red-500">
                                {errors.company_name}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block">Contact Name</label>
                        <input
                            type="text"
                            value={data.contact_name}
                            onChange={(e) =>
                                setData("contact_name", e.target.value)
                            }
                            className="w-full p-2 border rounded"
                        />
                        {errors.contact_name && (
                            <div className="text-red-500">
                                {errors.contact_name}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block">Contact Number</label>
                        <input
                            type="text"
                            value={data.contact_number}
                            onChange={(e) =>
                                setData("contact_number", e.target.value)
                            }
                            className="w-full p-2 border rounded"
                        />
                        {errors.contact_number && (
                            <div className="text-red-500">
                                {errors.contact_number}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block">Company Email</label>
                        <input
                            type="text"
                            value={data.company_email}
                            onChange={(e) =>
                                setData("company_email", e.target.value)
                            }
                            className="w-full p-2 border rounded"
                        />
                        {errors.contact_number && (
                            <div className="text-red-500">
                                {errors.contact_number}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block">Company Address</label>
                        <input
                            type="text"
                            value={data.company_address}
                            onChange={(e) =>
                                setData("company_address", e.target.value)
                            }
                            className="w-full p-2 border rounded"
                        />
                        {errors.company_address && (
                            <div className="text-red-500">
                                {errors.company_address}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block">Website</label>
                        <input
                            type="url"
                            value={data.website}
                            onChange={(e) => setData("website", e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        {errors.website && (
                            <div className="text-red-500">{errors.website}</div>
                        )}
                    </div>

                    <div>
                        <label className="block">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="w-full p-2 border rounded"
                        />
                        {errors.description && (
                            <div className="text-red-500">
                                {errors.description}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block">Current Picture</label>
                        {profile.profile_picture ? (
                            <img
                                src={`/${profile.profile_picture}`}
                                alt="Current"
                                className="w-16 h-16 object-cover rounded mb-2"
                            />
                        ) : (
                            <div className="text-gray-500 mb-2">
                                No image uploaded.
                            </div>
                        )}
                        <input
                            type="file"
                            onChange={(e) =>
                                setData("profile_picture", e.target.files[0])
                            }
                            className="w-full"
                        />
                        {errors.profile_picture && (
                            <div className="text-red-500">
                                {errors.profile_picture}
                            </div>
                        )}

                        {data.profile_picture &&
                            typeof data.profile_picture === "object" && (
                                <img
                                    src={URL.createObjectURL(
                                        data.profile_picture
                                    )}
                                    alt="Preview"
                                    className="w-16 h-16 object-cover rounded mt-2"
                                />
                            )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        {processing ? "Updating..." : "Update Profile"}
                    </button>
                </form>
            </div>
        </EmployerLayout>
    );
}
