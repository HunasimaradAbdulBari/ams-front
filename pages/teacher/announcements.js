import { useState, useEffect } from 'react';
import PrivateRoute from '../../components/auth/PrivateRoute';
import Layout from '../../components/layout/Layout';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function TeacherAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'both',
    class: '10',
    section: 'A'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data.data);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/announcements', formData);
      alert('Announcement created successfully!');
      setShowForm(false);
      setFormData({
        title: '',
        content: '',
        targetAudience: 'both',
        class: '10',
        section: 'A'
      });
      fetchAnnouncements();
    } catch (error) {
      console.error('Failed to create announcement:', error);
      alert('Failed to create announcement. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await api.delete(`/announcements/${id}`);
      alert('Announcement deleted successfully!');
      fetchAnnouncements();
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      alert('Failed to delete announcement.');
    }
  };

  return (
    <PrivateRoute allowedRoles={['teacher']}>
      <Layout>
        <div>
          <div className="page-header">
            <h1 className="animated-heading">Announcements</h1>
            <p>Create and manage class announcements</p>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Announcements</h3>
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancel' : 'Create New'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Target Audience</label>
                    <select
                      className="form-select"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                    >
                      <option value="students">Students Only</option>
                      <option value="parents">Parents Only</option>
                      <option value="both">Both Students & Parents</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Class</label>
                    <select
                      className="form-select"
                      value={formData.class}
                      onChange={(e) => setFormData({...formData, class: e.target.value})}
                    >
                      <option value="10">Class 10</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Section</label>
                    <select
                      className="form-select"
                      value={formData.section}
                      onChange={(e) => setFormData({...formData, section: e.target.value})}
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Content</label>
                  <textarea
                    className="form-textarea"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    required
                    rows="4"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? <LoadingSpinner /> : 'Create Announcement'}
                </button>
              </form>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <div className="announcements-list">
                {announcements.map(announcement => (
                  <div key={announcement._id} className="card" style={{ marginBottom: '1rem' }}>
                    <div className="card-header">
                      <h4>{announcement.title}</h4>
                      <div>
                        <span className={`badge badge-info`} style={{ marginRight: '0.5rem' }}>
                          {announcement.targetAudience}
                        </span>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(announcement._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p>{announcement.content}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                      <small>Class {announcement.class}{announcement.section}</small>
                      <small>{new Date(announcement.createdAt).toLocaleDateString()}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </PrivateRoute>
  );
}