import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { getCategories, toggleWishlist } from '../api/courses';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');

  useEffect(() => {
    getCategories().then(res => setCategories(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category__slug = category;
    if (difficulty) params.difficulty = difficulty;

    API.get('/courses/', { params })
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [search, category, difficulty]);

  const handleWishlist = async (e, courseId) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login to add to wishlist.");
      return;
    }
    try {
      const res = await toggleWishlist(courseId);
      setCourses(courses.map(c => c.id === courseId ? { ...c, is_wishlisted: res.data.is_wishlisted } : c));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '36px' }}>
          {user?.role === 'instructor' ? 'My Courses' : 'Available Courses'}
        </h1>
        {user?.role === 'instructor' && (
          <button className="btn-primary" onClick={() => navigate('/courses/create')}>
            + Create Course
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
        <input 
          type="text" 
          placeholder="Search courses by name..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
          style={{ width: '100%', fontSize: '18px', padding: '12px 16px' }}
        />
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>Optional Filters:</span>
          <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '200px' }}>
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
          <select className="input-field" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ width: '200px' }}>
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-secondary)' }}>Loading courses...</div>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-secondary)' }}>
          <p style={{ marginBottom: '20px', fontSize: '18px' }}>No courses found.</p>
          {user?.role === 'instructor' && (
            <button className="btn-primary" onClick={() => navigate('/courses/create')}>
              Create your first course
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="card" 
              style={{ cursor: 'pointer', transition: 'transform 0.2s', padding: '0', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} 
              onClick={() => navigate(`/courses/${course.id}`)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {course.thumbnail && (
                <div style={{ width: '100%', height: '180px', backgroundImage: `url(${course.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid var(--border)' }}></div>
              )}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
                <h3 style={{ fontSize: '20px', margin: 0, flex: 1, color: 'var(--text-primary)', lineHeight: '1.3' }}>{course.title}</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                  {user?.role === 'instructor' && (
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      color: '#000', 
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      fontWeight: '600',
                      background: course.is_published ? 'var(--accent)' : '#a3a3a3' 
                    }}>
                      {course.is_published ? 'Published' : 'Draft'}
                    </span>
                  )}
                  {/* Wishlist toggle */}
                  <button 
                    onClick={(e) => handleWishlist(e, course.id)}
                    style={{ 
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '24px', color: course.is_wishlisted ? '#ff4757' : 'var(--text-secondary)',
                      padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                    {course.is_wishlisted ? '♥' : '♡'}
                  </button>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.5', marginBottom: '20px', flex: 1 }}>
                {course.description.slice(0, 100)}...
              </p>
              
              {/* Reviews and Lessons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                <span>★ {course.average_rating > 0 ? course.average_rating : 'New'} ({course.reviews_count || 0})</span>
                <span>{course.total_lessons} lessons</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: 'var(--accent)', fontSize: '18px' }}>
                  {course.price === '0.00' ? 'Free' : `$${course.price}`}
                </span>
                {user?.role === 'student' && course.is_enrolled && (
                  <span style={{ background: 'rgba(198, 241, 44, 0.1)', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                    Enrolled
                  </span>
                )}
              </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;