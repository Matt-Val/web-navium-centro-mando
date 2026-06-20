import { useState } from 'react'
import { BrowserRouter , Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import './styles/App.css'
import { AuthProvider } from './context/AuthContext';
import { DashboardRefreshProvider } from './context/DashboardRefreshContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Dashboard from './pages/Dashboard/Dashboard';
import { Footer, ToastProvider } from 'navium-ui-lib';
import logo from './assets/navium-v1.png';

function App() {

  return (
    <AuthProvider>
      <ToastProvider>
        <DashboardRefreshProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard/>
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/login" replace /> } />
            </Routes>
            <Footer
              logo={logo}
              moduleLinks={[
                { label: 'Servicios', href: '#servicios' },
                { label: 'Nosotros', href: '#nosotros' },
                { label: 'Clientes', href: '#clientes' },
                { label: 'Contacto', href: '#contacto' }
              ]}
            />
          </BrowserRouter>
        </DashboardRefreshProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
