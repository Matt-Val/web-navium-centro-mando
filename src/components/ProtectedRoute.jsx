import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/*
    Este componente revisa si tiene la "llave" antes de dejar pasar al Dashboard.
    Si no la tiene, lo mandará de vuelta al Login de manera automática.
*/

const ProtectedRoute = ({ children }) => { 
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) { 
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default ProtectedRoute;