import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse, getCategories } from '../api/courses';

const CourseCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: '',
    difficulty: 'beginner',
    language: 'English',
    price: '0.00',
    requirements: '',
    learning_outcomes: '',
    is_published: false,
  });
  
  const [files, setFiles] = useState({
    thumbnail: null,
    preview_video: null
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
        if(res.data.length > 0) {
            setFormData(prev => ({...prev, category: res.data[0].id}));
        } else {
            setError("No categories exist yet. Please ask an admin to create categories in the admin panel.");
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
        setError("Failed to load categories. Please try again later.");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files: fileList } = e.target;
    
    if (type === 'file') {
      setFiles({ ...files, [name]: fileList[0] });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!formData.category) {
        setError('Please create a category first via the admin panel.');
        setLoading(false);
        return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    if (files.thumbnail) data.append('thumbnail', files.thumbnail);
    if (files.preview_video) data.append('preview_video', files.preview_video);

    try {
      const res = await createCourse(data);
      navigate(`/courses/${res.data.id}/manage`);
    } catch (err) {
      const respData = err.response?.data;
      const msg = respData ? Object.values(respData).flat().join(' ') : 'Failed to create course';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', padding: '40px 20px', background: 'var(--bg-primary)' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '800px', border: '1px solid rgba(184, 255, 59, 0.15)', padding: '40px' }}>
        <h2 style={{ marginBottom: '32px', fontSize: '32px', fontWeight: '700' }}>Create New Course</h2>
        {error && <div style={{ backgroundColor: 'rgba(255, 71, 87, 0.1)', color: '#ff4757', padding: '12px', borderRadius: '8px', marginBottom: '24px', border: '1px solid rgba(255, 71, 87, 0.2)' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Course Title</label>
              <input className="input-field" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div>
              <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Subtitle</label>
              <input className="input-field" name="subtitle" value={formData.subtitle} onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Description</label>
            <textarea className="input-field" style={{ height: '100px', resize: 'vertical' }} name="description" value={formData.description} onChange={handleChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Category</label>
              <select className="input-field" name="category" value={formData.category} onChange={handleChange} required>
                {categories.length === 0 && <option value="">No categories available</option>}
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Difficulty</label>
              <select className="input-field" name="difficulty" value={formData.difficulty} onChange={handleChange}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Language</label>
              <input className="input-field" name="language" value={formData.language} onChange={handleChange} />
            </div>
            <div>
              <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Price (USD)</label>
              <input className="input-field" name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Requirements (One per line)</label>
            <textarea className="input-field" style={{ height: '60px', resize: 'vertical' }} name="requirements" value={formData.requirements} onChange={handleChange} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Learning Outcomes (One per line)</label>
            <textarea className="input-field" style={{ height: '60px', resize: 'vertical' }} name="learning_outcomes" value={formData.learning_outcomes} onChange={handleChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px', background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
             <div>
              <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Thumbnail Image</label>
              <input type="file" className="input-field" name="thumbnail" accept="image/*" onChange={handleChange} style={{ padding: '9px' }} />
             </div>
             <div>
              <label className="label" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Preview Video</label>
              <input type="file" className="input-field" name="preview_video" accept="video/*" onChange={handleChange} style={{ padding: '9px' }} />
             </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', background: 'rgba(184, 255, 59, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(184, 255, 59, 0.1)' }}>
            <input type="checkbox" name="is_published" id="is_published" checked={formData.is_published} onChange={handleChange} style={{ accentColor: 'var(--accent)', width: '20px', height: '20px' }} />
            <label htmlFor="is_published" style={{ marginLeft: '12px', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: '600' }}>Publish immediately</label>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button type="button" className="btn-secondary" style={{ padding: '12px 24px' }} onClick={() => navigate('/courses')}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }} disabled={loading}>{loading ? 'Creating...' : 'Save & Continue'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseCreate;