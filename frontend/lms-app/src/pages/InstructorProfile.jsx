import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInstructor, getCourses } from '../api/courses';

const InstructorProfile = () => {
  const { id } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [instRes, coursesRes] = await Promise.all([
          getInstructor(id),
          getCourses({ instructor: id })
        ]);
        setInstructor(instRes.data);
        setCourses(coursesRes.data);
      } catch (error) {
        console.error('Failed to fetch instructor details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)' }}>Loading instructor profile...</div>;
  }

  if (!instructor) {
    return <div style={{ color: 'var(--text-secondary)' }}>Instructor not found.</div>;
  }

  return (
    <div>
      {/* Profile Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '40px' }}>
        <div style={{ 
          width: '120px', height: '120px', borderRadius: '50%', 
          backgroundColor: 'var(--bg-tertiary)', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', 
          color: 'var(--accent)', fontWeight: 'bold', fontSize: '48px'
        }}>
          {instructor.first_name?.[0]}
        </div>
        <div>
          <h1 style={{ marginBottom: '8px' }}>{instructor.first_name} {instructor.last_name}</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '18px' }}>Expert Instructor</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <div>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{courses.length}</span>
              <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>Courses</span>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '24px', fontSize: '24px' }}>Courses by {instructor.first_name}</h2>
      
      {courses.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>This instructor has no published courses yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {courses.map(course => (
            <Link key={course.id} to={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '0', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '160px', backgroundColor: 'var(--bg-tertiary)', position: 'relative' }}>
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                      No Thumbnail
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>
                    {course.difficulty}
                  </div>
                </div>
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text-primary)' }}>{course.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px', flex: 1 }}>
                    {course.category_detail?.name}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--accent)', fontSize: '18px' }}>
                      ${course.price}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', color: '#FBBF24', fontSize: '14px', fontWeight: 'bold' }}>
                      ★ {course.average_rating} ({course.reviews_count})
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorProfile;
