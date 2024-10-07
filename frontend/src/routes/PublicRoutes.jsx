import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  const publicRoutes = ["/login", "/signup"];

  // If authenticated and trying to access /login or /signup,
  // redirect to previous location or home
  if (isAuthenticated && publicRoutes.includes(location.pathname)) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  // Render Outlet
  return <Outlet />;
};

export default PublicRoutes;
