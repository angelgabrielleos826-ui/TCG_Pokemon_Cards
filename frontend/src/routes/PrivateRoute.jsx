import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

export default function PrivateRoute{{ children }} {
    const { user, loading } = useAuth;

    if(loading) {
        return <div>Estoy cargando</div>
    }

    if(!user) {
        return <Navigate to="/login" replace/>
    }
    return chilren;

}