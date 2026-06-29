import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse, toggleSectionProgress } from '../api/courses';

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeSection, setActiveSection] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCongrats, setShowCongrats] = useState(false);
  const [newCertificateId, setNewCertificateId] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await getCourse(id);
        setCourse(res.data);
        
        // Find first section to play automatically
        if (res.data.sections && res.data.sections.length > 0) {
          setActiveSection(res.data.sections[0]);
        }
      } catch (err) {
        console.error("Failed to fetch course details");
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const handleToggleProgress = async (sectionId) => {
    try {
      const res = await toggleSectionProgress(id, sectionId);
      const updatedCourse = { ...course };
      updatedCourse.sections.forEach(sec => {
        if (sec.id === sectionId) {
          sec.is_completed = res.data.is_completed;
          if (activeSection && activeSection.id === sectionId) {
            setActiveSection({ ...activeSection, is_completed: res.data.is_completed });
          }
        }
      });
      setCourse(updatedCourse);
      
      if (res.data.is_course_completed) {
        setNewCertificateId(res.data.certificate_id);
        setShowCongrats(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVideoEnded = () => {
    if (activeSection && !activeSection.is_completed) {
      handleToggleProgress(activeSection.id);
    }
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading player...</div>;
  if (!course) return <div style={{ padding: '60px', textAlign: 'center' }}>Course not found</div>;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
      
      {/* LEFT: Video Player & Info (75%) */}
      <div style={{ flex: '1 1 75%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)', overflowY: 'auto', position: 'relative' }}>
        
        {/* Header: Title and Mark as Complete */}
        <div style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{activeSection?.title}</h1>
            {(course.certificate_id || newCertificateId) && (
              <button 
                onClick={() => navigate(`/certificates/${newCertificateId || course.certificate_id}`)}
                style={{ backgroundColor: 'rgba(198, 241, 44, 0.1)', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🏆 View Certificate
              </button>
            )}
          </div>
          {activeSection && (
            <button 
              onClick={() => handleToggleProgress(activeSection.id)}
              style={{ 
                background: 'transparent', 
                border: `1px solid ${activeSection.is_completed ? 'var(--accent)' : 'var(--text-secondary)'}`,
                color: activeSection.is_completed ? 'var(--accent)' : 'var(--text-secondary)',
                padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              {activeSection.is_completed ? '✓ Completed' : '✓ Mark as Complete'}
            </button>
          )}
        </div>

        {/* Video Area */}
        <div style={{ padding: '0 40px' }}>
          <div style={{ width: '100%', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {activeSection?.video_file ? (
              <video 
                src={activeSection.video_file} 
                controls 
                autoPlay 
                onEnded={handleVideoEnded}
                style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }} 
              />
            ) : (
              <div style={{ color: '#666', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '16px' }}>{activeSection?.title || 'Select a section'}</h2>
                <p>No video available for this section.</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs and Content */}
        <div style={{ padding: '24px 40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
            <button 
              onClick={() => setActiveTab('overview')}
              style={{ background: 'none', border: 'none', padding: '12px 0', fontSize: '16px', cursor: 'pointer', borderBottom: activeTab === 'overview' ? '2px solid var(--accent)' : 'none', color: activeTab === 'overview' ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 'bold' }}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('resources')}
              style={{ background: 'none', border: 'none', padding: '12px 0', fontSize: '16px', cursor: 'pointer', borderBottom: activeTab === 'resources' ? '2px solid var(--accent)' : 'none', color: activeTab === 'resources' ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 'bold' }}
            >
              Resources
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1 }}>
            
            {/* Content Column */}
            <div style={{ width: '100%' }}>
              {activeTab === 'overview' && (
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  <p style={{ marginBottom: '24px', color: 'var(--text-primary)' }}>
                    {activeSection?.description || "In this video, you will learn the core concepts of this section and how it helps you achieve your learning goals effectively."}
                  </p>
                  
                  <h3 style={{ color: 'var(--accent)', marginBottom: '16px', fontSize: '16px' }}>What you'll learn in this video</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>✓</span> <span>Key principles of {activeSection?.title || 'the topic'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>✓</span> <span>Practical applications and real-world examples</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>✓</span> <span>Best practices and common pitfalls</span>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'resources' && (
                <div style={{ color: 'var(--text-secondary)' }}>
                  <p>No extra resources attached to this section.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div style={{ padding: '24px 40px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {(() => {
            const activeIndex = course?.sections?.findIndex(s => s.id === activeSection?.id);
            const prevSection = course?.sections?.[activeIndex - 1];
            return (
              <button 
                onClick={() => prevSection && setActiveSection(prevSection)}
                style={{ 
                  background: 'transparent', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  color: 'var(--text-primary)', 
                  padding: '12px 24px', 
                  borderRadius: '8px', 
                  cursor: prevSection ? 'pointer' : 'not-allowed',
                  opacity: prevSection ? 1 : 0.5,
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: '14px'
                }}
                disabled={!prevSection}
              >
                &larr; Previous Video
              </button>
            );
          })()}

          {(() => {
            const activeIndex = course?.sections?.findIndex(s => s.id === activeSection?.id);
            const nextSection = course?.sections?.[activeIndex + 1];
            return (
              <button 
                onClick={() => nextSection && setActiveSection(nextSection)}
                style={{ 
                  background: nextSection ? 'var(--accent)' : 'var(--bg-secondary)', 
                  border: 'none', 
                  color: nextSection ? '#000' : 'var(--text-secondary)', 
                  padding: '12px 24px', 
                  borderRadius: '8px', 
                  cursor: nextSection ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: '14px'
                }}
                disabled={!nextSection}
              >
                Next Video &rarr;
              </button>
            );
          })()}
        </div>
      </div>

      {/* RIGHT: Curriculum Sidebar (25%) */}
      <div style={{ flex: '0 0 350px', backgroundColor: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '18px' }}>Course Content</h2>
          <button onClick={() => navigate(`/courses/${course.id}`)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '24px' }}>&times;</button>
        </div>
        
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {course.sections?.map((section, idx) => (
            <div 
              key={section.id} 
              onClick={() => setActiveSection(section)}
              style={{ 
                padding: '16px 20px', 
                cursor: 'pointer',
                backgroundColor: activeSection?.id === section.id ? 'rgba(198, 241, 44, 0.1)' : 'transparent',
                borderLeft: activeSection?.id === section.id ? '4px solid var(--accent)' : '4px solid transparent',
                borderBottom: '1px solid var(--border)',
                transition: 'background 0.2s'
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ color: section.is_completed ? 'var(--accent)' : 'var(--text-secondary)', marginTop: '2px' }}>
                  {section.is_completed ? '✓' : '○'}
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: activeSection?.id === section.id ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeSection?.id === section.id ? 'bold' : 'normal', marginBottom: '4px' }}>
                    Section {idx + 1}: {section.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {section.duration} min • Video
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Congrats Modal */}
      {showCongrats && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '50px', borderRadius: '16px', textAlign: 'center', maxWidth: '550px', border: '1px solid var(--accent)', boxShadow: '0 10px 40px rgba(198,241,44,0.15)' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎓</div>
            <h2 style={{ fontSize: '32px', color: 'var(--accent)', marginBottom: '16px' }}>Congratulations!</h2>
            <p style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '32px', lineHeight: 1.5 }}>
              You have successfully completed all sections of<br/><strong>{course.title}</strong>!
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowCongrats(false)}
                style={{ padding: '12px 24px', backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Close
              </button>
              {newCertificateId && (
                <button 
                  onClick={() => navigate(`/certificates/${newCertificateId}`)}
                  style={{ padding: '12px 24px', backgroundColor: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Download Certificate
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;
