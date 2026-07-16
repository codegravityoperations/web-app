import { Navigate, useNavigate } from "react-router-dom";
import { LoginScreen, RegistrationScreen } from "../features/auth";
import { Dashboard } from "../features/dashboard";
import CandidateLandingPage from "../features/candidate-dashboard";
import EditCandidateProfile from "../features/candidate-registration/EditCandidateProfile";
import CandidateProfilePage from "../features/candidate-registration/CandidateProfilePage";
import { useAuth } from "../context/useAuth";

/**
 * Route-level wrappers connect the existing screen components
 * to React Router navigation.
 */

export function LoginRoute() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (auth) => {
    login(auth);

    const userType = auth?.userType?.toUpperCase();
    const role = auth?.role?.toUpperCase();

    const isCandidate =
      userType === "CANDIDATE" ||
      role === "ROLE_CANDIDATE";

    navigate(
      isCandidate
        ? "/candidate/dashboard"
        : "/dashboard",
      { replace: true }
    );
  };

  return (
    <LoginScreen
      onLogin={handleLogin}
      onGoRegister={() => navigate("/register")}
    />
  );
}

export function RegisterRoute() {
  const navigate = useNavigate();

  return (
    <RegistrationScreen
      onGoLogin={() => navigate("/login")}
    />
  );
}

export function DashboardRoute() {
  const navigate = useNavigate();
  const { authData, logout } = useAuth();

  const userType = authData?.userType?.toUpperCase();
  const role = authData?.role?.toUpperCase();

  const isCandidate =
    userType === "CANDIDATE" ||
    role === "ROLE_CANDIDATE";

  if (isCandidate) {
    return (
      <Navigate
        to="/candidate/dashboard"
        replace
      />
    );
  }

  return (
    <Dashboard
      auth={authData || {}}
      onLogout={() => {
        logout();
        navigate("/login", { replace: true });
      }}
    />
  );
}

export function CandidateDashboardRoute() {
  const navigate = useNavigate();
  const { authData, logout } = useAuth();

  const userType = authData?.userType?.toUpperCase();
  const role = authData?.role?.toUpperCase();

  const isCandidate =
    userType === "CANDIDATE" ||
    role === "ROLE_CANDIDATE";

  if (!isCandidate) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return (
    <CandidateLandingPage
      auth={authData || {}}
      onLogout={() => {
        logout();
        navigate("/login", { replace: true });
      }}
      onEditProfile={() => navigate("/profile")}
    />
  );
}

export function ProfileRoute() {
  const navigate = useNavigate();
  const { authData } = useAuth();

  const userType = authData?.userType?.toUpperCase();
  const role = authData?.role?.toUpperCase();

  const isCandidate =
    userType === "CANDIDATE" ||
    role === "ROLE_CANDIDATE";

  return (
    <EditCandidateProfile
      onBack={() =>
        navigate(
          isCandidate
            ? "/candidate/dashboard"
            : "/dashboard"
        )
      }
    />
  );
}

export function CandidateProfileRoute() {
  const navigate = useNavigate();
  const { role } = useAuth();

  return (
    <CandidateProfilePage
      userRole={role}
      onBack={() => navigate("/admin/candidates")}
    />
  );
}