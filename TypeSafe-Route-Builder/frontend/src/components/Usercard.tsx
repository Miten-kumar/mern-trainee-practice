import type { User } from "../types/user.types";

interface Props {
    user: User;
}

export default function UserCard({ user }: Props) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">
                    {user.name}
                </h3>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    ID #{user.id}
                </span>
            </div>

            <div className="space-y-2 text-slate-600">
                <p>
                    <span className="font-semibold text-slate-800">
                        Email:
                    </span>{" "}
                    {user.email}
                </p>

                <p>
                    <span className="font-semibold text-slate-800">
                        Created:
                    </span>{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
}