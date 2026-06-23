import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ( { children } ) => { 
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Empezar en null (cargando)

    React.useEffect(() => {
        // Verificar si la cookie HttpOnly es válida preguntando al backend
        fetch('/api/auth/me')
            .then(res => {
                if (res.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            })
            .catch(() => setIsAuthenticated(false));
    }, []);

    const login = (token) => { 
        // El login centralizado maneja esto, pero lo dejamos por si acaso
        setIsAuthenticated(true);
    };

    const logout = async () => { 
        // Llamar al backend para que borre la cookie HttpOnly
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (e) {
            console.error('Error al cerrar sesión', e);
        }
        setIsAuthenticated(false);
        const loginUrl = import.meta.env.VITE_URL_LOGIN_CENTRAL || 'http://localhost:5170';
        window.location.href = loginUrl;
    };

    if (isAuthenticated === null) return null;

    return ( 
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);