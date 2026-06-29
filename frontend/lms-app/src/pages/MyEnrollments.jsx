import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyEnrollments } from '../api/courses';

const MyEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await getMyEnrollments();
        setEnrollments(response.data);
      } catch (error) {
        console.error('Failed to fetch enrollments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)' }}>Loading your enrollments...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>My Enrollments</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Continue learning from where you left off.
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="btn-primary" style={{ padding: '8px 24px', textDecoration: 'none', display: 'inline-block' }}>
            Browse Courses
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {enrollments.map(enrollment => {
            const { course } = enrollment;
            if (!course) return null;
            
            return (
              <Link key={enrollment.id} to={`/courses/${course.id}/learn`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '0', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  
                  <div style={{ height: '160px', backgroundColor: 'var(--bg-tertiary)', position: 'relative' }}>
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                        No Thumbnail
                      </div>
                    )}
                  </div>
                  
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '12px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                      {course.category_detail?.name || 'Category'}
                    </div>
                    <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--text-primary)', lineHeight: '1.4' }}>{course.title}</h3>
                    
                    <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                        <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>
                          {enrollment.progress_percentage}%
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${enrollment.progress_percentage}%`, height: '100%', backgroundColor: 'var(--accent)' }} />
                      </div>
                    </div>
                    
                    <div style={{ marginTop: '16px' }}>
                      <button className="btn-primary" style={{ width: '100%', padding: '8px', fontSize: '14px' }}>
                        Continue Course
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyEnrollments;
