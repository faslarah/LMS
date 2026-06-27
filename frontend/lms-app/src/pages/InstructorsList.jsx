import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getInstructors } from '../api/courses';

const InstructorsList = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <h1 style={{ marginBottom: '24px' }}>Expert Instructors</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Learn from the best. Browse our top-rated instructors and discover their courses.
      </p>

      {instructors.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>No instructors found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {instructors.map(instructor => (
            <Link key={instructor.id} to={`/instructors/${instructor.id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                cursor: 'pointer'
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
                  width: '80px', height: '80px', borderRadius: '50%', 
                  backgroundColor: 'var(--bg-tertiary)', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', 
                  color: 'var(--accent)', fontWeight: 'bold', fontSize: '32px',
                  marginBottom: '16px'
                }}>
                  {instructor.first_name?.[0]}
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
                  {instructor.first_name} {instructor.last_name}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Instructor
                </p>
                <div style={{ 
                  backgroundColor: 'rgba(198, 241, 44, 0.1)', 
                  color: 'var(--accent)', 
                  padding: '6px 16px', 
                  borderRadius: '20px', 
                  fontSize: '12px', 
                  fontWeight: '600' 
                }}>
                  View Profile & Courses
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorsList;
