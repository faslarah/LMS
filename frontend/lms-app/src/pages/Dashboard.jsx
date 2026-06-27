import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEnrollments, getWishlists, getCourses } from '../api/courses';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('learning');
  const [enrollments, setEnrollments] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'instructor') {
      setActiveTab('courses');
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user?.role === 'student' || user?.role === 'admin') {
          if (activeTab === 'learning') {
            const res = await getEnrollments();
            setEnrollments(res.data);
          } else if (activeTab === 'wishlist') {
            const res = await getWishlists();
            setWishlists(res.data);
          }
        } else if (user?.role === 'instructor') {
          const res = await getCourses();
          setMyCourses(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [activeTab, user]);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>
          Welcome back, <span style={{ color: 'var(--accent)' }}>{user?.first_name}</span>!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
          {user?.role === 'instructor' ? 'Manage your courses and view analytics.' : 'Ready to continue your learning journey?'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--bg-tertiary)', marginBottom: '24px' }}>
        {user?.role === 'instructor' ? (
          <>
            <button 
              onClick={() => setActiveTab('courses')}
              style={{ background: 'none', border: 'none', padding: '12px 0', fontSize: '18px', fontWeight: '600', cursor: 'pointer', borderBottom: activeTab === 'courses' ? '2px solid var(--accent)' : 'none', color: activeTab === 'courses' ? 'var(--accent)' : 'var(--text-secondary)' }}
            >
              My Courses
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => setActiveTab('learning')}
              style={{ background: 'none', border: 'none', padding: '12px 0', fontSize: '18px', fontWeight: '600', cursor: 'pointer', borderBottom: activeTab === 'learning' ? '2px solid var(--accent)' : 'none', color: activeTab === 'learning' ? 'var(--accent)' : 'var(--text-secondary)' }}
            >
              My Learning
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              style={{ background: 'none', border: 'none', padding: '12px 0', fontSize: '18px', fontWeight: '600', cursor: 'pointer', borderBottom: activeTab === 'wishlist' ? '2px solid var(--accent)' : 'none', color: activeTab === 'wishlist' ? 'var(--accent)' : 'var(--text-secondary)' }}
            >
              My Wishlist
            </button>
          </>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading your dashboard...</div>
      ) : activeTab === 'learning' && enrollments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>You haven't enrolled in any courses yet.</h3>
          <button className="btn-primary" onClick={() => navigate('/courses')}>Browse Courses</button>
        </div>
      ) : activeTab === 'wishlist' && wishlists.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Your wishlist is empty.</h3>
          <button className="btn-primary" onClick={() => navigate('/courses')}>Browse Courses</button>
        </div>
      ) : activeTab === 'courses' && myCourses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>You haven't created any courses yet.</h3>
          <button className="btn-primary" onClick={() => navigate('/courses/create')}>Create a Course</button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {activeTab === 'learning' && enrollments.map(({ id, course, progress_percentage }) => (
            <div key={id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', backgroundColor: 'var(--bg-tertiary)', backgroundImage: course.thumbnail ? `url(${course.thumbnail})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '8px', lineHeight: 1.3 }}>{course.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>{course.instructor_name}</p>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 'bold' }}>
                    <span>Progress</span>
                    <span style={{ color: progress_percentage === 100 ? 'var(--accent)' : 'inherit' }}>{progress_percentage}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress_percentage}%`, height: '100%', backgroundColor: 'var(--accent)', transition: 'width 0.3s ease' }}></div>
                  </div>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <button className="btn-primary" style={{ width: '100%' }} onClick={() => navigate(`/courses/${course.id}`)}>Continue Learning</button>
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'wishlist' && wishlists.map(({ id, course_detail: course }) => (
            <div key={id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', backgroundColor: 'var(--bg-tertiary)', backgroundImage: course.thumbnail ? `url(${course.thumbnail})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '8px', lineHeight: 1.3 }}>{course.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>{course.instructor_name}</p>
                <div style={{ marginTop: 'auto' }}>
                  <button className="btn-primary" style={{ width: '100%' }} onClick={() => navigate(`/courses/${course.id}`)}>View Details</button>
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'courses' && myCourses.map((course) => (
            <div key={course.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '8px', lineHeight: 1.3 }}>{course.title}</h3>
                <div style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{course.is_published ? <span style={{color: 'var(--accent)'}}>Published</span> : 'Draft'}</span>
                  <span>{course.total_enrollments} Student(s)</span>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  <button className="btn-primary" style={{ flex: 1, padding: '8px' }} onClick={() => navigate(`/courses/${course.id}`)}>View</button>
                  <button className="btn-secondary" style={{ flex: 1, padding: '8px' }} onClick={() => navigate(`/courses/${course.id}/manage`)}>Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
