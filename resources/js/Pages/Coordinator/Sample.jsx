import CoordinatorLayout from "@/Layouts/Coordinator";
import { Link, usePage } from "@inertiajs/react";

export default function Sample() {
    const { instructors } = usePage().props;

    return (
        <CoordinatorLayout title="Instructors">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Instructors</h1>
                <Link
                    href={route("coordinator.instructors.create")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Instructor
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">Name</th>
                            <th className="px-4 py-2 border">Email</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {instructors.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="text-center py-4">
                                    No instructors found.
                                </td>
                            </tr>
                        ) : (
                            instructors.map((instructor) => (
                                <tr key={instructor.id}>
                                    <td className="px-4 py-2 border">
                                        {instructor.name}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {instructor.email}
                                    </td>
                                    <td className="px-4 py-2 border space-x-2">
                                        <Link
                                            href={route(
                                                "coordinator.instructors.show",
                                                instructor.id
                                            )}
                                            className="text-blue-600 hover:underline"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            href={route(
                                                "coordinator.instructors.edit",
                                                instructor.id
                                            )}
                                            className="text-yellow-600 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <Link
                                            as="button"
                                            method="delete"
                                            href={route(
                                                "coordinator.instructors.destroy",
                                                instructor.id
                                            )}
                                            className="text-red-600 hover:underline"
                                            onClick={(e) => {
                                                if (!confirm("Are you sure?"))
                                                    e.preventDefault();
                                            }}
                                        >
                                            Delete
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </CoordinatorLayout>
    );
}
