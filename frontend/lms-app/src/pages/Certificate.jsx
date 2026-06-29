import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Certificate = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await api.get(`/courses/certificates/${certificateId}/`);
        setCertificate(response.data);
      } catch (err) {
        console.error('Failed to fetch certificate', err);
        setError('Certificate not found or you do not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificate();
  }, [certificateId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading Certificate...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)', gap: '20px' }}>
        <h2 style={{ color: 'red' }}>Error</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
        <button 
          onClick={() => navigate('/courses')}
          style={{ padding: '10px 20px', backgroundColor: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(certificate.issued_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Controls - Hidden when printing */}
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            body { background-color: #fff; margin: 0; padding: 0; }
            .cert-container { box-shadow: none !important; border: none !important; }
          }
        `}
      </style>

      <div className="no-print" style={{ marginBottom: '30px', display: 'flex', gap: '16px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ padding: '10px 20px', backgroundColor: '#fff', color: '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Back
        </button>
        <button 
          onClick={handlePrint}
          style={{ padding: '10px 20px', backgroundColor: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Download PDF / Print
        </button>
      </div>

      {/* Certificate Container */}
      <div className="cert-container" style={{ 
        width: '100%', 
        maxWidth: '1000px', 
        aspectRatio: '1.414', // Landscape A4 roughly
        backgroundColor: '#fff', 
        padding: '40px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        position: 'relative',
        border: '15px solid #1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#1a1a2e'
      }}>
        {/* Inner Border */}
        <div style={{
          position: 'absolute',
          top: '15px', bottom: '15px', left: '15px', right: '15px',
          border: '2px solid #c6f12c',
          pointerEvents: 'none'
        }}></div>

        <h1 style={{ fontSize: '56px', margin: '0 0 10px 0', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px' }}>
          Certificate of Completion
        </h1>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px' }}>
          This is to certify that
        </p>
        
        <h2 style={{ fontSize: '48px', margin: '0 0 40px 0', color: '#1a1a2e', textShadow: '1px 1px 0px rgba(0,0,0,0.1)', borderBottom: '2px solid #eee', paddingBottom: '10px', minWidth: '60%' }}>
          {certificate.student_name}
        </h2>
        
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
          has successfully completed the course
        </p>
        
        <h3 style={{ fontSize: '32px', margin: '0 0 50px 0', fontWeight: 'bold' }}>
          {certificate.course_title}
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', marginTop: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #1a1a2e', paddingBottom: '5px', minWidth: '150px' }}>
              {certificate.instructor_name}
            </span>
            <span style={{ fontSize: '14px', color: '#666', textTransform: 'uppercase' }}>Instructor</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #1a1a2e', paddingBottom: '5px', minWidth: '150px' }}>
              {formattedDate}
            </span>
            <span style={{ fontSize: '14px', color: '#666', textTransform: 'uppercase' }}>Date</span>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '30px', fontSize: '10px', color: '#999' }}>
          Certificate ID: {certificate.certificate_id}
        </div>
        
        {/* Logo Mark */}
        <div style={{ position: 'absolute', top: '40px', right: '40px', width: '60px', height: '60px', backgroundColor: '#1a1a2e', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '30px', height: '30px', backgroundColor: '#c6f12c', borderRadius: '50%' }}></div>
        </div>

      </div>
    </div>
  );
};

export default Certificate;
