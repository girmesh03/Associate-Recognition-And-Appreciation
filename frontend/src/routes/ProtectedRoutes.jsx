import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = ({ children }) => {
  const { currentUser, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  if (isAuthenticated) {
    // Redirect non-admin users trying to access the admin route
    if (currentUser.role !== "admin" && path === "admin") {
      return <Navigate to="/home" replace />;
    }
    return children;
  }

  // Redirect unauthenticated users to the login page
  return <Navigate to="/login" replace />;
};

ProtectedRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoutes;
