import React, { useState, useEffect } from 'react';
import { getUsers, updateUserStatus } from '../api/admin';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null); // { user, action }
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch users (with search and filters)
    const fetchUsers = async (searchQuery, role, status) => {
        setLoading(true);
        try {
            // Mapping UI status to backend query parameters
            let isActive = undefined;
            let isSuspended = undefined;
            
            if (status === 'active') {
                isActive = true;
                isSuspended = false;
            } else if (status === 'inactive') {
                isActive = false;
                isSuspended = false;
            } else if (status === 'suspended') {
                isActive = false;
                isSuspended = true;
            }
            
            const params = {
                search: searchQuery,
                role: role || undefined,
            };
            if (isActive !== undefined) params.is_active = isActive;
            if (isSuspended !== undefined) params.is_suspended = isSuspended;

            const res = await getUsers(params);
            setUsers(res.data.results || res.data); // Handle paginated or non-paginated gracefully for now
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers(search, roleFilter, statusFilter);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [search, roleFilter, statusFilter]);

    const handleStatusAction = async () => {
        if (!confirmAction) return;
        setActionLoading(true);
        try {
            await updateUserStatus(confirmAction.user.id, confirmAction.action);
            fetchUsers(search, roleFilter, statusFilter); // Refresh list
            
            // Update selected user in modal if open
            if (selectedUser && selectedUser.id === confirmAction.user.id) {
                const is_active = confirmAction.action === 'activate';
                const is_suspended = confirmAction.action === 'suspend';
                setSelectedUser({ ...selectedUser, is_active, is_suspended });
            }
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update user status.');
        } finally {
            setActionLoading(false);
            setConfirmAction(null);
        }
    };

    const getRoleBadge = (role) => {
        if (role === 'admin') return <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(147, 51, 234, 0.1)', color: '#A855F7', textTransform: 'capitalize' }}>Admin</span>;
        if (role === 'instructor') return <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(184, 255, 59, 0.1)', color: 'var(--accent)', textTransform: 'capitalize' }}>Instructor</span>;
        return <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60A5FA', textTransform: 'capitalize' }}>Student</span>;
    };

    const getStatusBadge = (user) => {
        if (user.is_suspended) return <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#F97316' }}>Suspended</span>;
        if (user.is_active) return <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>Active</span>;
        return <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>Inactive</span>;
    };

    return (
        <div>
            <h1 style={{ marginBottom: '24px' }}>User Management</h1>

            <div className="card" style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Search by name or email..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: '1 1 200px' }}
                />
                
                <select 
                    className="input-field" 
                    value={roleFilter} 
                    onChange={(e) => setRoleFilter(e.target.value)}
                    style={{ width: '150px' }}
                >
                    <option value="">All Roles</option>
                    <option value="student">Students</option>
                    <option value="instructor">Instructors</option>
                    <option value="admin">Admins</option>
                </select>

                <select 
                    className="input-field" 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ width: '150px' }}
                >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                </select>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '64px 32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(184, 255, 59, 0.2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
                        Loading users...
                    </div>
                ) : users.length === 0 ? (
                    <div style={{ padding: '64px 32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 16px', opacity: 0.5 }}>
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        <p>No users found matching your filters.</p>
                    </div>
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
                                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                                                    {u.first_name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{u.full_name}</div>
                                                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>{getRoleBadge(u.role)}</td>
                                        <td style={{ padding: '16px 24px' }}>{getStatusBadge(u)}</td>
                                        <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                            {new Date(u.date_joined).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                            <button 
                                                className="btn-secondary" 
                                                style={{ padding: '6px 16px', fontSize: '13px' }}
                                                onClick={() => setSelectedUser(u)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="glass-card animate-fade-in" style={{
                        width: '100%', maxWidth: '500px', padding: '32px', position: 'relative'
                    }}>
                        <button 
                            onClick={() => setSelectedUser(null)}
                            style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '24px' }}
                        >
                            &times;
                        </button>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                                {selectedUser.first_name?.[0] || 'U'}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '24px', margin: '0 0 4px 0' }}>{selectedUser.full_name}</h2>
                                <div style={{ color: 'var(--text-secondary)' }}>{selectedUser.email}</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Role</div>
                                <div>{getRoleBadge(selectedUser.role)}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Status</div>
                                <div>{getStatusBadge(selectedUser)}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Joined Date</div>
                                <div style={{ fontWeight: '500' }}>{new Date(selectedUser.date_joined).toLocaleDateString()}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Enrolled Courses</div>
                                <div style={{ fontWeight: '500' }}>{selectedUser.enrolled_courses_count || 0}</div>
                            </div>
                            
                            {selectedUser.role === 'instructor' && (
                                <div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Created Courses</div>
                                    <div style={{ fontWeight: '500' }}>{selectedUser.created_courses_count || 0}</div>
                                </div>
                            )}

                            {selectedUser.role === 'student' && selectedUser.application_status && (
                                <div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Application Status</div>
                                    <div style={{ fontWeight: '500', textTransform: 'capitalize' }}>
                                        {selectedUser.application_status === 'pending' ? <span style={{color: '#EAB308'}}>Pending</span> : selectedUser.application_status === 'rejected' ? <span style={{color: '#EF4444'}}>Rejected</span> : selectedUser.application_status}
                                    </div>
                                </div>
                            )}
                        </div>

                        {selectedUser.role !== 'admin' && (
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {!selectedUser.is_active && !selectedUser.is_suspended && (
                                    <button 
                                        className="btn-primary" 
                                        style={{ flex: 1, backgroundColor: '#10B981', borderColor: '#10B981', color: '#000' }}
                                        onClick={() => setConfirmAction({ user: selectedUser, action: 'activate' })}
                                    >
                                        Activate Account
                                    </button>
                                )}
                                
                                {selectedUser.is_active && (
                                    <button 
                                        className="btn-secondary" 
                                        style={{ flex: 1 }}
                                        onClick={() => setConfirmAction({ user: selectedUser, action: 'deactivate' })}
                                    >
                                        Deactivate Account
                                    </button>
                                )}
                                
                                {!selectedUser.is_suspended && (
                                    <button 
                                        className="btn-secondary" 
                                        style={{ flex: 1, color: '#F97316', borderColor: 'rgba(249, 115, 22, 0.3)' }}
                                        onClick={() => setConfirmAction({ user: selectedUser, action: 'suspend' })}
                                    >
                                        Suspend User
                                    </button>
                                )}

                                {selectedUser.is_suspended && (
                                    <button 
                                        className="btn-primary" 
                                        style={{ flex: 1, backgroundColor: '#10B981', borderColor: '#10B981', color: '#000' }}
                                        onClick={() => setConfirmAction({ user: selectedUser, action: 'activate' })}
                                    >
                                        Remove Suspension
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmAction && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
                }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '32px', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>Confirm Action</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                            Are you sure you want to <strong>{confirmAction.action}</strong> the user account for <strong>{confirmAction.user.email}</strong>?
                        </p>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button 
                                className="btn-secondary" 
                                style={{ flex: 1 }} 
                                onClick={() => setConfirmAction(null)}
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn-primary" 
                                style={{ 
                                    flex: 1, 
                                    backgroundColor: confirmAction.action === 'activate' ? '#10B981' : (confirmAction.action === 'suspend' ? '#F97316' : '#EF4444'),
                                    borderColor: confirmAction.action === 'activate' ? '#10B981' : (confirmAction.action === 'suspend' ? '#F97316' : '#EF4444'),
                                    color: (confirmAction.action === 'activate' || confirmAction.action === 'suspend') ? '#000' : '#fff'
                                }} 
                                onClick={handleStatusAction}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default AdminUsers;
