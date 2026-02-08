import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import CreateProduct from "./pages/CreateProduct";
import AccountSettings from "./pages/AccountSettings";

function AppRoutes() {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const isAuthenticated = token && user;
  const isAdmin = user?.role === "admin";

  return (
    <>
      {/* Show navbar only when logged in */}
      {isAuthenticated && <Navbar />}

      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          }
        /> 
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Register />
          }
        />

        {/* DASHBOARD (ROLE BASED) */}
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : isAdmin ? (
              <AdminDashboard />
            ) : (
              <Dashboard />
            )
          }
        />

        {/* PRODUCTS */}
        <Route
          path="/products/:id"
          element={
            isAuthenticated ? (
              <ProductDetails />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        /> 
        <Route
          path="/products"
          element={
            isAuthenticated ? (
              <Products />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* CREATE PRODUCT (ADMIN ONLY) */}
        <Route
          path="/create-product"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : isAdmin ? (
              <CreateProduct />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

         <Route
          path="/create-product/:id"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : isAdmin ? (
              <CreateProduct />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <AccountSettings />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
