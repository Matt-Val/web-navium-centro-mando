
export const loginUsuario = async (email, password) => { 
    try { 
        const response = await fetch(`/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email: email, password: password })
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

export const logoutUsuario = async () => {
    try {
        const response = await fetch(`/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        return await response.json();
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        throw error;
    }
};
