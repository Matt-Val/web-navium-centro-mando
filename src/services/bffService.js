

// Se reemplaza la URL con la ruta real más adelante
const API_BASE_URL = 'http://localhost:8080/api/dashboard';

export const obtenerTablero = async (token) => { 
    try { 
        const response = await fetch(`${API_BASE_URL}/operaciones`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Aquí está la magia: enviamos el token al BFF para que nos deje pasar
                'Authorization': `Bearer ${token}` 
            }
    });

    if (!response.ok) { 
        throw new Error('Error HTTP: ${response.status}');
    }

    const data = await response.json();
    return data; // Aquí es donde regresamos los datos reales del backend    
    } catch (error) { 
        console.error('error al conectar con el BFF:', error);
        throw error;
    }
};

