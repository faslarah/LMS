import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/register/', formData);
      login(res.data);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      const msg = data ? Object.values(data).flat().join(' ') : 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', background: 'radial-gradient(circle at 50% 50%, rgba(184, 255, 59, 0.05) 0%, transparent 60%)', padding: '40px 20px' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '40px', border: '1px solid rgba(184, 255, 59, 0.15)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '32px', fontWeight: '700' }}>Create Account</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>Join <span style={{ color: 'var(--accent)' }}>SkillHub</span> and start learning today</p>
        
        {error && <div style={{ backgroundColor: 'rgba(255, 71, 87, 0.1)', color: '#ff4757', padding: '12px', borderRadius: '8px', marginBottom: '24px', border: '1px solid rgba(255, 71, 87, 0.2)', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
               <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>First Name</label>
               <input className="input-field" name="first_name" placeholder="First Name" onChange={handleChange} required />
            </div>
            <div>
               <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Last Name</label>
               <input className="input-field" name="last_name" placeholder="Last Name" onChange={handleChange} required />
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>
             <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Email Address</label>
             <input className="input-field" name="email" type="email" placeholder="Enter your email" onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: '20px' }}>
             <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Password</label>
             <input className="input-field" name="password" type="password" placeholder="Create a password" onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: '32px' }}>
             <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Confirm Password</label>
             <input className="input-field" name="password2" type="password" placeholder="Confirm your password" onChange={handleChange} required />
          </div>
          <button className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px' }} type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Join SkillHub'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'none' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;