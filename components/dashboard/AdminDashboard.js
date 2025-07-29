import { useState, useEffect } from 'react';
import { userService } from '../../services/user';
import LoadingSpinner from '../common/LoadingSpinner';
import styles from '../../styles/Dashboard.module.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [studentsRes, teachersRes, parentsRes] = await Promise.all([
        userService.getStudents('', ''),
        userService.getTeachers(),
        userService.getParents()
      ]);

      setStats({
        totalStudents: studentsRes.count,
        totalTeachers: teachersRes.count,
        totalParents: parentsRes.count,
        totalUsers: studentsRes.count + teachersRes.count + parentsRes.count + 1 // +1 for admin
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
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
        <h1 className="animated-heading">Admin Dashboard</h1>
        <p>Manage your school's attendance system</p>
      </div>

      <div className="grid grid-4">
        <div className="card">
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statContent}>
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👨‍🎓</div>
            <div className={styles.statContent}>
              <h3>{stats.totalStudents}</h3>
              <p>Students</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👩‍🏫</div>
            <div className={styles.statContent}>
              <h3>{stats.totalTeachers}</h3>
              <p>Teachers</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👪</div>
            <div className={styles.statContent}>
              <h3>{stats.totalParents}</h3>
              <p>Parents</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className={styles.quickActions}>
            <a href="/admin/users" className="btn btn-primary">
              Manage Users
            </a>
            <a href="/admin/timetable" className="btn btn-secondary">
              Manage Timetable
            </a>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">System Overview</h3>
          </div>
          <div className={styles.systemOverview}>
            <div className={styles.overviewItem}>
              <span>Classes: 1 (Class 10)</span>
            </div>
            <div className={styles.overviewItem}>
              <span>Sections: 3 (A, B, C)</span>
            </div>
            <div className={styles.overviewItem}>
              <span>Subjects: 5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
