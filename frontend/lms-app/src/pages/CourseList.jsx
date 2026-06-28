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
      
      {/* Hero Banner for Students */}
      {user?.role !== 'instructor' && (
        <div className="glass-card" style={{
          display: 'flex',
          padding: '40px 60px',
          marginBottom: '48px',
          position: 'relative',
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '380px',
          background: 'radial-gradient(circle at 50% 50%, rgba(184, 255, 59, 0.12) 0%, rgba(5,8,22,1) 60%)',
          border: '1px solid rgba(184, 255, 59, 0.15)'
        }}>
          {/* Left Content */}
          <div style={{ flex: 1, zIndex: 2, paddingRight: '40px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(184, 255, 59, 0.05)',
              color: 'var(--accent)',
              padding: '6px 16px',
              borderRadius: '24px',
              fontSize: '13px',
              fontWeight: '500',
              marginBottom: '24px',
              border: '1px solid rgba(184, 255, 59, 0.2)',
              letterSpacing: '0.5px'
            }}>
              <span>✨</span> Today's Motivation
            </div>
            <h2 style={{ fontSize: '46px', lineHeight: '1.25', marginBottom: '24px', fontWeight: '700', color: '#fff' }}>
              <span style={{ color: 'var(--accent)' }}>“</span>The expert in<br/>
              anything was<br/>
              once a <span style={{ color: 'var(--accent)' }}>beginner.”</span>
            </h2>
            <p style={{ color: 'var(--accent)', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '30px', height: '2px', backgroundColor: 'var(--accent)' }}></span>
              Helen Hayes
            </p>
          </div>

          {/* Removed Center Character Image as requested */}

          {/* Right Benefit Cards */}
          <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 2 }}>
            {[
              { 
                title: 'Learn Anywhere', 
                desc: 'Access quality content anytime, anywhere.', 
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> 
              },
              { 
                title: 'Build Real Skills', 
                desc: 'Gain practical knowledge that matters.', 
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg> 
              },
              { 
                title: 'Achieve Your Goals', 
                desc: 'Track progress and become your best.', 
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg> 
              }
            ].map((card, i) => (
              <div key={i} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', width: '100%', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(184, 255, 59, 0.08)', border: '1px solid rgba(184, 255, 59, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {card.icon}
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px', fontSize: '15px', fontWeight: '600' }}>{card.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0, lineHeight: '1.4' }}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '36px', marginBottom: '8px', fontWeight: '700' }}>
            {user?.role === 'instructor' ? 'My Courses' : <>Available <span style={{ color: 'var(--accent)' }}>Courses</span></>}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Discover the perfect course to level up your skills.
          </p>
        </div>
        {user?.role === 'instructor' && (
          <button className="btn-primary" onClick={() => navigate('/courses/create')}>
            + Create Course
          </button>
        )}
      </div>

      {/* Filters Area */}
      <div className="glass-card" style={{ 
        display: 'flex', gap: '16px', marginBottom: '40px', 
        padding: '20px', borderRadius: '16px' 
      }}>
        <input 
          type="text" 
          placeholder="Search courses by name or topic..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}
        />
        <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '220px', backgroundColor: 'rgba(0,0,0,0.2)', cursor: 'pointer' }}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
        <select className="input-field" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ width: '220px', backgroundColor: 'rgba(0,0,0,0.2)', cursor: 'pointer' }}>
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-secondary)' }}>Loading courses...</div>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-secondary)' }}>
          <p style={{ marginBottom: '20px', fontSize: '18px' }}>No courses found matching your criteria.</p>
          {user?.role === 'instructor' && (
            <button className="btn-primary" onClick={() => navigate('/courses/create')}>
              Create your first course
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
          {courses.map((course, idx) => {
            
            // Dynamic Badges (mock logic for visual enhancement based on data)
            let badge = null;
            if (course.average_rating >= 4.8 && course.reviews_count > 5) badge = { text: 'Bestseller', color: '#ffb020' };
            else if (idx === 0) badge = { text: 'Popular', color: 'var(--accent)' };
            else if (idx === 2) badge = { text: 'New', color: '#00e5ff' };

            return (
            <div 
              key={course.id} 
              className="glass-card animate-fade-in" 
              style={{ cursor: 'pointer', padding: '0', display: 'flex', flexDirection: 'column', animationDelay: `${idx * 0.05}s` }} 
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              {/* Thumbnail Container */}
              <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
                <div style={{ 
                  width: '100%', height: '100%', 
                  backgroundImage: `url(${course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'})`, 
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                ></div>
                
                {/* Badge Overlay */}
                {badge && (
                  <div style={{ 
                    position: 'absolute', top: '16px', left: '16px', 
                    backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                    color: badge.color, border: `1px solid ${badge.color}`,
                    padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                    letterSpacing: '0.5px'
                  }}>
                    {badge.text}
                  </div>
                )}

                {/* Wishlist Button Overlay */}
                <button 
                  onClick={(e) => handleWishlist(e, course.id)}
                  style={{ 
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                    width: '40px', height: '40px', borderRadius: '50%',
                    fontSize: '20px', color: course.is_wishlisted ? '#ff4757' : 'var(--text-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s', zIndex: 5
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.8)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {course.is_wishlisted ? '♥' : '♡'}
                </button>
              </div>

              {/* Card Body */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '20px', margin: '0 0 12px 0', color: 'var(--text-primary)', lineHeight: '1.4', fontWeight: '600' }}>
                  {course.title}
                </h3>
                
                {user?.role === 'instructor' && (
                  <span style={{ 
                    padding: '4px 10px', borderRadius: '4px', color: '#000', fontSize: '12px',
                    fontWeight: '600', alignSelf: 'flex-start', marginBottom: '12px',
                    background: course.is_published ? 'var(--accent)' : '#a3a3a3' 
                  }}>
                    {course.is_published ? 'Published' : 'Draft'}
                  </span>
                )}

                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                  {course.description.slice(0, 100)}...
                </p>
                
                {/* Rating and Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffb020', fontWeight: '600' }}>
                    ★ <span>{course.average_rating > 0 ? course.average_rating : 'New'}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({course.reviews_count || 0})</span>
                  </div>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--text-muted)' }}></div>
                  <span>{course.total_lessons} lessons</span>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--text-muted)' }}></div>
                  <span style={{ textTransform: 'capitalize' }}>{course.difficulty || 'All Levels'}</span>
                </div>
                
                {/* Footer / Price */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '22px' }}>
                    {course.price === '0.00' ? 'Free' : `$${course.price}`}
                  </span>
                  {user?.role === 'student' && course.is_enrolled && (
                    <span style={{ background: 'rgba(184, 255, 59, 0.1)', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '6px 16px', borderRadius: '24px', fontSize: '13px', fontWeight: '600' }}>
                      Enrolled
                    </span>
                  )}
                </div>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
};

export default CourseList;