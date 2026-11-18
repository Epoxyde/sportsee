import { useMemo } from "react";
import { NavLink, Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

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

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "font-semibold underline" : "hover:underline";

  return (
    <>
      <header className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 border-b border-gray-300 p-6">
        <span className="text-xl font-bold">SportSee</span>
        <nav aria-label="Navigation principale" className="flex flex-wrap items-center gap-6">
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/profile" className={linkClass}>Mon profil</NavLink>
          <button type="button" onClick={logout} className="cursor-pointer underline">
            Se déconnecter
          </button>
        </nav>
      </header>
      <Outlet />
    </>
  );
}
