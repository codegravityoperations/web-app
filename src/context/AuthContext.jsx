import { useState } from "react";
import { clearTokens, getUserRoleFromToken } from "../apiClient";
import { AuthContext } from "./auth-context";

/**
 * Lightweight in-memory auth context.
 *
 * Tokens are the real source of truth for "is the user logged in"
 * (see apiClient / ProtectedRoute). This context just carries the
 * richer login-response payload (email, businessId, role, ...) so
 * pages like Dashboard can render it without re-fetching, and it
 * survives client-side navigation between routes.
 */
export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(null);

  const login = (auth) => setAuthData(auth);

  const logout = () => {
    clearTokens();
    setAuthData(null);
  };

  const role = getUserRoleFromToken();

  return (
    <AuthContext.Provider value={{ authData, login, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
}
