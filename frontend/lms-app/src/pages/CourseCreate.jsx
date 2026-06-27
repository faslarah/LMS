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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '800px' }}>
        <h2 style={{ marginBottom: '32px', fontSize: '28px' }}>Create New Course</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label className="label">Course Title</label>
              <input className="input-field" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Subtitle</label>
              <input className="input-field" name="subtitle" value={formData.subtitle} onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="label">Description</label>
            <textarea className="input-field" style={{ height: '100px', resize: 'vertical' }} name="description" value={formData.description} onChange={handleChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label className="label">Category</label>
              <select className="input-field" name="category" value={formData.category} onChange={handleChange} required>
                {categories.length === 0 && <option value="">No categories available</option>}
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Difficulty</label>
              <select className="input-field" name="difficulty" value={formData.difficulty} onChange={handleChange}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label className="label">Language</label>
              <input className="input-field" name="language" value={formData.language} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Price (USD)</label>
              <input className="input-field" name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="label">Requirements (One per line)</label>
            <textarea className="input-field" style={{ height: '60px', resize: 'vertical' }} name="requirements" value={formData.requirements} onChange={handleChange} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="label">Learning Outcomes (One per line)</label>
            <textarea className="input-field" style={{ height: '60px', resize: 'vertical' }} name="learning_outcomes" value={formData.learning_outcomes} onChange={handleChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px', background: 'var(--bg-primary)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
             <div>
              <label className="label">Thumbnail Image</label>
              <input type="file" className="input-field" name="thumbnail" accept="image/*" onChange={handleChange} style={{ padding: '9px' }} />
             </div>
             <div>
              <label className="label">Preview Video</label>
              <input type="file" className="input-field" name="preview_video" accept="video/*" onChange={handleChange} style={{ padding: '9px' }} />
             </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <input type="checkbox" name="is_published" id="is_published" checked={formData.is_published} onChange={handleChange} style={{ accentColor: 'var(--accent)', width: '18px', height: '18px' }} />
            <label htmlFor="is_published" style={{ marginLeft: '10px', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: '500' }}>Publish immediately</label>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <button type="button" className="btn-secondary" onClick={() => navigate('/courses')}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Save & Continue'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseCreate;