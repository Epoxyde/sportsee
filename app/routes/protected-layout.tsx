import { NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedLayout() {
  const { session, ready, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!ready) {
    return <p role="status" className="p-8">Chargement de la session…</p>;
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
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
          <button type="button" onClick={handleLogout} className="cursor-pointer underline">
            Se déconnecter
          </button>
        </nav>
      </header>
      <p className="mx-auto max-w-3xl bg-amber-50 px-6 py-3 text-sm text-amber-950">
        Données de démonstration : les statistiques affichées sont celles du mock de Sophie,
        quel que soit le compte connecté.
      </p>
      <Outlet />
    </>
  );
}
