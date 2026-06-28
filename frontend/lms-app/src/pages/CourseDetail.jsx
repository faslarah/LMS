import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse, enrollCourse, toggleWishlist, submitReview, toggleLessonProgress, getDiscussions, createDiscussion } from '../api/courses';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState("");
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await getCourse(id);
        setCourse(res.data);
        const revRes = await API.get(`/courses/reviews/?course=${id}`);
        setReviews(revRes.data);
        const discRes = await getDiscussions(id);
        setDiscussions(discRes.data);
      } catch (err) {
        console.error("Failed to fetch course details or reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setEnrolling(true);
    try {
      await enrollCourse(id);
      
      // Trigger Confetti!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#B8FF3B', '#ffffff', '#AFFF3F']
      });

      const res = await getCourse(id);
      setCourse(res.data);
    } catch (err) {
      console.error("Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      alert("Please login to add to wishlist.");
      return;
    }
    try {
      const res = await toggleWishlist(id);
      setCourse({ ...course, is_wishlisted: res.data.is_wishlisted });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleProgress = async (lessonId) => {
    try {
      const res = await toggleLessonProgress(id, lessonId);
      const updatedCourse = { ...course };
      updatedCourse.sections.forEach(sec => {
        sec.lessons.forEach(les => {
          if (les.id === lessonId) {
            les.is_completed = res.data.is_completed;
          }
        });
      });
      setCourse(updatedCourse);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    try {
      const res = await submitReview({
        course: id,
        rating: reviewRating,
        comment: reviewComment
      });
      setReviews([res.data, ...reviews]);
      setReviewComment("");
    } catch (err) {
      alert("Failed to submit review. You might have already reviewed this course.");
    }
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    if (!newDiscussion.trim() || !user) return;
    try {
      const res = await createDiscussion({ course: id, content: newDiscussion });
      setDiscussions([res.data, ...discussions]);
      setNewDiscussion("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleReplyDiscussion = async (parentId) => {
    const text = replyText[parentId];
    if (!text?.trim() || !user) return;
    try {
      const res = await createDiscussion({ course: id, parent: parentId, content: text });
      const updated = discussions.map(d => {
        if (d.id === parentId) {
          return { ...d, replies: [...d.replies, res.data] };
        }
        return d;
      });
      setDiscussions(updated);
      setReplyText({ ...replyText, [parentId]: "" });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading course...</div>;
  if (!course) return <div style={{ padding: '60px', textAlign: 'center' }}>Course not found</div>;

  return (
    <div>
      {/* Hero Section */}
      <div style={{ background: 'radial-gradient(circle at 50% 0%, rgba(184, 255, 59, 0.05) 0%, rgba(5,8,22,1) 100%)', padding: '60px 20px', borderBottom: '1px solid rgba(184, 255, 59, 0.1)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ color: 'var(--accent)', fontWeight: 'bold', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {course.category_detail?.name || 'General'}
            </div>
            <h1 style={{ fontSize: '42px', marginBottom: '16px', lineHeight: 1.2 }}>{course.title}</h1>
            <p style={{ fontSize: '20px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
              {course.subtitle}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', color: 'var(--text-secondary)' }}>
              <span>Created by <strong style={{ color: '#fff' }}>{course.instructor_name}</strong></span>
              <span>•</span>
              <span style={{ color: 'var(--accent)' }}>★ {course.average_rating > 0 ? course.average_rating : 'New'} ({course.reviews_count} reviews)</span>
              <span>•</span>
              <span>{course.language}</span>
              <span>•</span>
              <span style={{ textTransform: 'capitalize' }}>{course.difficulty} Level</span>
            </div>
          </div>
          
          {/* Action Card */}
          <div style={{ flex: '0 1 350px', marginTop: '-20px' }}>
            <div className="glass-card animate-fade-in" style={{ padding: '24px', position: 'sticky', top: '100px', border: '1px solid rgba(184, 255, 59, 0.15)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
              {course.thumbnail && (
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  style={{ width: '100%', borderRadius: '8px', marginBottom: '24px' }} 
                />
              )}
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>
                {course.price > 0 ? `$${course.price}` : 'Free'}
              </div>
              
              {course.is_enrolled ? (
                <button 
                  className="btn-primary" 
                  style={{ width: '100%', marginBottom: '16px' }}
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </button>
              ) : (
                <button 
                  className="btn-primary" 
                  style={{ width: '100%', marginBottom: '16px' }}
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}

              <button 
                onClick={handleWishlist}
                style={{
                  width: '100%',
                  background: course.is_wishlisted ? 'rgba(255, 71, 87, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${course.is_wishlisted ? 'rgba(255, 71, 87, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                  color: course.is_wishlisted ? '#ff4757' : 'var(--text-primary)',
                  padding: '14px', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: '600', marginBottom: '16px',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                {course.is_wishlisted ? '♥ Remove from Wishlist' : '♡ Add to Wishlist'}
              </button>
              
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                Includes {course.total_lessons} lessons and full lifetime access.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
        <div style={{ flex: '1 1 600px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '24px' }}>About This Course</h2>
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '40px', whiteSpace: 'pre-wrap' }}>
            {course.description}
          </div>

          <h2 style={{ fontSize: '28px', marginBottom: '24px' }}>Course Curriculum</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {course.sections?.map((section, idx) => (
              <div key={section.id} className="glass-card" style={{ padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Section {idx + 1}: {section.title}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '16px', fontWeight: 'normal' }}>
                    {section.lessons?.length || 0} lessons
                  </span>
                </h3>
                {section.lessons && section.lessons.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {section.lessons.map((lesson, lIdx) => (
                      <div key={lesson.id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        borderRadius: '8px',
                        transition: 'background 0.3s ease'
                      }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{lIdx + 1}.</span>
                          <span>{lesson.title}</span>
                          {lesson.is_completed && <span style={{ color: 'var(--accent)', fontSize: '12px', padding: '2px 8px', background: 'rgba(198, 241, 44, 0.1)', borderRadius: '12px', fontWeight: 'bold' }}>✓ Done</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          {lesson.video && (
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Video</span>
                          )}
                          {course.is_enrolled && (
                            <button 
                              onClick={() => handleToggleProgress(lesson.id)}
                              style={{ 
                                background: 'transparent', 
                                border: `1px solid ${lesson.is_completed ? 'var(--text-secondary)' : 'var(--accent)'}`,
                                color: lesson.is_completed ? 'var(--text-secondary)' : 'var(--accent)',
                                padding: '4px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px',
                                transition: 'all 0.2s'
                              }}
                            >
                              {lesson.is_completed ? 'Undo' : 'Mark Complete'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {(!course.sections || course.sections.length === 0) && (
              <p style={{ color: 'var(--text-secondary)' }}>Curriculum is being prepared.</p>
            )}
          </div>
        </div>
      </div>

      {/* Q&A Section */}
      <div style={{ padding: '0 20px 60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '24px' }}>Q&A Discussions</h2>
        
        {user ? (
          <form onSubmit={handleCreateDiscussion} className="glass-card" style={{ padding: '24px', marginBottom: '40px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Ask a Question</h3>
            <div style={{ marginBottom: '16px' }}>
              <textarea 
                className="input-field" 
                rows="3" 
                value={newDiscussion} 
                onChange={(e) => setNewDiscussion(e.target.value)}
                placeholder="What do you want to ask about this course?"
              ></textarea>
            </div>
            <button type="submit" className="btn-primary" disabled={!newDiscussion.trim()}>Post Question</button>
          </form>
        ) : (
          <div className="glass-card" style={{ padding: '24px', marginBottom: '40px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Please log in to participate in the discussion.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {discussions.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No discussions yet. Be the first to ask!</p>
          ) : (
            discussions.map((disc) => (
              <div key={disc.id} className="glass-card" style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--accent)' }}>
                    {disc.user_name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{disc.user_name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {new Date(disc.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <p style={{ color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.5 }}>{disc.content}</p>
                
                {/* Replies */}
                <div style={{ marginLeft: '24px', paddingLeft: '16px', borderLeft: '2px solid var(--bg-tertiary)' }}>
                  {disc.replies?.map(reply => (
                    <div key={reply.id} style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{reply.user_name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{new Date(reply.created_at).toLocaleDateString()}</div>
                      </div>
                      <p style={{ fontSize: '14px', margin: 0, color: 'var(--text-secondary)' }}>{reply.content}</p>
                    </div>
                  ))}
                  
                  {user && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                      <input 
                        type="text" 
                        className="input-field" 
                        style={{ flex: 1, padding: '8px 12px', fontSize: '14px' }}
                        placeholder="Write a reply..."
                        value={replyText[disc.id] || ""}
                        onChange={(e) => setReplyText({ ...replyText, [disc.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleReplyDiscussion(disc.id);
                          }
                        }}
                      />
                      <button 
                        className="btn-primary" 
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                        disabled={!(replyText[disc.id] || "").trim()}
                        onClick={() => handleReplyDiscussion(disc.id)}
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ padding: '0 20px 60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '24px' }}>Reviews</h2>
        
        {user && course.is_enrolled && (
          <form onSubmit={handleSubmitReview} className="glass-card" style={{ padding: '24px', marginBottom: '40px' }}>
            <h3 style={{ marginBottom: '16px' }}>Leave a Review</h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Rating</label>
              <select 
                className="input-field" 
                value={reviewRating} 
                onChange={(e) => setReviewRating(Number(e.target.value))}
                style={{ width: '100px' }}
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Very Good</option>
                <option value={3}>3 - Good</option>
                <option value={2}>2 - Fair</option>
                <option value={1}>1 - Poor</option>
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Comment</label>
              <textarea 
                className="input-field" 
                rows="3" 
                value={reviewComment} 
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="What did you think of this course?"
              ></textarea>
            </div>
            <button type="submit" className="btn-primary" disabled={!reviewComment.trim()}>Submit Review</button>
          </form>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No reviews yet.</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} style={{ borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--accent)' }}>
                    {rev.student_name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{rev.student_name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--accent)' }}>{'★'.repeat(rev.rating)}</span>
                      <span style={{ color: 'var(--bg-tertiary)' }}>{'★'.repeat(5 - rev.rating)}</span>
                    </div>
                  </div>
                </div>
                <p style={{ color: 'var(--text-primary)', margin: 0, paddingLeft: '52px' }}>{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
