import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory } from '../api/admin';

const IconEdit = ({ size = 16, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
);

const AdminCategories = ({ isIntegrated = false }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategorySlug, setNewCategorySlug] = useState('');
    const [isSlugManual, setIsSlugManual] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (text) => {
        return text.toLowerCase()
           .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphen
           .replace(/(^-|-$)+/g, ''); // Remove leading/trailing hyphens
    };

    const handleNameChange = (e) => {
        const val = e.target.value;
        setNewCategoryName(val);
        if (!isSlugManual) {
            setNewCategorySlug(generateSlug(val));
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setErrorMsg(null);
        try {
            const { data } = await createCategory({ name: newCategoryName, slug: newCategorySlug });
            setCategories([...categories, data]);
            setNewCategoryName('');
            setNewCategorySlug('');
            setIsSlugManual(false);
        } catch (error) {
            if (error.response?.data?.slug) {
                setErrorMsg(error.response.data.slug[0] || 'Category with this slug already exists.');
            } else {
                setErrorMsg('Failed to create category. Ensure name and slug are unique.');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category? Courses under this category may be affected.')) {
            try {
                await deleteCategory(id);
                setCategories(categories.filter(c => c.id !== id));
            } catch (error) {
                console.error('Failed to delete category');
            }
        }
    };

    if (loading) return <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading categories...</div>;

    return (
        <div>
            {!isIntegrated && <h1 style={{ marginBottom: '24px' }}>Manage Categories</h1>}

            <div className="card" style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Add New Category</h2>
                {errorMsg && (
                    <div className="error-msg" style={{ marginBottom: '16px' }}>
                        {errorMsg}
                    </div>
                )}
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label className="label">Category Name</label>
                        <input 
                            type="text"
                            placeholder="e.g., Web Development"
                            required
                            value={newCategoryName}
                            onChange={handleNameChange}
                            className="input-field"
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <label className="label">URL Slug</label>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: isSlugManual ? 'var(--bg-primary)' : 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                            <input 
                                type="text"
                                placeholder="e.g., web-development"
                                required
                                readOnly={!isSlugManual}
                                value={newCategorySlug}
                                onChange={(e) => setNewCategorySlug(e.target.value)}
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    color: isSlugManual ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    padding: '12px',
                                    fontSize: '15px',
                                    fontFamily: 'var(--font-main)',
                                    outline: 'none'
                                }}
                            />
                            <button 
                                type="button" 
                                onClick={() => setIsSlugManual(!isSlugManual)}
                                title={isSlugManual ? "Lock Slug" : "Edit Slug manually"}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: isSlugManual ? 'var(--accent)' : 'var(--text-secondary)',
                                    padding: '0 12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <IconEdit />
                            </button>
                        </div>
                    </div>
                    <div style={{ alignSelf: 'flex-end', paddingBottom: '1px' }}>
                        <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap', height: '44px' }}>
                            Add Category
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>ID</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Name</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Slug</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(category => (
                                <tr key={category.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '16px 24px' }}>{category.id}</td>
                                    <td style={{ padding: '16px 24px', fontWeight: '500' }}>{category.name}</td>
                                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{category.slug}</td>
                                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                        <button 
                                            className="btn-secondary"
                                            onClick={() => handleDelete(category.id)}
                                            style={{ padding: '6px 12px', fontSize: '12px', color: '#EF4444', borderColor: '#EF4444' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>No categories found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCategories;
