import { useAuthStore } from "@/zustand-stores/auth.store";
import { Navigate, Outlet } from "react-router-dom";

function RequireAuth() {
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);
  if (isLoggedIn) {
    return <Outlet />;
  }
  return <Navigate to="/login" />;
}

export default RequireAuth;
