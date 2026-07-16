import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminCandidates from "../features/admin-candidates/AdminCandidates";

import {
  LoginRoute,
  RegisterRoute,
  DashboardRoute,
  CandidateDashboardRoute,
  ProfileRoute,
  CandidateProfileRoute,
} from "./RouteViews";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/register" element={<RegisterRoute />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={<DashboardRoute />}
          />

          <Route
            path="/candidate/dashboard"
            element={<CandidateDashboardRoute />}
          />

          <Route
            path="/profile"
            element={<ProfileRoute />}
          />

          <Route
            path="/admin/candidates"
            element={<AdminCandidates />}
          />

          <Route
            path="/admin/candidates/:id"
            element={<CandidateProfileRoute />}
          />
        </Route>
      </Route>

      {/* Default redirects */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}