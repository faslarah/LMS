import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse, createSection, updateSection, deleteSection, updateCoursePartial, getCategories } from '../api/courses';

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

  // States for new section form
  const [showAddSection, setShowAddSection] = useState(false);
  const [sectionData, setSectionData] = useState({ title: '', description: '', duration: '' });
  const [sectionFiles, setSectionFiles] = useState({ video_file: null, thumbnail: null });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [savingSection, setSavingSection] = useState(false);
  const [sectionUploadProgress, setSectionUploadProgress] = useState({});

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

  const handleSectionChange = (e) => {
    const { name, value, type, files: fileList } = e.target;
    if (type === 'file') {
      setSectionFiles({ ...sectionFiles, [name]: fileList[0] });
    } else {
      setSectionData({ ...sectionData, [name]: value });
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!sectionData.title) return;
    setSavingSection(true);
    try {
      const data = new FormData();
      data.append('course', id);
      data.append('title', sectionData.title);
      data.append('description', sectionData.description);
      data.append('duration', sectionData.duration || 0);
      data.append('order', course.sections?.length || 0);
      
      if (sectionFiles.video_file) data.append('video_file', sectionFiles.video_file);
      if (sectionFiles.thumbnail) data.append('thumbnail', sectionFiles.thumbnail);

      const config = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      };

      await createSection(data, config);
      
      setSectionData({ title: '', description: '', duration: '' });
      setSectionFiles({ video_file: null, thumbnail: null });
      setShowAddSection(false);
      setUploadProgress(0);
      fetchCourse();
    } catch (err) {
      console.error("Failed to add section");
      setUploadProgress(0);
    } finally {
      setSavingSection(false);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm("Are you sure you want to delete this section? This will delete the video permanently.")) return;
    try {
      await deleteSection(sectionId);
      fetchCourse();
    } catch (err) {
      console.error("Failed to delete section", err);
    }
  };

  const handleUpdateSectionVideo = async (sectionId, e) => {
    e.preventDefault();
    const file = e.target.elements.video.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('video_file', file);

    try {
      const config = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setSectionUploadProgress(prev => ({ ...prev, [sectionId]: percentCompleted }));
      };
      
      await updateSection(sectionId, data, config);
      setSectionUploadProgress(prev => ({ ...prev, [sectionId]: 0 }));
      alert("Video uploaded successfully!");
      fetchCourse();
    } catch (err) {
      console.error("Failed to upload video", err);
      alert("Failed to upload video. Please try again.");
      setSectionUploadProgress(prev => ({ ...prev, [sectionId]: 0 }));
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
          <div key={section.id} className="glass-card" style={{ padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Section {section.order + 1}: {section.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>Duration: {section.duration} min</p>
              </div>
              <button onClick={() => handleDeleteSection(section.id)} className="btn-secondary" style={{ color: '#ff4757', borderColor: 'rgba(255,71,87,0.3)', padding: '6px 12px', fontSize: '12px' }}>Delete Section</button>
            </div>
            
            {section.description && (
              <div style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                {section.description}
              </div>
            )}
            
            {section.video_file ? (
              <div style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Video Preview:</p>
                <video src={section.video_file} controls poster={section.thumbnail} style={{ width: '100%', maxHeight: '400px', borderRadius: '8px', backgroundColor: '#000' }} />
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: '#ff4757', marginTop: '16px' }}>No video uploaded for this section.</p>
            )}

            <form onSubmit={(e) => handleUpdateSectionVideo(section.id, e)} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <label style={{ fontSize: '14px', fontWeight: '600' }}>{section.video_file ? 'Replace Video' : 'Upload Video'}</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input type="file" name="video" accept="video/*" className="input-field" style={{ padding: '8px', flex: 1 }} required />
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>Upload</button>
              </div>
              {sectionUploadProgress[section.id] > 0 && (
                <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden', marginTop: '8px' }}>
                  <div style={{ width: `${sectionUploadProgress[section.id]}%`, backgroundColor: 'var(--accent)', height: '100%', transition: 'width 0.2s' }}></div>
                </div>
              )}
            </form>
          </div>
        ))}

        {/* Add Section Form */}
        {showAddSection ? (
          <form onSubmit={handleAddSection} className="glass-card" style={{ padding: '24px', border: '1px solid rgba(184, 255, 59, 0.3)' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>Add New Section</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
              <div>
                <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Section Title *</label>
                <input className="input-field" name="title" value={sectionData.title} onChange={handleSectionChange} required />
              </div>
              <div>
                <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Duration (minutes)</label>
                <input type="number" step="0.1" min="0" className="input-field" name="duration" value={sectionData.duration} onChange={handleSectionChange} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Description</label>
              <textarea className="input-field" name="description" value={sectionData.description} onChange={handleSectionChange} style={{ height: '80px', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Video File</label>
                <input type="file" accept="video/*" name="video_file" onChange={handleSectionChange} className="input-field" style={{ padding: '9px' }} />
              </div>
              <div>
                <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Thumbnail (Optional)</label>
                <input type="file" accept="image/*" name="thumbnail" onChange={handleSectionChange} className="input-field" style={{ padding: '9px' }} />
              </div>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden', marginBottom: '20px' }}>
                <div style={{ width: `${uploadProgress}%`, backgroundColor: 'var(--accent)', height: '100%', transition: 'width 0.2s' }}></div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowAddSection(false)} className="btn-secondary" disabled={savingSection}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={savingSection}>
                {savingSection ? 'Uploading...' : 'Save Section'}
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setShowAddSection(true)} 
            style={{ width: '100%', padding: '16px', background: 'transparent', border: '1px dashed rgba(255, 255, 255, 0.2)', borderRadius: '12px', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s', fontSize: '16px' }} 
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(198, 241, 44, 0.05)' }} 
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent' }}
          >
            + Add New Section (Video)
          </button>
        )}
      </div>
      ) : (
        <form onSubmit={handleSaveDetails} className="glass-card" style={{ padding: '40px', border: '1px solid rgba(184, 255, 59, 0.15)' }}>
          {/* Details tab remains the same */}
          <h3 style={{ fontSize: '24px', marginBottom: '24px' }}>Edit Course Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Course Title</label>
              <input className="input-field" name="title" value={formData.title} onChange={handleChangeDetails} required />
            </div>
            <div>
              <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Subtitle</label>
              <input className="input-field" name="subtitle" value={formData.subtitle} onChange={handleChangeDetails} />
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Description</label>
            <textarea className="input-field" style={{ height: '100px', resize: 'vertical' }} name="description" value={formData.description} onChange={handleChangeDetails} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Category</label>
              <select className="input-field" name="category" value={formData.category} onChange={handleChangeDetails} required>
                {categories.length === 0 && <option value="">No categories available</option>}
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Difficulty</label>
              <select className="input-field" name="difficulty" value={formData.difficulty} onChange={handleChangeDetails}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Language</label>
              <input className="input-field" name="language" value={formData.language} onChange={handleChangeDetails} />
            </div>
            <div>
              <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Price (USD)</label>
              <input className="input-field" name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChangeDetails} />
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Requirements (One per line)</label>
            <textarea className="input-field" style={{ height: '60px', resize: 'vertical' }} name="requirements" value={formData.requirements} onChange={handleChangeDetails} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Learning Outcomes (One per line)</label>
            <textarea className="input-field" style={{ height: '60px', resize: 'vertical' }} name="learning_outcomes" value={formData.learning_outcomes} onChange={handleChangeDetails} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px', background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
             <div>
              <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Thumbnail Image (Upload new to replace)</label>
              <input type="file" className="input-field" name="thumbnail" accept="image/*" onChange={handleChangeDetails} style={{ padding: '9px' }} />
             </div>
             <div>
              <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Preview Video (Upload new to replace)</label>
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
