import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, userData } = useAuth();

  if (!user) return <Navigate to="/auth" replace />;
  if (!userData?.isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
