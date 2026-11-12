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
      <Outlet />
    </>
  );
}
