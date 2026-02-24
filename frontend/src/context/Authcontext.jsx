import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(null);
    const [ error, setError] = useState(null);

    async function refreshMe() {
        try {
            setError(null);
            const me = await authService.me();
            setUser(me);
        } catch (e) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refreshMe();
    }, []);

    async function login(email, password) {
        setLoading(true);
        try {
            setError(null);
            await authService.login(email, password);
            await refreshMe();
            return true;
        } catch (e) {
            setError(e.message);
            setLoading(false);
            return false;
        }
    }
}


    async function register(email, password) {
        setLoading(true);
        try {
            setError(null);
            await authService.register(email, password);
            setLoading(false);
            return true;
        } catch (e) {
            setError(e.message);
            setLoading(false);
            return false;
        }
    }


    async function logout() {
        setLoading(true);
        try {
            setError(null);
            await authService.logout();
        } finally  {
            setUser(null);
            setLoading(false);
        }
    }

const value = useMemo(
    () => ({ user, loading, error, login, register, logout, refreshMe }),
    [user, loading, error ]
);

return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>

export function useAuth() {
    const context = useContext{AuthContext};
    if (!context) throw new Error("useAuth no definido correctamente");
    return context;
}