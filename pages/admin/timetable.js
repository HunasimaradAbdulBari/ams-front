import { useState, useEffect } from 'react';
import PrivateRoute from '../../components/auth/PrivateRoute';
import Layout from '../../components/layout/Layout';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminTimetablePage() {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    try {
      const response = await api.get('/timetable');
      setTimetables(response.data.data);
    } catch (error) {
      console.error('Failed to fetch timetables:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateRoute allowedRoles={['admin']}>
      <Layout>
        <div>
          <div className="page-header">
            <h1 className="animated-heading">Timetable Management</h1>
            <p>Manage class schedules and timetables</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <div className="grid">
              {timetables.map(timetable => (
                <div key={timetable._id} className="card">
                  <div className="card-header">
                    <h3 className="card-title">
                      Class {timetable.class} - Section {timetable.section}
                    </h3>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Day</th>
                          <th>Periods</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timetable.schedule.map(day => (
                          <tr key={day.day}>
                            <td><strong>{day.day}</strong></td>
                            <td>
                              {day.periods.map(period => (
                                <div key={period.period} style={{ marginBottom: '0.5rem' }}>
                                  <strong>Period {period.period}:</strong> {period.subject} 
                                  <br />
                                  <small>{period.startTime} - {period.endTime}</small>
                                </div>
                              ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </PrivateRoute>
  );
}