import { useNavigate } from "react-router-dom";
import { LoginScreen, RegistrationScreen } from "../features/auth";
import { Dashboard } from "../features/dashboard";
import EditCandidateProfile from "../features/candidate-registration/EditCandidateProfile";
import CandidateProfilePage from "../features/candidate-registration/CandidateProfilePage";
import { useAuth } from "../context/useAuth";

/**
 * Route-level wrappers.
 *
 * These adapt the existing (unmodified) screen components — built around
 * onLogin/onGoRegister/onBack callback props — onto react-router
 * navigation, so none of the screens themselves had to change.
 */

export function LoginRoute() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (auth) => {
    login(auth);
    navigate("/dashboard", { replace: true });
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
  return <RegistrationScreen onGoLogin={() => navigate("/login")} />;
}

export function DashboardRoute() {
  const navigate = useNavigate();
  const { authData, logout } = useAuth();

  return (
    <Dashboard
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
  return <EditCandidateProfile onBack={() => navigate("/dashboard")} />;
}

export function CandidateProfileRoute() {
  const navigate = useNavigate();
  const { role } = useAuth();

  // NOTE: candidateService only exposes getCandidates() (list) today —
  // no getCandidateById() yet. Until that's added, CandidateProfilePage
  // falls back to its own built-in mock candidate for this route.
  return (
    <CandidateProfilePage
      userRole={role}
      onBack={() => navigate("/admin/candidates")}
    />
  );
}
