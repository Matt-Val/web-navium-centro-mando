import React, { useEffect, useState } from 'react';
import { Button, FormGroup } from 'navium-ui-lib';

const AddAgendamientoModal = ({ isOpen, onClose, onSave, userEmail, userId }) => {
  const getInitialFormData = () => ({
    idUsuario: userId || 1,
    correoUsuario: userEmail || '',
    patenteCamion: '',
    rutChofer: '',
    tipoOperacion: 'INGRESO_CARGA',
    idContenedor: '',
    codigoAnden: '',
    horaInicio: ''
  });

  const [formData, setFormData] = useState(getInitialFormData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
      setError('');
    }
  }, [isOpen, userId, userEmail]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validar que la fecha no esté vacía
      if (!formData.horaInicio) {
        throw new Error('La hora de inicio es obligatoria');
      }

      await onSave(formData);
      setFormData(getInitialFormData());
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el agendamiento');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(getInitialFormData());
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Nuevo Agendamiento</h3>
          <button className="close-btn" onClick={handleClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error">{error}</div>}
          
          <div className="form-grid">
            <FormGroup label="Patente Camión">
              <input 
                name="patenteCamion" 
                value={formData.patenteCamion} 
                onChange={handleChange} 
                placeholder="AB-CD-12"
                required 
              />
            </FormGroup>

            <FormGroup label="RUT Chofer">
              <input 
                name="rutChofer" 
                value={formData.rutChofer} 
                onChange={handleChange} 
                placeholder="12345678-9"
                required 
              />
            </FormGroup>

            <FormGroup label="Tipo Operación">
              <select name="tipoOperacion" value={formData.tipoOperacion} onChange={handleChange} required>
                <option value="INGRESO_CARGA">INGRESO_CARGA</option>
                <option value="RETIRO_CARGA">RETIRO_CARGA</option>
                <option value="DEVOLUCION_VACIO">DEVOLUCION_VACIO</option>
              </select>
            </FormGroup>

            <FormGroup label="Contenedor">
              <input 
                name="idContenedor" 
                value={formData.idContenedor} 
                onChange={handleChange} 
                placeholder="MSKU1234567"
              />
            </FormGroup>

            <FormGroup label="Andén">
              <input 
                name="codigoAnden" 
                value={formData.codigoAnden} 
                onChange={handleChange} 
                placeholder="A1"
              />
            </FormGroup>

            <FormGroup label="Hora Inicio">
              <input 
                type="datetime-local" 
                name="horaInicio" 
                value={formData.horaInicio} 
                onChange={handleChange} 
                required 
              />
            </FormGroup>
          </div>

          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Crear Agendamiento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAgendamientoModal;
