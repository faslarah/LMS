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
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '24px', border: '1px solid rgba(184, 255, 59, 0.1)' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text-primary)' }}>You haven't enrolled in any courses yet.</h3>
          <button className="btn-primary" onClick={() => navigate('/courses')}>Browse Courses</button>
        </div>
      ) : activeTab === 'wishlist' && wishlists.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '24px', border: '1px solid rgba(184, 255, 59, 0.1)' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text-primary)' }}>Your wishlist is empty.</h3>
          <button className="btn-primary" onClick={() => navigate('/courses')}>Browse Courses</button>
        </div>
      ) : activeTab === 'courses' && myCourses.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '24px', border: '1px solid rgba(184, 255, 59, 0.1)' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text-primary)' }}>You haven't created any courses yet.</h3>
          <button className="btn-primary" onClick={() => navigate('/courses/create')}>Create a Course</button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {activeTab === 'learning' && enrollments.map(({ id, course, progress_percentage }, idx) => (
            <div key={id} className="glass-card animate-fade-in" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', animationDelay: `${idx * 0.05}s`, cursor: 'pointer' }} onClick={() => navigate(`/courses/${course.id}`)}>
              <div style={{ height: '180px', backgroundColor: 'var(--bg-tertiary)', backgroundImage: course.thumbnail ? `url(${course.thumbnail})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.5s', ':hover': { transform: 'scale(1.05)' } }}></div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '8px', lineHeight: 1.4, color: 'var(--text-primary)', fontWeight: '600' }}>{course.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>{course.instructor_name}</p>
                <div style={{ marginBottom: '24px', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>
                    <span>Progress</span>
                    <span style={{ color: progress_percentage === 100 ? 'var(--accent)' : 'inherit' }}>{progress_percentage}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress_percentage}%`, height: '100%', backgroundColor: 'var(--accent)', transition: 'width 0.5s ease', boxShadow: '0 0 10px var(--accent)' }}></div>
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <button className="btn-primary" style={{ width: '100%', padding: '12px' }} onClick={(e) => { e.stopPropagation(); navigate(`/courses/${course.id}`); }}>Continue Learning</button>
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'wishlist' && wishlists.map(({ id, course_detail: course }, idx) => (
            <div key={id} className="glass-card animate-fade-in" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', animationDelay: `${idx * 0.05}s`, cursor: 'pointer' }} onClick={() => navigate(`/courses/${course.id}`)}>
              <div style={{ height: '180px', backgroundColor: 'var(--bg-tertiary)', backgroundImage: course.thumbnail ? `url(${course.thumbnail})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '8px', lineHeight: 1.4, color: 'var(--text-primary)', fontWeight: '600' }}>{course.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>{course.instructor_name}</p>
                <div style={{ marginTop: 'auto' }}>
                  <button className="btn-primary" style={{ width: '100%', padding: '12px' }} onClick={(e) => { e.stopPropagation(); navigate(`/courses/${course.id}`); }}>View Details</button>
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'courses' && myCourses.map((course, idx) => (
            <div key={course.id} className="glass-card animate-fade-in" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', animationDelay: `${idx * 0.05}s` }}>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '16px', lineHeight: 1.4, color: 'var(--text-primary)', fontWeight: '600' }}>{course.title}</h3>
                <div style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '4px', background: course.is_published ? 'rgba(184, 255, 59, 0.1)' : 'rgba(255, 255, 255, 0.1)', color: course.is_published ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: '600', fontSize: '12px' }}>
                    {course.is_published ? 'Published' : 'Draft'}
                  </span>
                  <span style={{ fontWeight: '500' }}>{course.total_enrollments} Student(s)</span>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                  <button className="btn-secondary" style={{ flex: 1, padding: '10px' }} onClick={() => navigate(`/courses/${course.id}`)}>View</button>
                  <button className="btn-primary" style={{ flex: 1, padding: '10px' }} onClick={() => navigate(`/courses/${course.id}/manage`)}>Edit</button>
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
