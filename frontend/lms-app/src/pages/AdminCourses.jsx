import React, { useState, useEffect } from 'react';
import { getAdminCourses, toggleCoursePublish, deleteCourse } from '../api/admin';
import AdminCategories from './AdminCategories';

const AdminCourses = () => {
    const [activeTab, setActiveTab] = useState('courses');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await getAdminCourses();
            setCourses(data);
        } catch (error) {
            console.error('Failed to load courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePublish = async (id) => {
        try {
            const { data } = await toggleCoursePublish(id);
            setCourses(courses.map(c => c.id === id ? { ...c, is_published: data.is_published } : c));
        } catch (error) {
            console.error('Failed to toggle publish status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to completely delete this course? This cannot be undone.')) {
            try {
                await deleteCourse(id);
                setCourses(courses.filter(c => c.id !== id));
            } catch (error) {
                console.error('Failed to delete course');
            }
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '24px' }}>Course Management</h1>
            
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
                {['courses', 'categories', 'pending', 'reports'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '12px 24px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: activeTab === tab ? 'var(--accent)' : 'var(--text-secondary)',
                            borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
                            textTransform: 'capitalize',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab === 'pending' ? 'Pending Approvals' : tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'courses' && (
                <div className="card animate-fade-in" style={{ padding: 0, overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading courses...</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
                                        <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Course Title</th>
                                        <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Instructor</th>
                                        <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Price</th>
                                        <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Status</th>
                                        <th style={{ padding: '16px 24px', fontWeight: 'bold', textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map(course => (
                                        <tr key={course.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ fontWeight: '500' }}>{course.title}</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{course.category_name}</div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>{course.instructor_name || 'Unknown'}</td>
                                            <td style={{ padding: '16px 24px', fontWeight: '500' }}>${course.price}</td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{ 
                                                    padding: '4px 12px', 
                                                    borderRadius: '16px', 
                                                    fontSize: '12px', 
                                                    fontWeight: 'bold',
                                                    backgroundColor: course.is_published ? 'rgba(16, 185, 129, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                                                    color: course.is_published ? '#10B981' : '#EAB308'
                                                }}>
                                                    {course.is_published ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    <button 
                                                        className="btn-secondary"
                                                        onClick={() => handleTogglePublish(course.id)}
                                                        style={{ padding: '6px 12px', fontSize: '12px' }}
                                                    >
                                                        {course.is_published ? 'Unpublish' : 'Publish'}
                                                    </button>
                                                    <button 
                                                        className="btn-secondary"
                                                        onClick={() => handleDelete(course.id)}
                                                        style={{ padding: '6px 12px', fontSize: '12px', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {courses.length === 0 && (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>No courses found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'categories' && (
                <div className="animate-fade-in">
                    <AdminCategories isIntegrated={true} />
                </div>
            )}

            {activeTab === 'pending' && (
                <div className="card animate-fade-in" style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)', marginBottom: '16px', opacity: 0.5 }}>
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/>
                    </svg>
                    <h3 style={{ marginBottom: '8px' }}>No Pending Approvals</h3>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
                        When instructors submit courses for review, they will appear here for admin approval before going live on the platform.
                    </p>
                </div>
            )}

            {activeTab === 'reports' && (
                <div className="card animate-fade-in" style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)', marginBottom: '16px', opacity: 0.5 }}>
                        <line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>
                    </svg>
                    <h3 style={{ marginBottom: '8px' }}>Course Performance Reports</h3>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
                        Analytics and reporting for course performance, revenue, and enrollments are being processed and will be available soon.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AdminCourses;
