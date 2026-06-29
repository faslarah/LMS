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
    <div style={{ paddingBottom: '60px' }}>
      
      {/* Hero Section */}
      <div className="card" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '40px', 
        marginBottom: '32px', 
        padding: '48px', 
        border: '1px solid var(--border)',
        backgroundColor: 'var(--bg-secondary)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background element */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(198, 241, 44, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ 
          width: '160px', height: '160px', borderRadius: '50%', 
          backgroundColor: 'var(--bg-tertiary)', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', 
          color: 'var(--accent)', fontWeight: 'bold', fontSize: '64px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1
        }}>
          {instructor.first_name?.[0]}
        </div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '36px', marginBottom: '8px', fontWeight: 'bold' }}>
            {instructor.first_name} {instructor.last_name}
          </h1>
          <p style={{ color: 'var(--accent)', fontSize: '20px', fontWeight: '500', marginBottom: '16px' }}>
            {instructor.expertise || 'Professional Instructor'}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6', maxWidth: '800px' }}>
            {instructor.bio || 'An experienced instructor dedicated to sharing knowledge and helping students succeed.'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px', marginBottom: '40px' }}>
        {/* Main Content (About) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div className="card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              About the Instructor
            </h2>
            
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Teaching Experience
              </h3>
              <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
                {instructor.experience || 'Not specified.'}
              </p>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Qualifications
              </h3>
              <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
                {instructor.qualification || 'Not specified.'}
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Areas of Expertise
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {instructor.expertise ? (
                  instructor.expertise.split(',').map((exp, idx) => (
                    <span key={idx} style={{ 
                      backgroundColor: 'rgba(255,255,255,0.05)', 
                      padding: '6px 12px', 
                      borderRadius: '4px', 
                      fontSize: '14px' 
                    }}>
                      {exp.trim()}
                    </span>
                  ))
                ) : (
                  <span style={{ color: 'var(--text-primary)' }}>Not specified.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Stats) */}
        <div>
          <div className="card" style={{ padding: '32px', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '24px' }}>Instructor Statistics</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {instructor.courses_published || 0}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Courses Published
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {instructor.students_taught || 0}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Students Taught
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>Courses by this Instructor</h2>
      
      {courses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>This instructor has no published courses yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {courses.map(course => (
            <Link key={course.id} to={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
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
                  <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>
                    {course.difficulty}
                  </div>
                </div>
                
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '12px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    {course.category_detail?.name || 'Category'}
                  </div>
                  <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--text-primary)', lineHeight: '1.4' }}>{course.title}</h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '18px' }}>
                      ${course.price}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', color: '#FBBF24', fontSize: '14px', fontWeight: 'bold' }}>
                      ★ {course.average_rating || 'New'}
                    </div>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <button className="btn-primary" style={{ width: '100%', padding: '8px', fontSize: '14px' }}>
                      View Course
                    </button>
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
