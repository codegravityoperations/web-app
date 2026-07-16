import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAccessToken } from "../apiClient";

export default function ProtectedRoute() {
  const location = useLocation();
  const accessToken = getAccessToken();

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
