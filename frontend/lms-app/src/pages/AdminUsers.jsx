import React, { useState, useEffect } from 'react';
import { getUsers, updateUserRole, updateUserStatus } from '../api/admin';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await getUsers({ search, role: roleFilter });
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search, roleFilter]);

    const handleRoleChange = async (id, newRole) => {
        try {
            await updateUserRole(id, newRole);
            fetchUsers();
        } catch (error) {
            console.error('Failed to update role', error);
            alert('Failed to update user role.');
        }
    };

    const handleStatusChange = async (id, isActive) => {
        try {
            await updateUserStatus(id, isActive);
            fetchUsers();
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update user status.');
        }
    };

    const tabs = [
        { label: 'All Users', value: '' },
        { label: 'Students', value: 'student' },
        { label: 'Instructors', value: 'instructor' },
        { label: 'Admins', value: 'admin' },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: '24px' }}>User Management</h1>

            <div className="card" style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Search by name or email..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: 1 }}
                />
                
                <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-tertiary)', padding: '6px', borderRadius: 'var(--radius-sm)' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => setRoleFilter(tab.value)}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '4px',
                                background: roleFilter === tab.value ? 'var(--accent)' : 'transparent',
                                color: roleFilter === tab.value ? '#000' : 'var(--text-secondary)',
                                fontWeight: roleFilter === tab.value ? '600' : '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading users...</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>User</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Role</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Status</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Joined</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 'bold', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--accent)' }}>
                                                    {u.first_name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '500' }}>{u.full_name}</div>
                                                    <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ 
                                                padding: '4px 12px', 
                                                borderRadius: '16px', 
                                                fontSize: '12px', 
                                                fontWeight: 'bold',
                                                textTransform: 'capitalize',
                                                backgroundColor: u.role === 'admin' ? '#9333EA' : u.role === 'instructor' ? 'var(--accent)' : 'var(--bg-tertiary)',
                                                color: u.role === 'instructor' ? '#000' : '#fff'
                                            }}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ 
                                                padding: '4px 12px', 
                                                borderRadius: '16px', 
                                                fontSize: '12px', 
                                                fontWeight: 'bold',
                                                backgroundColor: u.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: u.is_active ? '#10B981' : '#EF4444'
                                            }}>
                                                {u.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>
                                            {new Date(u.date_joined).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                            {u.role !== 'admin' && (
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    {u.role === 'student' ? (
                                                        <button 
                                                            className="btn-secondary" 
                                                            style={{ padding: '6px 12px', fontSize: '12px' }}
                                                            onClick={() => handleRoleChange(u.id, 'instructor')}
                                                        >
                                                            Make Instructor
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            className="btn-secondary" 
                                                            style={{ padding: '6px 12px', fontSize: '12px' }}
                                                            onClick={() => handleRoleChange(u.id, 'student')}
                                                        >
                                                            Make Student
                                                        </button>
                                                    )}
                                                    
                                                    {u.is_active ? (
                                                        <button 
                                                            className="btn-secondary" 
                                                            style={{ padding: '6px 12px', fontSize: '12px', color: '#EF4444', borderColor: '#EF4444' }}
                                                            onClick={() => handleStatusChange(u.id, false)}
                                                        >
                                                            Deactivate
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            className="btn-secondary" 
                                                            style={{ padding: '6px 12px', fontSize: '12px', color: '#10B981', borderColor: '#10B981' }}
                                                            onClick={() => handleStatusChange(u.id, true)}
                                                        >
                                                            Activate
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            No users found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
