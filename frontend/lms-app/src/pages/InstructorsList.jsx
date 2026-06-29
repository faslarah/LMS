import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getInstructors } from '../api/courses';

const InstructorsList = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await getInstructors();
        setInstructors(response.data);
      } catch (error) {
        console.error('Failed to fetch instructors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)' }}>Loading instructors...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Expert Instructors</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Learn from industry professionals with real-world experience. Browse our top-rated instructors and discover their courses.
        </p>
      </div>

      {instructors.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No instructors found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {instructors.map(instructor => (
            <div key={instructor.id} className="card" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center',
              padding: '32px 24px',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}>
              
              <div style={{ 
                width: '100px', height: '100px', borderRadius: '50%', 
                backgroundColor: 'var(--bg-tertiary)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', 
                color: 'var(--accent)', fontWeight: 'bold', fontSize: '36px',
                marginBottom: '16px'
              }}>
                {instructor.first_name?.[0]}
              </div>
              
              <h3 style={{ fontSize: '20px', marginBottom: '16px', color: 'var(--text-primary)' }}>
                {instructor.first_name} {instructor.last_name}
              </h3>
              
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{instructor.courses_published || 0}</span> Courses
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{instructor.students_taught || 0}</span> Students
                </div>
              </div>
              
              <button 
                onClick={() => navigate(`/instructors/${instructor.id}`)}
                className="btn-primary" 
                style={{ padding: '10px 24px', fontSize: '14px', width: '100%' }}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorsList;
