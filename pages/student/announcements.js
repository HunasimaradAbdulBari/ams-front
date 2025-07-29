import { useState, useEffect } from 'react';
import PrivateRoute from '../../components/auth/PrivateRoute';
import Layout from '../../components/layout/Layout';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <PrivateRoute allowedRoles={['student']}>
      <Layout>
        <div>
          <div className="page-header">
            <h1 className="animated-heading">Announcements</h1>
            <p>Stay updated with the latest school announcements</p>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Announcements</h3>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <div>
                {announcements.length === 0 ? (
                  <p>No announcements available.</p>
                ) : (
                  announcements.map(announcement => (
                    <div key={announcement._id} className="card" style={{ marginBottom: '1rem' }}>
                      <div className="card-header">
                        <h4>{announcement.title}</h4>
                        <div>
                          <span className="badge badge-info" style={{ marginRight: '0.5rem' }}>
                            {announcement.targetAudience}
                          </span>
                          <small>{new Date(announcement.createdAt).toLocaleDateString()}</small>
                        </div>
                      </div>
                      <p>{announcement.content}</p>
                      <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: 'var(--light-bg)', borderRadius: '4px' }}>
                        <small>
                          <strong>From:</strong> {announcement.teacherId?.name} | 
                          <strong> Class:</strong> {announcement.class}{announcement.section}
                        </small>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </PrivateRoute>
  );
}