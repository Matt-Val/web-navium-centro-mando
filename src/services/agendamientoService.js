const AGENDAMIENTO_API_URL = import.meta.env.VITE_AGENDAMIENTO_API_URL || 'http://localhost:8084';

export const crearAgendamiento = async (agendamiento, token) => { 
    try { 
        const response = await fetch(`${AGENDAMIENTO_API_URL}/api/agendamientos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(agendamiento)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.mensaje || errorData.error || 'Error al crear el agendamiento');
        }

        return await response.json();
    } catch (error) { 
        console.error('Error al conectar con el servicio de agendamiento:', error);
        throw error;
    }
};
