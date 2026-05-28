import React, { useEffect, useState } from 'react';
import { obtenerMapaAndenes } from '../services/bffService';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard/MapaAndenes.css';

const MapaAndenes = () => {
    const { token } = useAuth();
    const [andenes, setAndenes] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarMapa = async () => {
        try {
            const data = await obtenerMapaAndenes(token);
            setAndenes(data);
        } catch (error) {
            console.error("Error al cargar mapa:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarMapa();
        const interval = setInterval(cargarMapa, 30000); // Refrescar cada 30s
        return () => clearInterval(interval);
    }, [token]);

    const getEstadoClass = (estado) => {
        switch (estado?.toUpperCase()) {
            case 'LIBRE': return 'anden-libre';
            case 'OCUPADO': return 'anden-ocupado';
            case 'MANTENIMIENTO': return 'anden-mantenimiento';
            default: return 'anden-desconocido';
        }
    };

    if (loading) return <div className="mapa-loading">Cargando mapa de patio...</div>;

    return (
        <div className="mapa-container">
            <div className="mapa-header">
                <h3>Mapa Espacial de Andenes</h3>
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
