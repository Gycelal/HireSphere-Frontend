import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedRoutes = ({ allowedRole }) => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  // ✅ 1. ALWAYS check user first
  if (!user) {
    if (location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin-login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // ✅ 2. Safe to use user now
  const isRecruiterPending =
    user.role === "recruiter" && user.approval_status !== "approved";

  if (
    isRecruiterPending &&
    location.pathname !== "/recruiter/profile"
  ) {
    return <Navigate to="/recruiter/profile" replace />;
  }

  // ✅ 3. Role check
  if (allowedRole && user.role !== allowedRole) {
    if (!user.role) {
      return <Navigate to="/select-role" replace />;
    }

    if (user.role === "candidate") {
      return <Navigate to="/candidate/home" replace />;
    }

    if (user.role === "recruiter") {
      return <Navigate to="/recruiter/overview" replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  // ✅ 4. MUST return this
  return <Outlet />;
};

export default ProtectedRoutes;