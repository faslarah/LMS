import React, { useState, useEffect } from 'react';
import { getAdminStats } from '../api/admin';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await getAdminStats();
            setStats(data);
        } catch (err) {
            setError('Failed to load dashboard statistics.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading dashboard...</div>;
    if (error) return <div className="error-msg" style={{ margin: '32px' }}>{error}</div>;
    if (!stats) return null;

    const kpiStyle = {
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
    };

    return (
        <div>
            <h1 style={{ marginBottom: '24px' }}>Platform Overview</h1>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div className="card" style={kpiStyle}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Total Users</span>
                    <span style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: 'var(--text-primary)' }}>{stats.total_users}</span>
                    <div style={{ marginTop: '16px', display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <span>Students: {stats.total_students}</span>
                        <span>Instructors: {stats.total_instructors}</span>
                    </div>
                </div>

                <div className="card" style={kpiStyle}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Total Courses</span>
                    <span style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: 'var(--accent)' }}>{stats.total_courses}</span>
                </div>

                <div className="card" style={kpiStyle}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Total Enrollments</span>
                    <span style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: '#10B981' }}>{stats.total_enrollments}</span>
                </div>

                <div className="card" style={kpiStyle}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Categories</span>
                    <span style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: '#9333EA' }}>{stats.total_categories}</span>
                </div>
            </div>

            {/* Recent Registrations Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-tertiary)' }}>
                    <h2 style={{ fontSize: '18px' }}>Recent Registrations</h2>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>User</th>
                                <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Role</th>
                                <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recent_registrations.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontWeight: '500' }}>{user.first_name} {user.last_name}</div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>{user.email}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '16px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            textTransform: 'capitalize',
                                            backgroundColor: user.role === 'admin' ? '#9333EA' : user.role === 'instructor' ? 'var(--accent)' : 'var(--bg-tertiary)',
                                            color: user.role === 'instructor' ? '#000' : '#fff'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>
                                        {new Date(user.date_joined).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {stats.recent_registrations.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>No recent registrations</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
