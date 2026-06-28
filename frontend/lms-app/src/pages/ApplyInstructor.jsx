import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ApplyInstructor = () => {
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    bio: '',
    experience: '',
    qualification: '',
    expertise: '',
    linkedin: '',
    portfolio: ''
  });

  useEffect(() => {
    fetchApplicationStatus();
  }, []);

  const fetchApplicationStatus = async () => {
    try {
      const res = await API.get('/auth/applications/');
      setApplication(res.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to load application status.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const res = await API.post('/auth/applications/', formData);
      setApplication(res.data);
    } catch (err) {
      const data = err.response?.data;
      const msg = data ? Object.values(data).flat().join(' ') : 'Application failed';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>;
  }

  // If approved, they shouldn't really be here, but just in case
  if (application?.status === 'approved') {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div className="glass-card animate-fade-in" style={{ padding: '60px 40px', border: '1px solid rgba(184, 255, 59, 0.3)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(184, 255, 59, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h1 style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--accent)' }}>Congratulations!</h1>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px' }}>Your instructor application has been approved. You can now access the Instructor Dashboard.</p>
          <Link to="/dashboard" className="btn-primary" style={{ padding: '12px 32px', textDecoration: 'none' }}>Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (application?.status === 'pending') {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div className="glass-card animate-fade-in" style={{ padding: '60px 40px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Application Under Review</h1>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>We have received your application and our team is currently reviewing it. We will notify you once a decision has been made.</p>
        </div>
      </div>
    );
  }

  if (application?.status === 'rejected') {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div className="glass-card animate-fade-in" style={{ padding: '60px 40px', border: '1px solid rgba(255, 71, 87, 0.3)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255, 71, 87, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff4757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          </div>
          <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#ff4757' }}>Application Not Approved</h1>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px' }}>Unfortunately, we could not approve your application at this time. Please continue to build your portfolio and feel free to apply again in the future.</p>
          <button onClick={() => setApplication(null)} className="btn-primary" style={{ padding: '12px 32px' }}>Resubmit Application</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>Become an Instructor</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '16px' }}>Share your knowledge with millions of students across the globe.</p>
      
      <div className="glass-card animate-fade-in" style={{ padding: '40px', border: '1px solid rgba(184, 255, 59, 0.15)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        {error && <div style={{ backgroundColor: 'rgba(255, 71, 87, 0.1)', color: '#ff4757', padding: '12px', borderRadius: '8px', marginBottom: '24px', border: '1px solid rgba(255, 71, 87, 0.2)', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>Professional Information</h3>
          
          <div style={{ marginBottom: '24px' }}>
            <label className="label">Short Bio</label>
            <textarea 
              className="input-field" 
              name="bio" 
              rows="3" 
              placeholder="Tell us a bit about yourself..." 
              value={formData.bio} 
              onChange={handleChange} 
              required
            ></textarea>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="label">Teaching Experience</label>
            <textarea 
              className="input-field" 
              name="experience" 
              rows="3" 
              placeholder="Detail your previous teaching or mentoring experience" 
              value={formData.experience} 
              onChange={handleChange} 
              required
            ></textarea>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="label">Qualifications</label>
            <textarea 
              className="input-field" 
              name="qualification" 
              rows="2" 
              placeholder="Degrees, certifications, or notable achievements" 
              value={formData.qualification} 
              onChange={handleChange} 
              required
            ></textarea>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label className="label">Area of Expertise</label>
            <input 
              type="text" 
              className="input-field" 
              name="expertise" 
              placeholder="e.g. Web Development, Data Science, Graphic Design" 
              value={formData.expertise} 
              onChange={handleChange} 
              required
            />
          </div>

          <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>Links & Portfolio</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
            <div>
              <label className="label">LinkedIn URL (Optional)</label>
              <input 
                type="url" 
                className="input-field" 
                name="linkedin" 
                placeholder="https://linkedin.com/in/..." 
                value={formData.linkedin} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <label className="label">Portfolio URL (Optional)</label>
              <input 
                type="url" 
                className="input-field" 
                name="portfolio" 
                placeholder="https://yourwebsite.com" 
                value={formData.portfolio} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ padding: '14px 40px', fontSize: '16px' }} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyInstructor;
