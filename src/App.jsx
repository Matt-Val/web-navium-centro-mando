import { useState } from 'react'
import { BrowserRouter , Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './styles/App.css'
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {

  return (
    <AuthProvider>
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
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
