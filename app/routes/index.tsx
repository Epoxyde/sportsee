import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function Index() {
  const { session, ready } = useAuth();

  if (!ready) {
    return <p role="status" className="p-8">Chargement de la session…</p>;
  }

  return <Navigate to={session ? "/dashboard" : "/login"} replace />;
}
