import React from 'react';
import { Button } from 'navium-ui-lib';
import { AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ 
    isOpen, 
    title, 
    message, 
    confirmText = 'Confirmar', 
    cancelText = 'Cancelar', 
    onConfirm, 
    onCancel,
    type = 'warning'
}) => {
    if (!isOpen) return null;

    const icons = {
        warning: <AlertTriangle size={32} />,
        danger: <AlertCircle size={32} />,
        info: <Info size={32} />,
        success: <CheckCircle size={32} />
    };

    return (
        <div className="confirm-dialog-overlay">
            <div className="confirm-dialog">
                <div className={`confirm-dialog__icon confirm-dialog__icon--${type}`}>
                    {icons[type] || icons.warning}
                </div>
                <h3 className="confirm-dialog__title">{title}</h3>
                <p className="confirm-dialog__message">{message}</p>
                <div className="confirm-dialog__actions">
                    <Button variant="secondary" onClick={onCancel}>
                        {cancelText}
                    </Button>
                    <Button variant={type === 'danger' ? 'error' : 'primary'} onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;