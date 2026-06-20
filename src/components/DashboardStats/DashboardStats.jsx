import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { obtenerEstadisticas } from '../../services/bffService';
import { useDashboardRefresh } from '../../context/DashboardRefreshContext';
import { Spinner } from 'navium-ui-lib';
import './DashboardStats.css';

const DashboardStats = () => {
    const { refreshKey } = useDashboardRefresh();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await obtenerEstadisticas();
                setStats(data);
                setError(null);
            } catch (error) {
                console.error("Error stats:", error);
                setError('Error al cargar estadísticas');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [refreshKey]);

    if (loading) return <div className="stats-loading"><Spinner size="lg" color="primary" message="Generando métricas..." /></div>;

    if (error) return <div className="stats-loading" style={{color: '#ef4444'}}>{error}</div>;

    if (!stats) return null;

    const dataEstado = Object.entries(stats?.distribucionPorEstado || {}).map(([name, value]) => ({ name, value }));
    const dataTipo = Object.entries(stats?.operacionesPorTipo || {}).map(([name, value]) => ({ name, value }));

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="stats-container">
            <div className="stats-grid">
                <div className="chart-box">
                    <h4>Distribución por Estado</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={dataEstado}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {dataEstado.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-box">
                    <h4>Operaciones por Tipo</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={dataTipo}>
                            <XAxis dataKey="name" fontSize={12} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;