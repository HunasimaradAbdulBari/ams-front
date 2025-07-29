import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import AttendanceChart from '../common/AttendanceChart';
import Calendar from '../common/Calendar';
import LoadingSpinner from '../common/LoadingSpinner';
import styles from '../../styles/Dashboard.module.css';

const ParentDashboard = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildrenData();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchChildAttendance(selectedChild._id);
    }
  }, [selectedChild]);

  const fetchChildrenData = async () => {
    try {
      // In a real app, you'd have a way to link parent to children
      // For demo, we'll fetch all students with matching parent email
      const response = await api.get(`/users/students`);
      const allStudents = response.data.data;
      
      // Filter students by parent email (simplified logic)
      const childrenData = allStudents.filter(student => 
        student.parentEmail === user.email
      );
      
      setChildren(childrenData);
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
      }
      
      // Fetch announcements
      const announcementsRes = await api.get('/announcements');
      setAnnouncements(announcementsRes.data.data.slice(0, 5));
      
    } catch (error) {
      console.error('Failed to fetch children data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildAttendance = async (studentId) => {
    try {
      const response = await api.get(`/attendance/student/${studentId}`);
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
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
        <h1 className="animated-heading">Parent Dashboard</h1>
        <p>Monitor your child's attendance and academic progress</p>
      </div>

      {children.length === 0 ? (
        <div className="card">
          <p>No children found. Please contact the school administration.</p>
        </div>
      ) : (
        <>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Select Child</h3>
            </div>
            <div className={styles.childSelector}>
              {children.map(child => (
                <button
                  key={child._id}
                  className={`btn ${selectedChild?._id === child._id ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setSelectedChild(child)}
                >
                  {child.name} - Class {child.class}{child.section}
                </button>
              ))}
            </div>
          </div>

          {selectedChild && attendanceData && (
            <>
              <div className="grid grid-3">
                <div className="card">
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>📊</div>
                    <div className={styles.statContent}>
                      <h3>{attendanceData.stats.attendancePercentage}%</h3>
                      <p>Attendance</p>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>✅</div>
                    <div className={styles.statContent}>
                      <h3>{attendanceData.stats.presentClasses}</h3>
                      <p>Present Days</p>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>❌</div>
                    <div className={styles.statContent}>
                      <h3>{attendanceData.stats.absentClasses}</h3>
                      <p>Absent Days</p>
                    </div>
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
                    title={`${selectedChild.name}'s Attendance`}
                  />
                </div>
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Calendar View</h3>
                  </div>
                  <Calendar attendanceData={attendanceData.data} />
                </div>
              </div>
            </>
          )}

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">School Announcements</h3>
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
        </>
      )}
      
      <style jsx>{`
        .child-selector {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
};

export default ParentDashboard;