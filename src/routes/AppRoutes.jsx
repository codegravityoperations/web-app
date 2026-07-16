import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminCandidates from "../features/admin-candidates/AdminCandidates";
import {
  LoginRoute,
  RegisterRoute,
  DashboardRoute,
  ProfileRoute,
  CandidateProfileRoute,
} from "./RouteViews";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/register" element={<RegisterRoute />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardRoute />} />
          <Route path="/profile" element={<ProfileRoute />} />
          <Route path="/admin/candidates" element={<AdminCandidates />} />
          <Route path="/admin/candidates/:id" element={<CandidateProfileRoute />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
