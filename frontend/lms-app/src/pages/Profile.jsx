import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Instructor Application State
  const [appStatus, setAppStatus] = useState(null);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      });
      fetchApplicationStatus();
    }
  }, [user]);

  const fetchApplicationStatus = async () => {
    try {
      const res = await API.get('/auth/applications/');
      setAppStatus(res.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Failed to load application status.');
      }
    } finally {
      setAppLoading(false);
    }
  };

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

  const renderInstructorProgram = () => {
    if (appLoading) {
      return <div style={{ color: 'var(--text-secondary)' }}>Loading program status...</div>;
    }

    if (!appStatus) {
      return (
        <div style={{ padding: '24px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '8px' }}>Current Role: {user?.role || 'Student'}</div>
              <h3 style={{ fontSize: '20px', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Want to teach on SkillHub?</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px' }}>
                Share your expertise with thousands of learners and create professional courses.
              </p>
            </div>
            <Link to="/apply-instructor" className="btn-primary" style={{ padding: '10px 20px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Apply as Instructor
            </Link>
          </div>
        </div>
      );
    }

    if (appStatus.status === 'pending') {
      return (
        <div style={{ padding: '24px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '20px', margin: 0, color: 'var(--text-primary)' }}>Instructor Application</h3>
                <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#EAB308' }}>
                  Pending Review
                </span>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
                Submitted: {new Date(appStatus.created_at || appStatus.submitted_at).toLocaleDateString()}
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', lineHeight: '1.5' }}>
                Our team is reviewing your application. Review typically takes 1–3 business days.
              </p>
            </div>
            <Link to="/apply-instructor" className="btn-secondary" style={{ padding: '8px 16px', textDecoration: 'none' }}>
              View Application
            </Link>
          </div>
        </div>
      );
    }

    if (appStatus.status === 'approved') {
      return (
        <div style={{ padding: '24px', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '20px', margin: 0, color: '#10B981' }}>Approved Instructor</h3>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
                Congratulations! You can now create and publish courses.
              </p>
            </div>
            <Link to="/courses/create" className="btn-primary" style={{ padding: '10px 20px', textDecoration: 'none', backgroundColor: '#10B981', color: '#fff', border: 'none' }}>
              Go to Instructor Dashboard
            </Link>
          </div>
        </div>
      );
    }

    if (appStatus.status === 'rejected') {
      return (
        <div style={{ padding: '24px', backgroundColor: 'rgba(255, 71, 87, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 71, 87, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '20px', margin: 0, color: '#ff4757' }}>Instructor Status: Rejected</h3>
              </div>
              <p style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px' }}>
                Unfortunately, your application was not approved. {appStatus.admin_feedback && <span>Reason: {appStatus.admin_feedback}</span>}
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link to="/apply-instructor" className="btn-secondary" style={{ padding: '8px 16px', textDecoration: 'none' }}>
                  Edit Application
                </Link>
                <button onClick={() => window.location.href='/apply-instructor'} className="btn-primary" style={{ padding: '8px 16px' }}>
                  Reapply
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '40px', fontWeight: 'bold' }}>Account Settings</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* Personal Information Section */}
        <section>
          <h2 style={{ fontSize: '20px', marginBottom: '24px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Personal Information
          </h2>
          <form onSubmit={handleSubmit} className="glass-card animate-fade-in" style={{ padding: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold' }}>
                {user?.first_name?.[0] || 'U'}
              </div>
              <div>
                <button type="button" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>Change Avatar</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>First Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Last Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '32px' }}>
              <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Email Address</label>
              <input
                type="email"
                className="input-field"
                value={user?.email || ''}
                disabled
                style={{ opacity: 0.5, cursor: 'not-allowed', backgroundColor: 'rgba(255,255,255,0.01)' }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>Email address cannot be changed.</span>
            </div>
            
            {message && (
              <div style={{ marginBottom: '24px', padding: '12px', borderRadius: '8px', backgroundColor: message.includes('success') ? 'rgba(184, 255, 59, 0.1)' : 'rgba(255, 71, 87, 0.1)', color: message.includes('success') ? 'var(--accent)' : '#ff4757', border: `1px solid ${message.includes('success') ? 'rgba(184, 255, 59, 0.3)' : 'rgba(255, 71, 87, 0.3)'}`, fontSize: '14px', fontWeight: '500' }}>
                {message}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }} disabled={loading}>
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>
        </section>

        {/* Account Security Section */}
        <section>
          <h2 style={{ fontSize: '20px', marginBottom: '24px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Account Security
          </h2>
          <div className="glass-card" style={{ padding: '24px 32px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Password</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Ensure your account is using a long, random password to stay secure.</p>
            </div>
            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>Change Password</button>
          </div>
        </section>

        {/* Instructor Program Section */}
        <section>
          <h2 style={{ fontSize: '20px', marginBottom: '24px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
            Instructor Program
          </h2>
          {renderInstructorProgram()}
        </section>

      </div>
    </div>
  );
};

export default Profile;
