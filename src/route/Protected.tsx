import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isLogin = localStorage.getItem("isLogin");

  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
