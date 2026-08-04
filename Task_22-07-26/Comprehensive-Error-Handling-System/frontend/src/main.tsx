import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../src/style/global.css";

import GlobalErrorBoundary from "./components/ErrorBoundary/GlobalErrorBoundary";

ReactDOM.createRoot(

    document.getElementById("root")!

)
.render(

    <React.StrictMode>

        <GlobalErrorBoundary>

            <App />

        </GlobalErrorBoundary>

    </React.StrictMode>

);