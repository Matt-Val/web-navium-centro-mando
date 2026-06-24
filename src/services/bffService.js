
const DASHBOARD_BASE_URL = import.meta.env.VITE_API_DASHBOARD || '/api/dashboard';

export const obtenerTablero = async () => { 
    try { 
        const response = await fetch(`${DASHBOARD_BASE_URL}/operaciones`, {
            method: 'GET',
            credentials: 'include'
        });

        if (response.status === 403) {
            throw new Error('Acceso denegado. Token inválido o expirado.');
        }
        if (!response.ok) throw new Error('Error al obtener los datos del tablero');
        return await response.json();
    } catch (error) {
        console.error('error al conectar con el BFF:', error);
        throw error;
    }
};

export const obtenerMapaAndenes = async () => {
    try {
        const response = await fetch(`${DASHBOARD_BASE_URL}/mapa-andenes`, {
            method: 'GET',
            credentials: 'include'
        });
        if (response.status === 403) {
            throw new Error('Acceso denegado. Token inválido o expirado.');
        }
        if (!response.ok) throw new Error('Error al obtener el mapa de andenes');
        return await response.json();
    } catch (error) {
        console.error('error al obtener mapa:', error);
        throw error;
    }
};

export const obtenerEstadisticas = async () => {
    try {
        const response = await fetch(`${DASHBOARD_BASE_URL}/estadisticas`, {
            method: 'GET',
            credentials: 'include'
        });
        if (response.status === 403) {
            throw new Error('Acceso denegado. Token inválido o expirado.');
        }
        if (!response.ok) throw new Error('Error al obtener las estadisticas');
        return await response.json();
    } catch (error) {
        console.error('error al obtener estadisticas:', error);
        throw error;
    }
};

export const obtenerDocumentosPendientes = async () => {
    try {
        const response = await fetch(`${DASHBOARD_BASE_URL}/documentos/pendientes`, {
            method: 'GET',
            credentials: 'include'
        });
        if (response.status === 403) {
            throw new Error('Acceso denegado. Token inválido o expirado.');
        }
        if (!response.ok) throw new Error('Error al obtener documentos');
        return await response.json();
    } catch (error) {
        console.error('error al obtener documentos:', error);
        throw error;
    }
};

export const revisarDocumento = async (idContenedor, estado) => {
    try {
        const response = await fetch(`${DASHBOARD_BASE_URL}/documentos/${idContenedor}/revisar?estado=${estado}`, {
            method: 'POST',
            credentials: 'include'
        });
        if (response.status === 403) {
            throw new Error('Acceso denegado. Token inválido o expirado.');
        }
        if (!response.ok) throw new Error('Error al revisar documento');
        return await response.text();
    } catch (error) {
        console.error('error al revisar documento:', error);
        throw error;
    }
};
