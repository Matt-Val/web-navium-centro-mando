
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';
const DASHBOARD_BASE_URL = `${API_BASE_URL}/api/dashboard`;

export const obtenerTablero = async (token) => { 
    try { 
        const response = await fetch(`${DASHBOARD_BASE_URL}/operaciones`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Aquí está la magia: enviamos el token al BFF para que nos deje pasar
                'Authorization': `Bearer ${token}` 
            }
    });

    if (!response.ok) throw new Error('Error al obtener los datos del tablero');

    return await response.json();
    } catch (error) { 
        console.error('error al conectar con el BFF:', error);
        throw error;
    }
};

