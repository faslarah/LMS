import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await API.put('/auth/profile/', formData);
      setMessage('Profile updated successfully! Refreshing...');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setMessage('Failed to update profile.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '60px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '32px' }}>Edit Profile</h1>
      <form onSubmit={handleSubmit} className="card" style={{ padding: '32px' }}>
        <div style={{ marginBottom: '24px' }}>
          <label className="label">First Name</label>
          <input
            type="text"
            className="input-field"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            required
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label className="label">Last Name</label>
          <input
            type="text"
            className="input-field"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            required
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label className="label">Email (Read Only)</label>
          <input
            type="email"
            className="input-field"
            value={user?.email || ''}
            disabled
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
          />
        </div>
        
        {message && (
          <div style={{ marginBottom: '20px', padding: '12px', borderRadius: '4px', backgroundColor: message.includes('success') ? 'rgba(198, 241, 44, 0.1)' : 'rgba(255, 71, 87, 0.1)', color: message.includes('success') ? 'var(--accent)' : '#ff4757', border: `1px solid ${message.includes('success') ? 'var(--accent)' : '#ff4757'}` }}>
            {message}
          </div>
        )}

        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
