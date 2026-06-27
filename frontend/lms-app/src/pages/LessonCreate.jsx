import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';

const LessonCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', content: '', video_url: '', order: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post(`/courses/${id}/lessons/create/`, formData);
      navigate(`/courses/${id}`);
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).flat().join(' ') : 'Failed to create lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Add New Lesson</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Lesson Title</label>
          <input style={styles.input} name="title" placeholder="e.g. Introduction to Variables" onChange={handleChange} required />

          <label style={styles.label}>Content</label>
          <textarea style={{ ...styles.input, height: '120px', resize: 'vertical' }} name="content" placeholder="Lesson content or notes..." onChange={handleChange} />

          <label style={styles.label}>Video URL</label>
          <input style={styles.input} name="video_url" type="url" placeholder="https://youtube.com/..." onChange={handleChange} />

          <label style={styles.label}>Order</label>
          <input style={styles.input} name="order" type="number" min="0" defaultValue="0" onChange={handleChange} />

          <div style={styles.btnRow}>
            <button type="button" style={styles.cancelBtn} onClick={() => navigate(`/courses/${id}`)}>Cancel</button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Saving...' : 'Add Lesson'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '40px 20px', minHeight: '100vh', background: '#f0f2f5' },
  box: { background: '#fff', padding: '40px', borderRadius: '10px', width: '100%', maxWidth: '600px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', height: 'fit-content' },
  title: { marginBottom: '24px' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' },
  input: { width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '15px' },
  btnRow: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  cancelBtn: { padding: '10px 20px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  submitBtn: { padding: '10px 24px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  error: { color: 'red', marginBottom: '16px' },
};

export default LessonCreate;