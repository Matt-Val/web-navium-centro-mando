import React, { createContext, useContext, useState, useCallback } from 'react';

const DashboardRefreshContext = createContext();

export const useDashboardRefresh = () => {
    const context = useContext(DashboardRefreshContext);
    if (!context) {
        throw new Error('useDashboardRefresh must be used within DashboardRefreshProvider');
    }
    return context;
};

export const DashboardRefreshProvider = ({ children }) => {
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    return (
        <DashboardRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
            {children}
        </DashboardRefreshContext.Provider>
    );
};