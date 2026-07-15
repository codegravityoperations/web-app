import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ACCENT_GRADIENT = "linear-gradient(135deg, #635bff 0%, #7c4dff 100%)";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", roles: null },
  { to: "/profile", label: "My Profile", roles: ["ROLE_CANDIDATE"] },
  { to: "/admin/candidates", label: "Candidates", roles: ["ROLE_ADMIN", "ROLE_EMPLOYEE"] },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const { logout, role, authData } = useAuth();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-[#f7f8fc]">
      <aside
        className="w-[220px] shrink-0 flex flex-col bg-white border-r border-[#eef0f5] font-[Inter,system-ui,sans-serif]"
        style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
      >
        <div className="px-5 py-6 border-b border-[#eef0f5]">
          <span className="text-lg font-bold text-[#111827] tracking-tight">
            Portal
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white shadow-sm"
                    : "text-[#6b7280] hover:bg-[#f3f2ff] hover:text-[#635bff]"
                }`
              }
              style={({ isActive }) =>
                isActive ? { background: ACCENT_GRADIENT } : undefined
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-[#eef0f5]">
          {authData?.email && (
            <p className="px-3 mb-2 text-xs text-[#9ca3af] truncate">
              {authData.email}
            </p>
          )}
          <button
            onClick={handleLogout}
            className="w-full rounded-lg px-3 py-2.5 text-sm font-semibold text-[#635bff] bg-[#f3f2ff] hover:opacity-90 transition-opacity"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
