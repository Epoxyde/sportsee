import { useMemo } from "react";
import { NavLink, Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export default function ProtectedLayout() {
  const { session, ready, logout } = useAuth();
  const location = useLocation();
  // Navigate utilise state dans les dépendances de son effet de navigation.
  const redirectState = useMemo(() => ({ from: location.pathname }), [location.pathname]);

  if (!ready) {
    return <p role="status" className="p-8">Chargement de la session…</p>;
  }

  if (!session) {
    return <Navigate to="/login" replace state={redirectState} />;
  }

  const linkClass = "sportsee-menu-link";

  return (
    <div className="sportsee-shell">
      <div className="sportsee-content">
        <SiteHeader>
          <nav aria-label="Navigation principale" className="sportsee-navigation">
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/profile" className={linkClass}>Mon profil</NavLink>
            <button type="button" onClick={logout} className="cursor-pointer border-l border-[#b6bdfc] pl-10 text-[#0b23f4] hover:underline underline-offset-4">
              Se déconnecter
            </button>
          </nav>
        </SiteHeader>
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  );
}
