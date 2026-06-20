import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ( { children } ) => { 
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return document.cookie.includes('navium_auth=true') || document.cookie.includes('token=');
    });

    const login = (token) => { 
        document.cookie = 'navium_auth=true; path=/; max-age=36000';
        setIsAuthenticated(true);
    };

    const logout = () => { 
        document.cookie = 'navium_auth=; path=/; max-age=0';
        setIsAuthenticated(false);
    };

    return ( 
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);