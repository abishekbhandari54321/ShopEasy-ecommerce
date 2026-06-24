import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

const PrivateRouter = () => {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRouter;
