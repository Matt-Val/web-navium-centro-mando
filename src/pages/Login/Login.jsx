import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, FormGroup } from 'navium-ui-lib';
import '../../styles/Login/Login.css';

const Login = () => { 
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = (e) => {
        e.preventDefault(); // Evita que la pagina recargue al dar ENTER

        // Mock simulado
        if (usuario === 'admin@navium.com' && password === '1234') {
            login('token-de-prueba-muy-seguro');
            navigate('/dashboard'); // Redirige a dashboard
        } else { 
          setError('Credenciales inválidas. Intenta nuevamente.');
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
          >
            Iniciar Sesión
          </Button>
        </form>

      </div>
    </div>
    );
};

export default Login;