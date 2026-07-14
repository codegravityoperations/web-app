import { BrowserRouter } from "react-router-dom";
import { ANIMATIONS, FONTS } from "./constants";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

// ─── APP ROOT ───────────────────────────────────────────────────────────────
// Routing lives in src/routes/ (AppRoutes.jsx defines the tree, RouteViews.jsx
// adapts existing screens to it, ProtectedRoute.jsx guards auth). This file
// is just the composition root: global fonts/animations + providers.
export default function App() {
  return (
    <>
      <style>{ANIMATIONS}</style>
      <link href={FONTS} rel="stylesheet" />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
