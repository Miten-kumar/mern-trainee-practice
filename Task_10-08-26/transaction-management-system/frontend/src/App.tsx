import { Routes, Route, } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/ProductPage";
import OrderPage from "./pages/OrderPage";
import PaymentPage from "./pages/PaymentPage";


function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <Routes>
        {/* Products */}
        <Route
          path="/"
          element={<ProductsPage />}
        />

        {/* Create Order */}
        <Route
          path="/order"
          element={<OrderPage />}
        />

        {/* Payment Details */}
        <Route
          path="/payment/:orderId"
          element={<PaymentPage />}
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <main className="flex min-h-[70vh] items-center justify-center px-6">
              <div className="text-center">
                <h1 className="text-5xl font-bold text-slate-900">
                  404
                </h1>

                <p className="mt-3 text-slate-500">
                  Page not found.
                </p>
              </div>
            </main>
          }
        />
      </Routes>
    </div>
  );
}

export default App;