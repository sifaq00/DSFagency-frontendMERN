import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("token");

    console.log("ProtectedRoute, token:", token); // Debugging

    // Jika token tidak ada, redirect ke login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />; // Render children jika token ada
};

export default ProtectedRoute;
