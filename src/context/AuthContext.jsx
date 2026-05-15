import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ( { children } ) => { 
    const [token, setToken] = useState(localStorage.getItem('navium_token'));

    // Cada vez que el token cambie, lo actualizamos al almacenamiento local
    useEffect( () => { 
        if (token) { 
            localStorage.setItem('navium_token', token);
        } else { 
            localStorage.removeItem('navium_token');
        }
    }, [token]);

    const login = (newToken) => { 
        setToken(newToken);
    };

    const logout = () => { 
        setToken(null);
    };

    return ( 
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token}}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);