import React, { useEffect, useState } from 'react';
import { obtenerDocumentosPendientes, revisarDocumento } from '../../services/bffService';
import { useDashboardRefresh } from '../../context/DashboardRefreshContext';
import { useToast, Spinner, EmptyState } from 'navium-ui-lib';
import { ClipboardCheck } from 'lucide-react';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import './RevisionDocumental.css';

const RevisionDocumental = () => {
    const { refreshKey } = useDashboardRefresh();
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();

    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        idContenedor: null,
        estado: null,
        titulo: '',
        mensaje: ''
    });

    const cargarDocumentos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await obtenerDocumentosPendientes();
            setDocumentos(data);
        } catch (error) {
            console.error("Error al cargar documentos:", error);
            setError('Error al cargar documentos');
            toast.error('Error al cargar documentos pendientes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDocumentos();
    }, [refreshKey]);

    const handleAccion = (doc, estado) => {
        const esAprobado = estado === 'APROBADO';
        setConfirmState({
            isOpen: true,
            idContenedor: doc.idContenedor,
            estado,
            titulo: esAprobado ? 'Aprobar Documento BL' : 'Rechazar Documento BL',
            mensaje: esAprobado 
                ? `¿Estás seguro de APROBAR el documento BL del contenedor ${doc.siglaContenedor}? Esta acción liberará el contenedor en el puerto.`
                : `¿Estás seguro de RECHAZAR el documento BL del contenedor ${doc.siglaContenedor}? Esta acción marcará la documentación como rechazada y requerirá nuevamente cargar los documentos.`
        });
    };

    const handleConfirm = async () => {
        try {
            await revisarDocumento(confirmState.idContenedor, confirmState.estado);
            setDocumentos(prev => prev.filter(doc => doc.idContenedor !== confirmState.idContenedor));
            const docProcesado = documentos.find(d => d.idContenedor === confirmState.idContenedor);
            toast.success(`Contenedor ${docProcesado?.siglaContenedor || ''} ${confirmState.estado === 'APROBADO' ? 'liberado' : 'rechazado'} correctamente`);
        } catch (error) {
            toast.error('Error al procesar la revisión');
        } finally {
            setConfirmState(prev => ({ ...prev, isOpen: false }));
        }
    };

    const handleCancel = () => {
        setConfirmState(prev => ({ ...prev, isOpen: false }));
    };

    if (loading) return <div className="docs-loading"><Spinner size="lg" color="primary" message="Buscando documentos pendientes..." /></div>;

    if (error) return <div className="docs-loading" style={{color: '#ef4444'}}>{error}</div>;

    if (documentos.length === 0) return (
        <div className="docs-container">
            <div className="docs-header">
                <h3>Gestión Documental</h3>
                <span className="docs-badge">0</span>
            </div>
            <EmptyState 
                icon={<ClipboardCheck size={48} color="#94a3b8" />}
                title="Sin documentos pendientes"
                message="No hay documentos que requieran revisión en este momento."
            />
        </div>
    );

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
                            <span className="doc-id">{doc.siglaContenedor}</span>
                            <span className="doc-patente">Camión: {doc.patenteCamion}</span>
                        </div>
                        <div className="doc-type">
                            <span className="label">Tipo:</span> {doc.tipoDocumento}
                        </div>
                        <div className="doc-actions">
                            <button 
                                className="btn-approve" 
                                onClick={() => handleAccion(doc, 'APROBADO')}
                            >
                                Aprobar BL/TATC
                            </button>
                            <button 
                                className="btn-reject"
                                onClick={() => handleAccion(doc, 'RECHAZADO')}
                            >
                                Rechazar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmDialog
                isOpen={confirmState.isOpen}
                title={confirmState.titulo}
                message={confirmState.mensaje}
                confirmText="Confirmar"
                cancelText="Cancelar"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                type={confirmState.estado === 'APROBADO' ? 'warning' : 'danger'}
            />
        </div>
    );
};

export default RevisionDocumental;