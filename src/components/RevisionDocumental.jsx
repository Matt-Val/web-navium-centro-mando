import React, { useEffect, useState } from 'react';
import { obtenerDocumentosPendientes, revisarDocumento } from '../services/bffService';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard/RevisionDocumental.css';

const RevisionDocumental = () => {
    const { token } = useAuth();
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarDocumentos = async () => {
        try {
            const data = await obtenerDocumentosPendientes(token);
            setDocumentos(data);
        } catch (error) {
            console.error("Error al cargar documentos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDocumentos();
    }, [token]);

    const handleAccion = async (idContenedor, estado) => {
        try {
            await revisarDocumento(idContenedor, estado, token);
            // Removemos de la lista local tras la acción
            setDocumentos(prev => prev.filter(doc => doc.idContenedor !== idContenedor));
            alert(`Contenedor ${idContenedor} ${estado === 'APROBADO' ? 'liberado' : 'rechazado'} correctamente.`);
        } catch (error) {
            alert("Error al procesar la revisión.");
        }
    };

    if (loading) return <div className="docs-loading">Buscando documentos pendientes...</div>;
    if (documentos.length === 0) return null;

    return (
        <div className="docs-container">
            <div className="docs-header">
                <h3>Gestión Documental (Pendientes)</h3>
                <span className="docs-badge">{documentos.length} requeridos</span>
            </div>
            
            <div className="docs-list">
                {documentos.map((doc, index) => (
                    <div key={index} className="doc-item">
                        <div className="doc-main-info">
                            <span className="doc-id">{doc.idContenedor}</span>
                            <span className="doc-patente">Camión: {doc.patenteCamion}</span>
                        </div>
                        <div className="doc-type">
                            <span className="label">Tipo:</span> {doc.tipoDocumento}
                        </div>
                        <div className="doc-actions">
                            <button 
                                className="btn-approve" 
                                onClick={() => handleAccion(doc.idContenedor, 'APROBADO')}
                            >
                                Aprobar BL/TATC
                            </button>
                            <button 
                                className="btn-reject"
                                onClick={() => handleAccion(doc.idContenedor, 'RECHAZADO')}
                            >
                                Rechazar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RevisionDocumental;
