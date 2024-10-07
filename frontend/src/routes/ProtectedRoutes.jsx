import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = () => {
  const { currentUser, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  if (!isAuthenticated) {
    // Save the current path in location.state and redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAuthenticated) {
    // Redirect non-admin users trying to access the admin route
    if (currentUser?.role !== "admin" && path === "admin") {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
    return <Outlet />;
  }

  // Redirect unauthenticated users to the login page
  <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
