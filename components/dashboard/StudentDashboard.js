import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import AttendanceChart from '../common/AttendanceChart';
import ProgressBar from '../common/ProgressBar';
import Calendar from '../common/Calendar';
import LoadingSpinner from '../common/LoadingSpinner';
import styles from '../../styles/Dashboard.module.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [attendanceRes, announcementsRes, holidaysRes] = await Promise.all([
        api.get(`/attendance/student/${user.id}`),
        api.get('/announcements'),
        api.get('/holidays')
      ]);

      setAttendanceData(attendanceRes.data);
      setAnnouncements(announcementsRes.data.data.slice(0, 5));
      setHolidays(holidaysRes.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className="page-header">
        <h1 className="animated-heading">Welcome {user.name}</h1>
        <p>Class {user.class} - Section {user.section}</p>
      </div>

      <div className="grid grid-3">
        <div className="card">
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statContent}>
              <h3>{attendanceData?.stats.attendancePercentage || 0}%</h3>
              <p>Overall Attendance</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statContent}>
              <h3>{attendanceData?.stats.presentClasses || 0}</h3>
              <p>Present Days</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className={styles.statCard}>
            <div className={styles.statIcon}>❌</div>
            <div className={styles.statContent}>
              <h3>{attendanceData?.stats.absentClasses || 0}</h3>
              <p>Absent Days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          {attendanceData && (
            <AttendanceChart
              data={{
                present: attendanceData.stats.presentClasses,
                absent: attendanceData.stats.absentClasses
              }}
              title="Attendance Overview"
            />
          )}
        </div>

        <div className="card">
          {attendanceData && (
            <ProgressBar
              percentage={attendanceData.stats.attendancePercentage}
              title="Attendance Progress"
            />
          )}
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Announcements</h3>
          </div>
          <div className={styles.announcementsList}>
            {announcements.length > 0 ? (
              announcements.map(announcement => (
                <div key={announcement._id} className={styles.announcementItem}>
                  <h4>{announcement.title}</h4>
                  <p>{announcement.content.substring(0, 100)}...</p>
                  <small>{new Date(announcement.createdAt).toLocaleDateString()}</small>
                </div>
              ))
            ) : (
              <p>No announcements available</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Calendar</h3>
          </div>
          <Calendar
            holidays={holidays}
            attendanceData={attendanceData?.data || []}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
