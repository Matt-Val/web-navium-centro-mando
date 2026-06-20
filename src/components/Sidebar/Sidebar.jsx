import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Package, Building2, Calendar, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ isCollapsed }) => {
  const { logout } = useAuth();

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="logo-icon">N</div>
        {!isCollapsed && (
          <div className="brand-text">
            <h2>NAVIUM</h2>
            <span>LOGISTICS</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className="active" title="Dashboard">
            <a href="#dashboard">
              <span className="nav-icon"><LayoutDashboard size={20} /></span>
              {!isCollapsed && <span className="nav-label">Dashboard</span>}
            </a>
          </li>
          <li title="Contenedores">
            <a href="#contenedores">
              <span className="nav-icon"><Package size={20} /></span>
              {!isCollapsed && <span className="nav-label">Contenedores</span>}
            </a>
          </li>
          <li title="Andenes">
            <a href="#andenes">
              <span className="nav-icon"><Building2 size={20} /></span>
              {!isCollapsed && <span className="nav-label">Andenes</span>}
            </a>
          </li>
          <li title="Agendamientos">
            <a href="#agendamientos">
              <span className="nav-icon"><Calendar size={20} /></span>
              {!isCollapsed && <span className="nav-label">Agendamientos</span>}
            </a>
          </li>
          <li title="Configuración">
            <a href="#configuracion">
              <span className="nav-icon"><Settings size={20} /></span>
              {!isCollapsed && <span className="nav-label">Configuración</span>}
            </a>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="btn-logout-sidebar" title="Cerrar Sesión">
          <span className="nav-icon"><LogOut size={20} /></span>
          {!isCollapsed && <span className="nav-label">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;