import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await api.get('/courses/certificates/');
        setCertificates(response.data);
      } catch (err) {
        console.error('Failed to fetch certificates', err);
        setError('Could not load your certificates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your certificates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px' }}>
        <div style={{ backgroundColor: 'rgba(255,0,0,0.1)', color: 'red', padding: '16px', borderRadius: '8px' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>My Certificates</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        View and download all the certificates you have earned from completing courses.
      </p>

      {certificates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>No certificates yet</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Complete all sections of a course to earn your first certificate!
          </p>
          <button 
            onClick={() => navigate('/courses')}
            style={{ marginTop: '24px', padding: '10px 20px', backgroundColor: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Explore Courses
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {certificates.map(cert => (
            <div 
              key={cert.certificate_id}
              style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                borderRadius: '16px', 
                border: '1px solid rgba(255,255,255,0.05)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(198, 241, 44, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(198, 241, 44, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              }}
            >
              {/* Certificate Preview Top */}
              <div style={{ 
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                height: '180px', 
                padding: '24px',
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                borderBottom: '2px solid var(--accent)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '48px', height: '48px', 
                    background: 'rgba(198, 241, 44, 0.1)', 
                    borderRadius: '12px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(198, 241, 44, 0.3)'
                  }}>
                    <span style={{ fontSize: '24px' }}>🎓</span>
                  </div>
                  <div style={{ 
                    backgroundColor: 'rgba(198, 241, 44, 0.15)', 
                    color: 'var(--accent)', 
                    padding: '6px 12px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid rgba(198, 241, 44, 0.2)'
                  }}>
                    <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent)', borderRadius: '50%' }}></span>
                    Verified
                  </div>
                </div>
                
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    Certificate of Completion
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', lineHeight: 1.3, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {cert.course_title}
                  </h3>
                </div>
              </div>
              
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Issued On</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Credential ID</div>
                    <div style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-primary)', opacity: 0.8 }}>
                      {cert.certificate_id.split('-')[0].toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: 'auto' }}>
                  <button 
                    onClick={() => navigate(`/certificates/${cert.certificate_id}`)}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      backgroundColor: 'var(--accent)', 
                      color: '#000', 
                      border: 'none', 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      fontWeight: 'bold',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(198, 241, 44, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    View & Download PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCertificates;
