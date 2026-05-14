import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { obtenerTablero } from '../../services/bffService';
import '../../styles/Dashboard/Dashboard.css';

const Dashboard = () => {
  const { logout, token } = useAuth();
  
  const [operaciones, setOperaciones] = useState([]);

  useEffect( () => { 
    const cargarDatos = async () => { 
      try { 
        const data = await obtenerTablero(token);
        setOperaciones(data);
      } catch (error) { 
        console.error('Error al cargar el Dashboard: ', error);
      }
    };
    cargarDatos();

  }, [token]);
  
  // Cálculos para los números de las tarjetas
  const operacionesEnPatio = operaciones.filter(op => op.estadoContenedor === 'EN PATIO').length;
  const operacionesPerdidas = operaciones.filter(op => op.estadoContenedor === 'NO ENCONTRADO EN PATIO').length;

  return (
    <div className="dashboard-layout">
      {/* 1. LA BARRA SUPERIOR */}
      <header className="dashboard-navbar">
        <div className="navbar-brand">
          <h1>NAVIUM LOGISTICS</h1>
          <span className="navbar-subtitle">CENTRO DE MANDO</span>
        </div>
        <div className="navbar-actions">
          <span className="status-badge">Sistema: Estable</span>
          <button onClick={logout} className="btn-logout">Cerrar Sesión</button>
        </div>
      </header>

      {/* 2. EL CONTENIDO PRINCIPAL */}
      <main className="dashboard-content">
        
        <div className="dashboard-header">
          <h2>Panel de Operaciones en tiempo real</h2>
          <p>Monitoreo de andenes y contenedores</p>
          <br></br>
        </div>

        {/* 3. LAS 3 TARJETAS DE RESUMEN */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <h3>Turnos Agendados</h3>
            <span className="kpi-value">{operaciones.length}</span>
            <span className="kpi-label">Total del día</span>
          </div>
          
          <div className="kpi-card">
            <h3>Contenedores en Patio</h3>
            <span className="kpi-value" style={{color: '#10b981'}}>
              {operacionesEnPatio}
            </span>
            <span className="kpi-label" style={{color: '#10b981'}}>Activos</span>
          </div>

          <div className="kpi-card kpi-danger">
            <h3>Contenedores No Encontrados</h3>
            <span className="kpi-value">{operacionesPerdidas}</span>
            <span className="kpi-label">Alerta crítica</span>
          </div>
        </div>

        {/* 4. LA TABLA PRINCIPAL */}
        <div className="table-container">
          <div className="table-header">
            <h3>Andenes activos</h3>
          </div>
          <table className="navium-table">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Patente</th>
                <th>Tipo Operación</th>
                <th>ID Contenedor</th>
                <th>Andén</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              
              <tr>
                <td colSpan="6" className="table-empty">
                  Esperando datos del servidor...
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;