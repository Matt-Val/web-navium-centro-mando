import React, { useEffect, useState } from 'react';
import { obtenerMapaAndenes } from '../../services/bffService';
import { useDashboardRefresh } from '../../context/DashboardRefreshContext';
import { Spinner, EmptyState } from 'navium-ui-lib';
import { Building2 } from 'lucide-react';
import './MapaAndenes.css';

const MapaAndenes = () => {
    const { refreshKey } = useDashboardRefresh();
    const [andenes, setAndenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarMapa = async () => {
        try {
            setLoading(true);
            const data = await obtenerMapaAndenes();
            setAndenes(data);
            setError(null);
        } catch (error) {
            console.error("Error al cargar mapa:", error);
            setError('Error al cargar mapa de andenes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarMapa();
    }, [refreshKey]);

    const getEstadoClass = (estado) => {
        switch (estado?.toUpperCase()) {
            case 'LIBRE':
            case 'DISPONIBLE': return 'anden-libre';
            case 'OCUPADO': return 'anden-ocupado';
            case 'MANTENIMIENTO': return 'anden-mantenimiento';
            default: return 'anden-desconocido';
        }
    };

    if (loading) return <div className="mapa-loading"><Spinner size="lg" color="primary" message="Cargando mapa de patio..." /></div>;

    if (error) return <div className="mapa-loading" style={{color: '#ef4444'}}>{error}</div>;

    if (andenes.length === 0) return (
        <div className="mapa-container">
            <div className="mapa-header">
                <h3>Mapa de Andenes</h3>
            </div>
            <EmptyState 
                icon={<Building2 size={48} color="#94a3b8" />}
                title="Sin andenes"
                message="No hay andenes disponibles en el sistema."
            />
        </div>
    );

    return (
        <div className="mapa-container">
            <div className="mapa-header">
                <h3>Mapa de Andenes</h3>
                <div className="mapa-legend">
                    <span className="legend-item"><span className="dot dot-libre"></span> Libre</span>
                    <span className="legend-item"><span className="dot dot-ocupado"></span> Ocupado</span>
                    <span className="legend-item"><span className="dot dot-mantenimiento"></span> Mantenimiento</span>
                </div>
            </div>
            
            <div className="mapa-grid">
                {andenes.map(anden => (
                    <div key={anden.id} className={`anden-card ${getEstadoClass(anden.estado)}`}>
                        <div className="anden-info">
                            <span className="anden-codigo">{anden.codigo}</span>
                            <span className="anden-zona">{anden.zona} - #{anden.numero}</span>
                        </div>
                        {anden.patenteOcupante && (
                            <div className="anden-ocupante">
                                <span className="patente">{anden.patenteOcupante}</span>
                                <span className="contenedor">{anden.contenedorOcupante}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MapaAndenes;
