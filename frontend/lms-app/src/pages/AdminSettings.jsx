import React from 'react';

const AdminSettings = () => {
    return (
        <div>
            <h1 style={{ marginBottom: '24px' }}>Platform Settings</h1>

            <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px' }}>General Configuration</h3>
                <div style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
                    <div>
                        <label className="label">Platform Name</label>
                        <input type="text" className="input-field" defaultValue="LMS Pro" />
                    </div>
                    <div>
                        <label className="label">Contact Email</label>
                        <input type="email" className="input-field" defaultValue="support@lmspro.com" />
                    </div>
                    <div>
                        <label className="label">Default Currency</label>
                        <select className="input-field">
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                        </select>
                    </div>
                </div>
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                    <button className="btn-primary">Save Changes</button>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '16px' }}>System Maintenance</h3>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <button className="btn-secondary">Clear Cache</button>
                    <button className="btn-secondary">Rebuild Search Index</button>
                    <button className="btn-secondary" style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>Enable Maintenance Mode</button>
                </div>
                <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Note: Maintenance mode will block all non-admin access to the platform.
                </p>
            </div>
        </div>
    );
};

export default AdminSettings;
