import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardRefresh } from '../../context/DashboardRefreshContext';
import { obtenerTablero } from '../../services/bffService';
import { useToast, Spinner } from 'navium-ui-lib';
import { Users, ChevronDown, X, Search } from 'lucide-react';
import UsersModal from '../../components/UsersModal/UsersModal';
import MapaAndenes from '../../components/MapaAndenes/MapaAndenes';
import RevisionDocumental from '../../components/RevisionDocumental/RevisionDocumental';
import DashboardStats from '../../components/DashboardStats/DashboardStats';
import './Dashboard.css';

const Dashboard = () => {
  const { logout } = useAuth();
  const { refreshKey } = useDashboardRefresh();
  const toast = useToast();
  const [operaciones, setOperaciones] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState('TODOS');
  const [estadoFiltro, setEstadoFiltro] = useState('TODOS');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTipoFilter, setShowTipoFilter] = useState(false);
  const [showEstadoFilter, setShowEstadoFilter] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);

  const cargarDatos = async () => { 
    try { 
      setLoadingTable(true);
      const data = await obtenerTablero();
      setOperaciones(data);
    } catch (error) { 
      console.error('Error al cargar el Dashboard: ', error);
      toast.error('Error al cargar datos del dashboard');
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect( () => { 
    cargarDatos();
  }, [refreshKey]);
  
  // Cálculos para los números de las tarjetas
  const operacionesConContenedor = operaciones.filter(op => op.estadoContenedor && op.estadoContenedor !== 'NO ENCONTRADO EN PATIO').length;
  const operacionesPerdidas = operaciones.filter(op => op.estadoContenedor === 'NO ENCONTRADO EN PATIO').length;

  const filtrosDisponibles = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Ingreso', value: 'INGRESO_CARGA' },
    { label: 'Retiro', value: 'RETIRO_CARGA' },
    { label: 'Devolucion', value: 'DEVOLUCION_VACIO' }
  ];

  const estadosDisponibles = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'En Patio', value: 'EN PATIO' },
    { label: 'Registrado', value: 'REGISTRADO' },
    { label: 'Detenido', value: 'DETENIDO' },
    { label: 'Despachado', value: 'DESPACHADO' }
  ];

  const operacionesFiltradas = useMemo(() => {
    let filtradas = operaciones;

    // 1. Filtro por Tipo de Operación
    if (tipoFiltro !== 'TODOS') {
      filtradas = filtradas.filter((op) =>
        (op.tipoOperacion || '').toUpperCase().includes(tipoFiltro)
      );
    }

    // 2. Filtro por Estado del Contenedor
    if (estadoFiltro !== 'TODOS') {
      filtradas = filtradas.filter((op) =>
        (op.estadoContenedor || '').toUpperCase() === estadoFiltro
      );
    }

    // 3. Filtro por Término de Búsqueda (Texto libre)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtradas = filtradas.filter((op) =>
        (op.codigoContenedor || '').toLowerCase().includes(term)
      );
    }

    return filtradas;
  }, [operaciones, tipoFiltro, estadoFiltro, searchTerm]);

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
      case 'REGISTRADO':
        return 'status status-info';
      case 'DETENIDO':
        return 'status status-warn';
      case 'DESPACHADO':
        return 'status status-muted';
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
          <button onClick={() => setIsUsersModalOpen(true)} className="navbar-cta navbar-btn-users">
            <Users size={18} style={{marginRight: '8px', verticalAlign: 'middle'}} />
            Usuarios
          </button>
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
            <h3>Contenedores Activos</h3>
            <span className="kpi-value" style={{color: '#10b981'}}>
              {operacionesConContenedor}
            </span>
            <span className="kpi-label" style={{color: '#10b981'}}>Registrados</span>
          </div>

          <div className="kpi-card kpi-danger">
            <h3>Contenedores No Encontrados</h3>
            <span className="kpi-value">{operacionesPerdidas}</span>
            <span className="kpi-label">Alerta crítica</span>
          </div>
        </div>

        {/* 4. ESTADÍSTICAS Y GRÁFICOS */}
        <DashboardStats />

        {/* 5. MAPA ESPACIAL DE ANDENES */}
        <MapaAndenes />

        {/* 5. GESTIÓN DOCUMENTAL */}
        <RevisionDocumental />

        {/* 6. LA TABLA PRINCIPAL */}
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
                <Search size={16} className="search-icon-lucide" />
                <input
                  type="text"
                  placeholder="Buscar por codigo de contenedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="clear-search" onClick={() => setSearchTerm('')}>
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="filter-dropdowns">
                <div className="filter-select-wrapper">
                  <label>Tipo:</label>
                  <div className="filter-select">
                    <button
                      className={`filter-btn filter-btn-tipo ${tipoFiltro !== 'TODOS' ? 'active' : ''}`}
                      onClick={() => setShowTipoFilter(!showTipoFilter)}
                    >
                      {filtrosDisponibles.find(f => f.value === tipoFiltro)?.label || 'Todos'}
                      <ChevronDown size={14} className="filter-arrow-lucide" />
                    </button>
                    {showTipoFilter && (
                      <div className="filter-menu">
                        {filtrosDisponibles.map((filtro) => (
                          <button
                            key={filtro.value}
                            className={filtro.value === tipoFiltro ? 'selected' : ''}
                            onClick={() => { setTipoFiltro(filtro.value); setShowTipoFilter(false); }}
                          >
                            {filtro.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="filter-select-wrapper">
                  <label>Estado:</label>
                  <div className="filter-select">
                    <button
                      className={`filter-btn filter-btn-estado ${estadoFiltro !== 'TODOS' ? 'active' : ''}`}
                      onClick={() => setShowEstadoFilter(!showEstadoFilter)}
                    >
                      {estadosDisponibles.find(e => e.value === estadoFiltro)?.label || 'Todos'}
                      <ChevronDown size={14} className="filter-arrow-lucide" />
                    </button>
                    {showEstadoFilter && (
                      <div className="filter-menu">
                        {estadosDisponibles.map((estado) => (
                          <button
                            key={estado.value}
                            className={estado.value === estadoFiltro ? 'selected' : ''}
                            onClick={() => { setEstadoFiltro(estado.value); setShowEstadoFilter(false); }}
                          >
                            {estado.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {(tipoFiltro !== 'TODOS' || estadoFiltro !== 'TODOS') && (
                  <button
                    className="filter-clear-btn"
                    onClick={() => { setTipoFiltro('TODOS'); setEstadoFiltro('TODOS'); }}
                  >
                    <X size={14} style={{marginRight: '4px'}} />
                    Limpiar
                  </button>
                )}
              </div>

              <button
                className="mobile-filter-toggle"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                {tipoFiltro !== 'TODOS' || estadoFiltro !== 'TODOS' ? (
                  <span className="filter-badge-count">{(tipoFiltro !== 'TODOS' ? 1 : 0) + (estadoFiltro !== 'TODOS' ? 1 : 0)}</span>
                ) : '☰'}
              </button>

              {showMobileFilters && (
                <div className="filter-mobile-panel">
                  <div className="filter-select-wrapper">
                    <label>Tipo:</label>
                    <div className="filter-select">
                      <button
                        className={`filter-btn filter-btn-tipo ${tipoFiltro !== 'TODOS' ? 'active' : ''}`}
                        onClick={() => setShowTipoFilter(!showTipoFilter)}
                      >
                        {filtrosDisponibles.find(f => f.value === tipoFiltro)?.label || 'Todos'}
                        <ChevronDown size={14} className="filter-arrow-lucide" />
                      </button>
                      {showTipoFilter && (
                        <div className="filter-menu">
                          {filtrosDisponibles.map((filtro) => (
                            <button
                              key={filtro.value}
                              className={filtro.value === tipoFiltro ? 'selected' : ''}
                              onClick={() => { setTipoFiltro(filtro.value); setShowTipoFilter(false); }}
                            >
                              {filtro.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="filter-select-wrapper">
                    <label>Estado:</label>
                    <div className="filter-select">
                      <button
                        className={`filter-btn filter-btn-estado ${estadoFiltro !== 'TODOS' ? 'active' : ''}`}
                        onClick={() => setShowEstadoFilter(!showEstadoFilter)}
                      >
                        {estadosDisponibles.find(e => e.value === estadoFiltro)?.label || 'Todos'}
                        <ChevronDown size={14} className="filter-arrow-lucide" />
                      </button>
                      {showEstadoFilter && (
                        <div className="filter-menu">
                          {estadosDisponibles.map((estado) => (
                            <button
                              key={estado.value}
                              className={estado.value === estadoFiltro ? 'selected' : ''}
                              onClick={() => { setEstadoFiltro(estado.value); setShowEstadoFilter(false); }}
                            >
                              {estado.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {(tipoFiltro !== 'TODOS' || estadoFiltro !== 'TODOS') && (
                    <button
                      className="filter-clear-btn"
                      onClick={() => { setTipoFiltro('TODOS'); setEstadoFiltro('TODOS'); }}
                    >
                      <X size={14} style={{marginRight: '4px'}} />
                      Limpiar filtros
                    </button>
                  )}

                  <button
                    className="filter-close-btn"
                    onClick={() => setShowMobileFilters(false)}
                  >
                    <X size={16} />
                    Cerrar
                  </button>
                </div>
              )}
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
              {loadingTable ? (
                <tr>
                  <td colSpan="7" className="table-empty" style={{textAlign: 'center', padding: '40px'}}>
                    <Spinner size="lg" color="primary" message="Cargando operaciones..." />
                  </td>
                </tr>
              ) : operacionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="table-empty">
                    {searchTerm ? 'No se encontraron resultados para tu búsqueda' : 'No hay operaciones registradas'}
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

      <UsersModal
        isOpen={isUsersModalOpen}
        onClose={() => setIsUsersModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
