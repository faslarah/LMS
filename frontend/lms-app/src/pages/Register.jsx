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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Create Account</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
               <label className="label">First Name</label>
               <input className="input-field" name="first_name" placeholder="First Name" onChange={handleChange} required />
            </div>
            <div>
               <label className="label">Last Name</label>
               <input className="input-field" name="last_name" placeholder="Last Name" onChange={handleChange} required />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
             <label className="label">Email Address</label>
             <input className="input-field" name="email" type="email" placeholder="Enter your email" onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: '16px' }}>
             <label className="label">Password</label>
             <input className="input-field" name="password" type="password" placeholder="Create a password" onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: '24px' }}>
             <label className="label">Confirm Password</label>
             <input className="input-field" name="password2" type="password" placeholder="Confirm your password" onChange={handleChange} required />
          </div>
          <button className="btn-primary" style={{ width: '100%' }} type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Join Platform'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '500' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;