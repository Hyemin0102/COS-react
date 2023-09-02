import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import AllProducts from "./pages/AllProducts";
import NewProduct from "./pages/NewProduct";
import ProductDetail from "./pages/ProductDetail";
import MyCart from "./pages/MyCart";
import ProtectedRoute from "./components/ProtectedRoute";

const LazyApp = lazy(()=>import("./App"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading 중입니다</div>}>
        <LazyApp />
      </Suspense>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true, path: "/", element: <Home /> },
      { path: "/products", element: <AllProducts /> },
      {
        path: "/products/new",
        element: (
          <ProtectedRoute requireAdmin>
            {" "}
            {/* admin계정인지 조건 하나 더 붙어서 이게 true 인 경우 */}
            <NewProduct />
          </ProtectedRoute>
        ),
      },
      { path: "/products/:id", element: <ProductDetail /> },
      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <MyCart />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
