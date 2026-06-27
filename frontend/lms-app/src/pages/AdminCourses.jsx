import React, { useState, useEffect } from 'react';
import { getAdminCourses, toggleCoursePublish, deleteCourse } from '../api/admin';

const AdminCourses = () => {
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

    if (loading) return <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading courses...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '24px' }}>Manage Courses</h1>
            
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
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
                                <tr key={course.id} style={{ borderBottom: '1px solid var(--border)' }}>
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
                                                style={{ padding: '6px 12px', fontSize: '12px', color: '#EF4444', borderColor: '#EF4444' }}
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
            </div>
        </div>
    );
};

export default AdminCourses;
