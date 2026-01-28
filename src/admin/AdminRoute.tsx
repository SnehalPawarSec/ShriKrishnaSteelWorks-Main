import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  if (!user || !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
