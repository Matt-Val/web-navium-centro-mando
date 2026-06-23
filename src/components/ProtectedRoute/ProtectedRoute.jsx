import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => { 
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) { 
        // Redirigir al Login Central
        const loginUrl = import.meta.env.VITE_URL_LOGIN_CENTRAL || 'http://localhost:5170';
        window.location.href = loginUrl;
        return null;
    }
    return children;
};

export default ProtectedRoute;