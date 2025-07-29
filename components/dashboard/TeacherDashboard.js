import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import styles from '../../styles/Dashboard.module.css';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    todayAttendance: 0,
    pendingLeaves: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch basic stats
      const [studentsRes, leavesRes, timetableRes] = await Promise.all([
        api.get('/users/students'),
        api.get('/leaves'),
        api.get('/timetable')
      ]);

      setStats({
        totalStudents: studentsRes.data.count,
        totalClasses: 6, // Based on timetable periods
        todayAttendance: 0, // Would need actual calculation
        pendingLeaves: leavesRes.data.data.filter(leave => leave.status === 'pending').length
      });

      // Set upcoming classes (mock data based on timetable)
      setUpcomingClasses([
        { subject: 'Mathematics', class: '10A', time: '09:00 AM', room: 'Room 101' },
        { subject: 'Science', class: '10B', time: '10:30 AM', room: 'Lab 1' },
        { subject: 'English', class: '10C', time: '02:00 PM', room: 'Room 205' }
      ]);

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
        <p>Teacher Dashboard - Manage your classes and students</p>
      </div>

      <div className="grid grid-4">
        <div className="card">
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👨‍🎓</div>
            <div className={styles.statContent}>
              <h3>{stats.totalStudents}</h3>
              <p>Total Students</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📚</div>
            <div className={styles.statContent}>
              <h3>{stats.totalClasses}</h3>
              <p>Classes Today</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statContent}>
              <h3>{stats.todayAttendance}%</h3>
              <p>Today's Attendance</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📝</div>
            <div className={styles.statContent}>
              <h3>{stats.pendingLeaves}</h3>
              <p>Pending Leaves</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Today's Schedule</h3>
          </div>
          <div className={styles.scheduleList}>
            {upcomingClasses.map((classItem, index) => (
              <div key={index} className={styles.scheduleItem}>
                <div className={styles.scheduleTime}>{classItem.time}</div>
                <div className={styles.scheduleDetails}>
                  <h4>{classItem.subject}</h4>
                  <p>Class {classItem.class} - {classItem.room}</p>
                </div>
                <div className={styles.scheduleActions}>
                  <button className="btn btn-primary btn-sm">Mark Attendance</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className={styles.quickActions}>
            <a href="/teacher/attendance" className="btn btn-primary">
              📝 Mark Attendance
            </a>
            <a href="/teacher/announcements" className="btn btn-secondary">
              📢 Create Announcement
            </a>
            <a href="/teacher/leaves" className="btn btn-warning">
              📋 Review Leaves ({stats.pendingLeaves})
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;