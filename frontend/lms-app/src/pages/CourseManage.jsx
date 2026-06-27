import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse, createSection, createLesson, uploadVideo, updateCoursePartial, getCategories } from '../api/courses';

const CourseManage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('curriculum');
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({ thumbnail: null, preview_video: null });
  const [savingDetails, setSavingDetails] = useState(false);

  // States for new section/lesson forms
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const fetchCourse = async () => {
    try {
      const [res, catRes] = await Promise.all([getCourse(id), getCategories()]);
      setCourse(res.data);
      setCategories(catRes.data);
      setFormData({
        title: res.data.title || '',
        subtitle: res.data.subtitle || '',
        description: res.data.description || '',
        category: res.data.category || (catRes.data.length > 0 ? catRes.data[0].id : ''),
        difficulty: res.data.difficulty || 'beginner',
        language: res.data.language || 'English',
        price: res.data.price || '0.00',
        requirements: res.data.requirements || '',
        learning_outcomes: res.data.learning_outcomes || '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleChangeDetails = (e) => {
    const { name, value, type, files: fileList } = e.target;
    if (type === 'file') {
      setFiles({ ...files, [name]: fileList[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setSavingDetails(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (files.thumbnail) data.append('thumbnail', files.thumbnail);
      if (files.preview_video) data.append('preview_video', files.preview_video);

      await updateCoursePartial(course.id, data);
      alert('Course details updated successfully!');
      fetchCourse();
    } catch (err) {
      console.error("Failed to update course details");
    } finally {
      setSavingDetails(false);
    }
  };

  const togglePublish = async () => {
    try {
      const data = new FormData();
      data.append('is_published', !course.is_published);
      await updateCoursePartial(course.id, data);
      fetchCourse();
    } catch (err) {
      console.error("Failed to update course status");
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!newSectionTitle) return;
    try {
      await createSection({ course: id, title: newSectionTitle, order: course.sections?.length || 0 });
      setNewSectionTitle('');
      fetchCourse();
    } catch (err) {
      console.error("Failed to add section");
    }
  };

  const handleAddLesson = async (sectionId, e) => {
    e.preventDefault();
    if (!newLessonTitle) return;
    try {
      const targetSection = course.sections.find(s => s.id === sectionId);
      const res = await createLesson({ 
        section: sectionId, 
        title: newLessonTitle, 
        order: targetSection.lessons?.length || 0 
      });
      
      if (videoFile) {
        const formData = new FormData();
        formData.append('lesson', res.data.id);
        formData.append('file', videoFile);
        await uploadVideo(formData);
      }

      setNewLessonTitle('');
      setVideoFile(null);
      setActiveSectionId(null);
      fetchCourse();
    } catch (err) {
      console.error("Failed to add lesson", err);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  if (!course) return <div style={{ padding: '40px', textAlign: 'center' }}>Course not found</div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px' }}>Curriculum: <span style={{ color: 'var(--accent)'}}>{course.title}</span></h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn-primary" 
            style={{ background: course.is_published ? '#a3a3a3' : 'var(--accent)' }}
            onClick={togglePublish}
          >
            {course.is_published ? 'Unpublish Course' : 'Publish Course'}
          </button>
          <button className="btn-secondary" onClick={() => navigate('/courses')}>Back to Courses</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--bg-tertiary)', marginBottom: '32px' }}>
        <button 
          onClick={() => setActiveTab('curriculum')}
          style={{ background: 'none', border: 'none', padding: '12px 0', fontSize: '18px', fontWeight: '600', cursor: 'pointer', borderBottom: activeTab === 'curriculum' ? '2px solid var(--accent)' : 'none', color: activeTab === 'curriculum' ? 'var(--accent)' : 'var(--text-secondary)' }}
        >
          Curriculum Builder
        </button>
        <button 
          onClick={() => setActiveTab('details')}
          style={{ background: 'none', border: 'none', padding: '12px 0', fontSize: '18px', fontWeight: '600', cursor: 'pointer', borderBottom: activeTab === 'details' ? '2px solid var(--accent)' : 'none', color: activeTab === 'details' ? 'var(--accent)' : 'var(--text-secondary)' }}
        >
          Course Details
        </button>
      </div>

      {activeTab === 'curriculum' ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* List Sections */}
        {course.sections?.map((section) => (
          <div key={section.id} className="card">
            <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Section {section.order + 1}: {section.title}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {section.lessons?.map((lesson) => (
                <div key={lesson.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Lesson {lesson.order + 1}: {lesson.title}</span>
                  {lesson.video && <span style={{ background: 'rgba(198, 241, 44, 0.1)', color: 'var(--accent)', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', border: '1px solid var(--accent)' }}>Has Video</span>}
                </div>
              ))}
            </div>

            {/* Add Lesson Form */}
            {activeSectionId === section.id ? (
              <form onSubmit={(e) => handleAddLesson(section.id, e)} style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <input 
                  className="input-field" 
                  placeholder="Lesson Title" 
                  value={newLessonTitle} 
                  onChange={(e) => setNewLessonTitle(e.target.value)} 
                  required 
                  style={{ marginBottom: '16px' }}
                />
                <label className="label">Upload Video</label>
                <input 
                  type="file" 
                  accept="video/*" 
                  onChange={(e) => setVideoFile(e.target.files[0])} 
                  className="input-field"
                  style={{ marginBottom: '20px', padding: '9px' }}
                />
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setActiveSectionId(null)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Save Lesson</button>
                </div>
              </form>
            ) : (
              <button onClick={() => setActiveSectionId(section.id)} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px dashed var(--border-focus)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: '500', transition: 'border-color 0.2s, color 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-focus)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                + Add Lesson
              </button>
            )}
          </div>
        ))}

        {/* Add Section Form */}
        <div style={{ background: 'transparent', border: '1px dashed var(--border-focus)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
          <form onSubmit={handleAddSection} style={{ display: 'flex', gap: '12px' }}>
            <input 
              className="input-field" 
              placeholder="New Section Title" 
              value={newSectionTitle} 
              onChange={(e) => setNewSectionTitle(e.target.value)} 
              required 
            />
            <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>Add Section</button>
          </form>
        </div>
      </div>
      ) : (
        <form onSubmit={handleSaveDetails} className="card">
          <h3 style={{ fontSize: '24px', marginBottom: '24px' }}>Edit Course Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label className="label">Course Title</label>
              <input className="input-field" name="title" value={formData.title} onChange={handleChangeDetails} required />
            </div>
            <div>
              <label className="label">Subtitle</label>
              <input className="input-field" name="subtitle" value={formData.subtitle} onChange={handleChangeDetails} />
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label className="label">Description</label>
            <textarea className="input-field" style={{ height: '100px', resize: 'vertical' }} name="description" value={formData.description} onChange={handleChangeDetails} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label className="label">Category</label>
              <select className="input-field" name="category" value={formData.category} onChange={handleChangeDetails} required>
                {categories.length === 0 && <option value="">No categories available</option>}
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Difficulty</label>
              <select className="input-field" name="difficulty" value={formData.difficulty} onChange={handleChangeDetails}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label className="label">Language</label>
              <input className="input-field" name="language" value={formData.language} onChange={handleChangeDetails} />
            </div>
            <div>
              <label className="label">Price (USD)</label>
              <input className="input-field" name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChangeDetails} />
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label className="label">Requirements (One per line)</label>
            <textarea className="input-field" style={{ height: '60px', resize: 'vertical' }} name="requirements" value={formData.requirements} onChange={handleChangeDetails} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label className="label">Learning Outcomes (One per line)</label>
            <textarea className="input-field" style={{ height: '60px', resize: 'vertical' }} name="learning_outcomes" value={formData.learning_outcomes} onChange={handleChangeDetails} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px', background: 'var(--bg-primary)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
             <div>
              <label className="label">Thumbnail Image (Upload new to replace)</label>
              <input type="file" className="input-field" name="thumbnail" accept="image/*" onChange={handleChangeDetails} style={{ padding: '9px' }} />
             </div>
             <div>
              <label className="label">Preview Video (Upload new to replace)</label>
              <input type="file" className="input-field" name="preview_video" accept="video/*" onChange={handleChangeDetails} style={{ padding: '9px' }} />
             </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <button type="submit" className="btn-primary" disabled={savingDetails}>{savingDetails ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CourseManage;
