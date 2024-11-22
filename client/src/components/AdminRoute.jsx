import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
    const {currUser} = useSelector((state) => state.user);

    return currUser && currUser.isAdmin ? <Outlet /> : <Navigate to="/login" />;
}