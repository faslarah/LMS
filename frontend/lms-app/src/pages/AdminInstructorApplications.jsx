import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminInstructorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null); // For modal

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get('/auth/admin/applications/');
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.patch(`/auth/admin/applications/${id}/`, { status });
      fetchApplications();
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status });
      }
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'pending') return <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#EAB308', textTransform: 'capitalize' }}>Pending</span>;
    if (status === 'approved') return <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', textTransform: 'capitalize' }}>Approved</span>;
    if (status === 'rejected') return <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', textTransform: 'capitalize' }}>Rejected</span>;
    return status;
  };

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Instructor Applications</h1>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading applications...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Applicant</th>
                  <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Expertise</th>
                  <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Applied Date</th>
                  <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Status</th>
                  <th style={{ padding: '16px 24px', fontWeight: 'bold', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: '500' }}>{app.user_email}</div>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{app.expertise}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      {getStatusBadge(app.status)}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => setSelectedApp(app)}
                        >
                          View Details
                        </button>
                        {app.status === 'pending' && (
                          <>
                            <button 
                              className="btn-primary" 
                              style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#10B981', borderColor: '#10B981', color: '#000' }}
                              onClick={() => handleStatusUpdate(app.id, 'approved')}
                            >
                              Approve
                            </button>
                            <button 
                              className="btn-secondary" 
                              style={{ padding: '6px 12px', fontSize: '12px', color: '#EF4444', borderColor: '#EF4444' }}
                              onClick={() => handleStatusUpdate(app.id, 'rejected')}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedApp && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-card animate-fade-in" style={{
            width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
            padding: '32px', position: 'relative'
          }}>
            <button 
              onClick={() => setSelectedApp(null)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '24px' }}
            >
              &times;
            </button>
            
            <h2 style={{ marginBottom: '8px' }}>Application Details</h2>
            <div style={{ marginBottom: '24px' }}>{getStatusBadge(selectedApp.status)}</div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Applicant</div>
                <div style={{ fontSize: '16px' }}>{selectedApp.user_email}</div>
              </div>
              
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Submitted Date</div>
                <div style={{ fontSize: '16px' }}>{new Date(selectedApp.created_at).toLocaleString()}</div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Bio</div>
                <div style={{ fontSize: '15px', lineHeight: '1.5', backgroundColor: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px' }}>{selectedApp.bio}</div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Teaching Experience</div>
                <div style={{ fontSize: '15px', lineHeight: '1.5', backgroundColor: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px' }}>{selectedApp.experience}</div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Qualifications</div>
                <div style={{ fontSize: '15px', lineHeight: '1.5', backgroundColor: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px' }}>{selectedApp.qualification}</div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Area of Expertise</div>
                <div style={{ fontSize: '16px' }}>{selectedApp.expertise}</div>
              </div>

              <div style={{ display: 'flex', gap: '24px' }}>
                {selectedApp.linkedin && (
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>LinkedIn</div>
                    <a href={selectedApp.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>View Profile</a>
                  </div>
                )}
                {selectedApp.portfolio && (
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Portfolio</div>
                    <a href={selectedApp.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>View Portfolio</a>
                  </div>
                )}
              </div>
            </div>

            {selectedApp.status === 'pending' && (
              <div style={{ display: 'flex', gap: '16px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                <button 
                  className="btn-primary" 
                  style={{ flex: 1, padding: '12px', backgroundColor: '#10B981', borderColor: '#10B981', color: '#000' }}
                  onClick={() => handleStatusUpdate(selectedApp.id, 'approved')}
                >
                  Approve Application
                </button>
                <button 
                  className="btn-secondary" 
                  style={{ flex: 1, padding: '12px', color: '#EF4444', borderColor: '#EF4444' }}
                  onClick={() => handleStatusUpdate(selectedApp.id, 'rejected')}
                >
                  Reject Application
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInstructorApplications;
