import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthState } from "../../../redux/features/authSlice";
import { PageRoutes } from "../../../routes/appRoutes";

const AdminRoute = () => {
  const { isAdminLoggedIn } = useSelector(AuthState);

  return isAdminLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to={PageRoutes.ADMIN_LOGIN} replace />
  );
};

export default AdminRoute;
