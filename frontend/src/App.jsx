import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Landing from "./pages/LandingPage";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import BookPage from "./pages/BookPage";
import TransactionDetails from "./components/TransactionDetails";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ToastContainer from "./components/ToastContainer";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
};

const RoutesWrapper = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const protectPublicNavigation = () => {
      const token = localStorage.getItem("token");
      const publicPaths = ["/", "/login", "/signup"];
      const path = window.location.pathname;
      if (token && publicPaths.includes(path)) {
        window.history.pushState(null, "", "/dashboard");
        navigate("/dashboard", { replace: true });
      }
    };
    const onPop = () => protectPublicNavigation();
    window.addEventListener("popstate", onPop);
    protectPublicNavigation();
    return () => window.removeEventListener("popstate", onPop);
  }, [navigate]);
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/book/:id" element={<PrivateRoute><BookPage /></PrivateRoute>} />
      <Route path="/transaction/:id" element={<PrivateRoute><TransactionDetails /></PrivateRoute>} />
      <Route path="/change-password" element={<PrivateRoute><ChangePasswordPage /></PrivateRoute>} />
    </Routes>
  );
};

export default function App() {
  return (
    <Router>
      <ToastContainer />
      <RoutesWrapper />
    </Router>
  );
}