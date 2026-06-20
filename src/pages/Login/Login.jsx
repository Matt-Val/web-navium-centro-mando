import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, FormGroup } from 'navium-ui-lib';
import { loginUsuario } from '../../services/authService';
import './Login.css';

const Login = () => { 
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await loginUsuario(usuario, password);
            login();
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Credenciales inválidas o error de conexión.');
        } finally {
            setLoading(false);
        }
    };

    return ( 
        <div className="login-layout">
      <div className="login-card">
        
        <div className="login-header">
          <h1>Navium Logistics</h1>
          <h2>Centro de Mando</h2>
          <p>Ingresa tus credenciales operativas</p>
        </div>
        
        {error && <div className="login-error-message" style={{ color: '#ff4d4f', marginBottom: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <FormGroup 
            label="Correo"
            id="email"
          >
            <input 
              type="email"
              placeholder="@navium.com"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </FormGroup>

          <FormGroup 
            label="Contraseña"
            id="password"
            error={!!error}
          >
            <input 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="login-btn-submit"
            disabled={loading}
          >
            {loading ? 'Validando...' : 'Iniciar Sesión'}
          </Button>
        </form>

      </div>
    </div>
    );
};

export default Login;