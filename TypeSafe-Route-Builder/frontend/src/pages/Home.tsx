export default function Home() {

    
    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-100 px-6 py-10">
            <div className="mx-auto max-w-6xl">
                {/* Hero Section */}
                <div className="rounded-2xl bg-white p-10 shadow-lg">
                    <h1 className="mb-4 text-5xl font-bold text-slate-800">
                        Type Safe Route Builder
                    </h1>

                    <p className="max-w-3xl text-lg text-slate-600">
                        Build a fully type-safe routing system using
                        <span className="font-semibold text-blue-600">
                            {" "}
                            TypeScript Template Literal Types
                        </span>
                        . Generate routes with autocomplete, validate route
                        parameters, enforce query parameter types, and catch
                        invalid routes at compile time.
                    </p>

                    <button className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700">
                        Explore Route Builder
                    </button>
                </div>

                {/* Features */}
                <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl">
                        <h2 className="mb-3 text-xl font-semibold text-slate-800">
                             Route Autocomplete
                        </h2>

                        <p className="text-slate-600">
                            Get IntelliSense support while writing application
                            routes.
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl">
                        <h2 className="mb-3 text-xl font-semibold text-slate-800">
                             Type Safe Params
                        </h2>

                        <p className="text-slate-600">
                            Ensure every required route parameter is provided
                            with the correct type.
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl">
                        <h2 className="mb-3 text-xl font-semibold text-slate-800">
                             Query Validation
                        </h2>

                        <p className="text-slate-600">
                            Validate query parameters using TypeScript for safer
                            API requests.
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl">
                        <h2 className="mb-3 text-xl font-semibold text-slate-800">
                            ⚡ Compile-Time Validation
                        </h2>

                        <p className="text-slate-600">
                            Detect invalid routes before your application even
                            runs.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}