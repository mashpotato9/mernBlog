import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
    const {currUser} = useSelector((state) => state.user);

    return currUser ? <Outlet /> : <Navigate to="/login" />;
}
