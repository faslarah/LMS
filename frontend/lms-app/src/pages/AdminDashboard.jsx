import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStats, updateInstructorApplicationStatus } from '../api/admin';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    const handleQuickApprove = async (id) => {
        try {
            await updateInstructorApplicationStatus(id, 'approved');
            // Refresh stats to get the new list and counts
            fetchStats();
        } catch (err) {
            console.error('Failed to approve application', err);
            alert('Failed to approve application');
        }
    };

    if (loading) return <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(184, 255, 59, 0.2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
        Loading Control Center...
    </div>;
    
    if (error) return <div className="error-msg" style={{ margin: '32px' }}>{error}</div>;
    if (!stats) return null;

    const kpiStyle = {
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ margin: 0 }}>Control Center</h1>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    System Status: <span style={{ color: '#10B981', fontWeight: 'bold' }}>All Systems Operational</span>
                </div>
            </div>

            {/* 1. Statistics Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Users</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total_users}</div>
                    </div>
                </div>

                <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(184, 255, 59, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Students</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total_students}</div>
                    </div>
                </div>
                
                <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Instructors</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total_instructors}</div>
                    </div>
                </div>

                <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Courses</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total_courses}</div>
                    </div>
                </div>
                
                <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(147, 51, 234, 0.1)', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Categories</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total_categories}</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                
                {/* 2. Instructor Applications */}
                <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-tertiary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                            Instructor Applications
                        </h2>
                        <button className="btn-secondary" onClick={() => navigate('/admin/applications')} style={{ padding: '6px 12px', fontSize: '12px' }}>View All</button>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', gap: '16px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ flex: 1, textAlign: 'center', padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#EAB308' }}>{stats.pending_applications}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '4px' }}>Pending</div>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center', padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981' }}>{stats.approved_applications}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '4px' }}>Approved</div>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center', padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#EF4444' }}>{stats.rejected_applications}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '4px' }}>Rejected</div>
                        </div>
                    </div>
                    <div style={{ padding: '24px', flex: 1 }}>
                        <h3 style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Requires Attention (Top 3)</h3>
                        {stats.recent_pending_applications?.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {stats.recent_pending_applications.map(app => (
                                    <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                        <div>
                                            <div style={{ fontWeight: '500' }}>{app.user_email}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Applied: {new Date(app.created_at).toLocaleDateString()}</div>
                                        </div>
                                        <button 
                                            className="btn-primary" 
                                            onClick={() => handleQuickApprove(app.id)}
                                            style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#10B981', borderColor: '#10B981', color: '#000' }}
                                        >
                                            Quick Approve
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>
                                No pending applications to review.
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Manage Courses */}
                <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-tertiary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                            Manage Courses
                        </h2>
                        <button className="btn-secondary" onClick={() => navigate('/admin/courses')} style={{ padding: '6px 12px', fontSize: '12px' }}>View All</button>
                    </div>
                    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '4px solid #10B981' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.published_courses}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '4px' }}>Published</div>
                        </div>
                        <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '4px solid #F97316' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.draft_courses}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '4px' }}>Drafts</div>
                        </div>
                        <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '4px solid #EAB308' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>0</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '4px' }}>Pending Approval</div>
                        </div>
                        <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '4px solid #9333EA' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total_categories}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '4px' }}>Categories</div>
                        </div>
                    </div>
                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
                        <button className="btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={() => navigate('/admin/courses')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                            Add Category
                        </button>
                        <button className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={() => navigate('/admin/courses')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                            Add Course
                        </button>
                    </div>
                </div>

            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                
                {/* 4. Manage Users */}
                <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-tertiary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            Manage Users
                        </h2>
                        <button className="btn-secondary" onClick={() => navigate('/admin/users')} style={{ padding: '6px 12px', fontSize: '12px' }}>View All</button>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '4px solid #60A5FA' }}>
                            <span style={{ fontWeight: '500' }}>Students</span>
                            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{stats.total_students}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
                            <span style={{ fontWeight: '500' }}>Instructors</span>
                            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{stats.total_instructors}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '4px solid #A855F7' }}>
                            <span style={{ fontWeight: '500' }}>Admins</span>
                            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{stats.total_admins}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '4px solid #EF4444' }}>
                            <span style={{ fontWeight: '500', color: '#EF4444' }}>Suspended Users</span>
                            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#EF4444' }}>{stats.suspended_users}</span>
                        </div>
                    </div>
                </div>

                {/* 5. Settings Summary & 6. Recent Activities Feed */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Settings Summary */}
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-tertiary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                Settings Summary
                            </h2>
                            <button className="btn-secondary" onClick={() => navigate('/admin/settings')} style={{ padding: '6px 12px', fontSize: '12px' }}>Go to Settings</button>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>SMTP / Email</span>
                                <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>Not Configured</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Platform Configuration</span>
                                <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>Active</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Instructor Policy</span>
                                <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60A5FA' }}>Strict Approval</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activities Feed */}
                    <div className="card" style={{ padding: 0, overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-tertiary)' }}>
                            <h2 style={{ fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                                Recent User Registrations
                            </h2>
                        </div>
                        <div style={{ padding: '0', flex: 1 }}>
                            {stats.recent_registrations.map((user, index) => (
                                <div key={user.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px 24px', borderBottom: index < stats.recent_registrations.length - 1 ? '1px solid var(--border)' : 'none', backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-secondary)', flexShrink: 0 }}>
                                        {user.first_name?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '14px' }}>
                                            <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{user.first_name} {user.last_name}</span> registered as <span style={{ textTransform: 'capitalize', color: user.role === 'admin' ? '#A855F7' : user.role === 'instructor' ? 'var(--accent)' : '#60A5FA', fontWeight: '500' }}>{user.role}</span>.
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{new Date(user.date_joined).toLocaleDateString()} at {new Date(user.date_joined).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
            
            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
