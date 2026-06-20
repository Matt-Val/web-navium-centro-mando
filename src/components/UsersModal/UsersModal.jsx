import React, { useState, useEffect } from 'react';
import { useToast, Spinner, Button } from 'navium-ui-lib';
import { UserPlus, Pencil, Trash2, Check, X } from 'lucide-react';
import './UsersModal.css';

const ROLES = [
  { value: 'ROL_CENTRO_MANDO', label: 'Centro de Mando' },
  { value: 'ROL_SUCURSAL', label: 'Sucursal' },
  { value: 'ROL_OPERADOR', label: 'Operador' }
];

const UsersModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    email: '',
    password: '',
    rol: 'ROL_OPERADOR'
  });

  useEffect(() => {
    if (isOpen) {
      cargarUsuarios();
    }
  }, [isOpen]);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/usuarios', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    try {
      const method = editingUser ? 'PUT' : 'POST';
      const url = editingUser ? `/api/dashboard/usuarios/${editingUser.id}` : '/api/dashboard/usuarios';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingUser ? 'Usuario actualizado' : 'Usuario creado');
        setShowForm(false);
        setEditingUser(null);
        resetForm();
        cargarUsuarios();
      } else {
        const errorMsg = await response.text();
        toast.error(errorMsg || 'Error al guardar usuario');
        
        if (errorMsg.toLowerCase().includes('rut')) {
          setFieldErrors(prev => ({ ...prev, rut: true }));
        }
        if (errorMsg.toLowerCase().includes('email') || errorMsg.toLowerCase().includes('correo')) {
          setFieldErrors(prev => ({ ...prev, email: true }));
        }
      }
    } catch (error) {
      toast.error('Error al guardar usuario');
    }
  };

  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setFieldErrors({});
    setFormData({
      rut: usuario.rut,
      nombre: usuario.nombre,
      email: usuario.email,
      password: '',
      rol: usuario.rol
    });
    setShowForm(true);
  };

  const handleDesactivar = async (id) => {
    if (!confirm('¿Confirmas desactivar este usuario?')) return;
    try {
      const response = await fetch(`/api/dashboard/usuarios/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        toast.success('Usuario desactivado');
        cargarUsuarios();
      }
    } catch (error) {
      toast.error('Error al desactivar usuario');
    }
  };

  const handleActivar = async (id) => {
    try {
      const response = await fetch(`/api/dashboard/usuarios/${id}/activar`, {
        method: 'PATCH',
        credentials: 'include'
      });
      if (response.ok) {
        toast.success('Usuario reactivado');
        cargarUsuarios();
      }
    } catch (error) {
      toast.error('Error al activar usuario');
    }
  };

  const resetForm = () => {
    setFormData({ rut: '', nombre: '', email: '', password: '', rol: 'ROL_OPERADOR' });
    setFieldErrors({});
  };

  const openCreateForm = () => {
    setEditingUser(null);
    resetForm();
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingUser(null);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="users-modal" onClick={e => e.stopPropagation()}>
        <div className="users-modal-header">
          <h3>Gestión de Usuarios</h3>
          <button className="users-modal-close" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="users-modal-content">
          {!showForm && (
            <div className="users-actions-bar">
              <Button variant="primary" onClick={openCreateForm} className="btn-create-user">
                <UserPlus size={18} />
                <span>Nuevo Usuario</span>
              </Button>
            </div>
          )}

          {showForm && (
            <div className="user-form-container">
              <h4>{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</h4>
              <form onSubmit={handleSubmit} className="user-form">
                {!editingUser && (
                  <div className="form-group">
                    <label>RUT</label>
                    <input
                      type="text"
                      name="rut"
                      value={formData.rut}
                      onChange={handleInputChange}
                      placeholder="12.345.678-9"
                      className={fieldErrors.rut ? 'input-error' : ''}
                      required
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre completo"
                    className={fieldErrors.nombre ? 'input-error' : ''}
                    required
                  />
                </div>
                {!editingUser && (
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@ejemplo.com"
                      className={fieldErrors.email ? 'input-error' : ''}
                      required
                    />
                  </div>
                )}
                {!editingUser && (
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Mínimo 8 caracteres"
                      required
                      minLength={8}
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Rol</label>
                  <select name="rol" value={formData.rol} onChange={handleInputChange}>
                    {ROLES.map(rol => (
                      <option key={rol.value} value={rol.value}>{rol.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-actions">
                  <Button type="submit" variant="primary">
                    {editingUser ? 'Actualizar' : 'Crear'}
                  </Button>
                  <Button type="button" variant="secondary" onClick={cancelForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="users-loading">
              <Spinner size="md" color="primary" message="Cargando usuarios..." />
            </div>
          ) : !showForm && (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>RUT</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(usuario => (
                    <tr key={usuario.id}>
                      <td>{usuario.rut}</td>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.email}</td>
                      <td>
                        <span className={`rol-badge rol-${usuario.rol.toLowerCase()}`}>
                          {usuario.rol.replace('ROL_', '')}
                        </span>
                      </td>
                      <td>
                        <span className={`estado-badge ${usuario.activo ? 'activo' : 'inactivo'}`}>
                          {usuario.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-action btn-edit"
                            onClick={() => handleEdit(usuario)}
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          {usuario.activo ? (
                            <button
                              className="btn-action btn-deactivate"
                              onClick={() => handleDesactivar(usuario.id)}
                              title="Desactivar"
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            <button
                              className="btn-action btn-activate"
                              onClick={() => handleActivar(usuario.id)}
                              title="Activar"
                            >
                              <Check size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersModal;