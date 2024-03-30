import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

function PrivateRoutes() {
  const { user } = useAuth();

  return <>{user ? <Outlet /> : <Navigate to={"/login"} />}</>;
}

export default PrivateRoutes;
