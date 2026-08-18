import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-slate-900 shadow-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <h1 className="text-2xl font-bold text-white">
                    Type Safe Router
                </h1>

                <div className="flex items-center gap-6">
                    <Link
                        to="/"
                        className="text-gray-300 transition-colors duration-200 hover:text-blue-400"
                    >
                        Home
                    </Link>

                    <Link
                        to="/users"
                        className="text-gray-300 transition-colors duration-200 hover:text-blue-400"
                    >
                        Users
                    </Link>

                    <Link
                        to="/products"
                        className="text-gray-300 transition-colors duration-200 hover:text-blue-400"
                    >
                        Products
                    </Link>

                    <Link
                        to="/route-builder"
                        className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
                    >
                        Route Builder
                    </Link>
                </div>
            </div>
        </nav>
    );
}