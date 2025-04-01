import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthState } from "../../../redux/features/authSlice";
import { PageRoutes } from "../../../routes/appRoutes";

const PrivateRoute = () => {
  const { isUserLoggedIn } = useSelector(AuthState);

  return isUserLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to={PageRoutes.LOGIN} replace />
  );
};

export default PrivateRoute;
