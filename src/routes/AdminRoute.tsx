import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth" replace />;
  if (!user?.isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
