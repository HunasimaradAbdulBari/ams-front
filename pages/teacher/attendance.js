import { useState, useEffect } from 'react';
import PrivateRoute from '../../components/auth/PrivateRoute';
import Layout from '../../components/layout/Layout';
import AttendanceGrid from '../../components/common/AttendanceGrid';
import { userService } from '../../services/user';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function TeacherAttendancePage() {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [selectedClass, selectedSection]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await userService.getStudents(selectedClass, selectedSection);
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (data) => {
    setAttendanceData(data);
  };

  const submitAttendance = async () => {
    if (Object.keys(attendanceData).length === 0) {
      alert('Please mark attendance for at least one student');
      return;
    }

    setSubmitting(true);
    try {
      const attendanceRecords = Object.entries(attendanceData).map(([studentId, status]) => ({
        studentId,
        status
      }));

      await api.post('/attendance', {
        attendanceData: attendanceRecords,
        subject: selectedSubject,
        class: selectedClass,
        section: selectedSection,
        date: selectedDate.toISOString().split('T')[0]
      });

      alert('Attendance marked successfully!');
      setAttendanceData({});
    } catch (error) {
      console.error('Failed to submit attendance:', error);
      alert('Failed to submit attendance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PrivateRoute allowedRoles={['teacher']}>
      <Layout>
        <div>
          <div className="page-header">
            <h1 className="animated-heading">Mark Attendance</h1>
            <p>Record student attendance for your classes</p>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Select Class & Subject</h3>
            </div>
            <div className="grid grid-4">
              <div className="form-group">
                <label className="form-label">Class</label>
                <select 
                  className="form-select" 
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="10">Class 10</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Section</label>
                <select 
                  className="form-select" 
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select 
                  className="form-select" 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <AttendanceGrid
              students={students}
              onAttendanceChange={handleAttendanceChange}
              loading={loading}
              selectedDate={selectedDate}
              subject={selectedSubject}
            />
            
            {students.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                  className="btn btn-primary"
                  onClick={submitAttendance}
                  disabled={submitting || Object.keys(attendanceData).length === 0}
                  style={{ minWidth: '200px' }}
                >
                  {submitting ? <LoadingSpinner /> : 'Submit Attendance'}
                </button>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </PrivateRoute>
  );
}
