import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PrivateRoute from '../../components/auth/PrivateRoute';
import Layout from '../../components/layout/Layout';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function StudentTimetablePage() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTimetable();
    }
  }, [user]);

  const fetchTimetable = async () => {
    try {
      const response = await api.get(`/timetable?class=${user.class}&section=${user.section}`);
      setTimetable(response.data.data[0]);
    } catch (error) {
      console.error('Failed to fetch timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PrivateRoute allowedRoles={['student']}>
        <Layout>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <LoadingSpinner size="large" />
          </div>
        </Layout>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute allowedRoles={['student']}>
      <Layout>
        <div>
          <div className="page-header">
            <h1 className="animated-heading">Class Timetable</h1>
            <p>Class {user.class} - Section {user.section}</p>
          </div>

          {timetable ? (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Weekly Schedule</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Monday</th>
                      <th>Tuesday</th>
                      <th>Wednesday</th>
                      <th>Thursday</th>
                      <th>Friday</th>
                      <th>Saturday</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6].map(periodNum => {
                      const periodData = {};
                      timetable.schedule.forEach(day => {
                        const period = day.periods.find(p => p.period === periodNum);
                        if (period) {
                          periodData[day.day] = period;
                        }
                      });

                      const firstPeriod = Object.values(periodData)[0];
                      const timeSlot = firstPeriod ? `${firstPeriod.startTime} - ${firstPeriod.endTime}` : '';

                      return (
                        <tr key={periodNum}>
                          <td><strong>{timeSlot}</strong></td>
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                            <td key={day}>
                              {periodData[day] ? (
                                <div>
                                  <strong>{periodData[day].subject}</strong>
                                  <br />
                                  <small>Period {periodData[day].period}</small>
                                </div>
                              ) : (
                                <span style={{ color: 'var(--light-text)' }}>-</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="card">
              <p>No timetable available for your class.</p>
            </div>
          )}
        </div>
      </Layout>
    </PrivateRoute>
  );
}