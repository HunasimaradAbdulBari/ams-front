import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PrivateRoute from '../../components/auth/PrivateRoute';
import Layout from '../../components/layout/Layout';
import AttendanceChart from '../../components/common/AttendanceChart';
import Calendar from '../../components/common/Calendar';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function StudentAttendancePage() {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography'];

  useEffect(() => {
    if (user) {
      fetchAttendance();
    }
  }, [user, selectedSubject, dateRange]);

  const fetchAttendance = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedSubject !== 'all') {
        params.append('subject', selectedSubject);
      }
      params.append('startDate', dateRange.startDate);
      params.append('endDate', dateRange.endDate);

      const response = await api.get(`/attendance/student/${user.id}?${params}`);
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
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
            <h1 className="animated-heading">My Attendance</h1>
            <p>View your attendance records and statistics</p>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Filters</h3>
            </div>
            <div className="grid grid-3">
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select
                  className="form-select"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                />
              </div>
            </div>
          </div>

          {attendanceData && (
            <>
              <div className="grid grid-3">
                <div className="card">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                    <h3>{attendanceData.stats.attendancePercentage}%</h3>
                    <p>Attendance Rate</p>
                  </div>
                </div>
                <div className="card">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                    <h3>{attendanceData.stats.presentClasses}</h3>
                    <p>Present Days</p>
                  </div>
                </div>
                <div className="card">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❌</div>
                    <h3>{attendanceData.stats.absentClasses}</h3>
                    <p>Absent Days</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-2">
                <div className="card">
                  <AttendanceChart
                    data={{
                      present: attendanceData.stats.presentClasses,
                      absent: attendanceData.stats.absentClasses
                    }}
                    title="Attendance Overview"
                  />
                </div>
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Calendar View</h3>
                  </div>
                  <Calendar attendanceData={attendanceData.data} />
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Attendance Records</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Teacher</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.data.map(record => (
                        <tr key={record._id}>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td>{record.subject}</td>
                          <td>
                            <span className={`badge ${record.status === 'present' ? 'badge-success' : 'badge-danger'}`}>
                              {record.status.toUpperCase()}
                            </span>
                          </td>
                          <td>{record.teacherId?.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </Layout>
    </PrivateRoute>
  );
}