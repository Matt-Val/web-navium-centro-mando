import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { obtenerTablero } from '../../services/bffService';
import { crearAgendamiento } from '../../services/agendamientoService';
import AddAgendamientoModal from '../../components/AddAgendamientoModal';
import '../../styles/Dashboard/Dashboard.css';

const Dashboard = () => {
  const { logout, token } = useAuth();
  
  const [operaciones, setOperaciones] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState('TODOS');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cargarDatos = async () => { 
    try { 
      const data = await obtenerTablero(token);
      setOperaciones(data);
    } catch (error) { 
      console.error('Error al cargar el Dashboard: ', error);
    }
  };

  useEffect( () => { 
    cargarDatos();
  }, [token]);
  
  const handleSaveAgendamiento = async (nuevoAgendamiento) => {
    await crearAgendamiento(nuevoAgendamiento, token);
    await cargarDatos(); // Recargar la tabla
  };
  
  // Cálculos para los números de las tarjetas
  const operacionesEnPatio = operaciones.filter(op => op.estadoContenedor === 'EN PATIO').length;
  const operacionesPerdidas = operaciones.filter(op => op.estadoContenedor === 'NO ENCONTRADO EN PATIO').length;

  const filtrosDisponibles = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Ingreso', value: 'INGRESO_CARGA' },
    { label: 'Retiro', value: 'RETIRO_CARGA' },
    { label: 'Devolucion', value: 'DEVOLUCION_VACIO' }
  ];

  const operacionesFiltradas = useMemo(() => {
    let filtradas = operaciones;

    // 1. Filtro por Tipo de Operación
    if (tipoFiltro !== 'TODOS') {
      filtradas = filtradas.filter((op) =>
        (op.tipoOperacion || '').toUpperCase().includes(tipoFiltro)
      );
    }

    // 2. Filtro por Término de Búsqueda (Texto libre)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtradas = filtradas.filter((op) =>
        (op.codigoContenedor || '').toLowerCase().includes(term)
      );
    }

    return filtradas;
  }, [operaciones, tipoFiltro, searchTerm]);

  const formatearHora = (hora) => {
    if (!hora) {
      return '--';
    }

    const fecha = new Date(hora);
    if (Number.isNaN(fecha.getTime())) {
      return hora;
    }

    return fecha.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOperacionClass = (tipo) => {
    switch ((tipo || '').toUpperCase()) {
      case 'CARGA':
      case 'INGRESO_CARGA':
        return 'tag tag-carga';
      case 'DESCARGA':
        return 'tag tag-descarga';
      case 'RETIRO':
      case 'RETIRO_CARGA':
        return 'tag tag-retiro';
      case 'ENTREGA':
        return 'tag tag-entrega';
      default:
        return 'tag';
    }
  };

  const getEstadoClass = (estado) => {
    switch ((estado || '').toUpperCase()) {
      case 'EN PATIO':
        return 'status status-ok';
      case 'EN TRANSITO':
        return 'status status-info';
      case 'ESPERA':
        return 'status status-warn';
      case 'NO ENCONTRADO EN PATIO':
        return 'status status-danger';
      case 'DESCONOCIDO':
        return 'status status-muted';
      default:
        return 'status';
    }
  };

  return (
    <div className="dashboard-layout">
      {/* 1. LA BARRA SUPERIOR ORIGINAL */}
      <header className="dashboard-navbar">
        <div className="navbar-brand">
          <img
            src="/navium-v1.png"
            alt="Navium"
            className="navbar-logo"
          />
        </div>
        <div className="navbar-actions">
          <button onClick={logout} className="navbar-cta">Cerrar Sesión</button>
        </div>
      </header>

      {/* 2. EL CONTENIDO PRINCIPAL */}
      <main className="dashboard-content">
        
        <div className="dashboard-header">
          <div className="header-title-row">
            <div>
              <h2>Panel de Operaciones</h2>
              <p>Monitoreo de andenes y contenedores</p>
            </div>
            <button className="btn-add" onClick={() => setIsModalOpen(true)}>
              + Nuevo Agendamiento
            </button>
          </div>
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
            <div className="table-title">
              <h3>Operaciones del tablero</h3>
              <span className="table-subtitle">
                {operacionesFiltradas.length} registros
              </span>
            </div>

            <div className="table-actions-row">
              <div className="search-box">
                <span className="search-icon" aria-hidden="true"></span>
                <input 
                  type="text" 
                  placeholder="Buscar por codigo de contenedor..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="clear-search" onClick={() => setSearchTerm('')}>&times;</button>
                )}
              </div>

              <div className="table-filters">
                {filtrosDisponibles.map((filtro) => (
                  <button
                    key={filtro.value}
                    type="button"
                    className={
                      filtro.value === tipoFiltro
                        ? 'filter-button filter-button-active'
                        : 'filter-button'
                    }
                    onClick={() => setTipoFiltro(filtro.value)}
                  >
                    {filtro.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <table className="navium-table">
            <thead>
              <tr>
                <th>Turno</th>
                <th>Patente</th>
                <th>Hora</th>
                <th>Operacion</th>
                <th>Contenedor</th>
                <th>Estado Contenedor</th>
                <th>Anden Asignado</th>
              </tr>
            </thead>
            <tbody>
              {operacionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="table-empty">
                    {searchTerm ? 'No se encontraron resultados para tu búsqueda' : 'Esperando datos del servidor...'}
                  </td>
                </tr>
              ) : (
                operacionesFiltradas.map((op) => (
                  <tr key={op.idTurno || `${op.patenteCamion}-${op.horaAgendada}`}>
                    <td className="col-turno">#{op.idTurno ?? '--'}</td>
                    <td className="col-patente">{op.patenteCamion ?? '--'}</td>
                    <td className="col-hora">{formatearHora(op.horaAgendada)}</td>
                    <td>
                      <span className={getOperacionClass(op.tipoOperacion)}>
                        {op.tipoOperacion ?? '--'}
                      </span>
                    </td>
                    <td className="col-contenedor">{op.codigoContenedor ?? '--'}</td>
                    <td>
                      <span className={getEstadoClass(op.estadoContenedor)}>
                        {op.estadoContenedor ?? '--'}
                      </span>
                    </td>
                    <td className="col-anden">
                      {op.andenAsignado || 'SIN ANDEN ASIGNADO'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </main>

      <AddAgendamientoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveAgendamiento}
        userId={1}
        userEmail="matias@navium.com"
      />
    </div>
  );
};

export default Dashboard;
