import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Header from "../component/Header";
import { useEffect } from "react";

const ProtectedRoute = ({ children } : any) => {
    const isLogin = localStorage.getItem('isLogin')
    const isAuth = isLogin || undefined;
return isAuth ?  <>
                    <Outlet/>
                    </> 
                    :
                     <Navigate to="/login" />;
};

export default ProtectedRoute;
