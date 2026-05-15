const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8085';

export const loginUsuario = async (email, password) => { 
    try { 
        const response = await fetch(`${AUTH_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error en la autenticación');
        }

        return await response.json();
    } catch (error) { 
        console.error('Error al conectar con el servicio de usuarios:', error);
        throw error;
    }
};
