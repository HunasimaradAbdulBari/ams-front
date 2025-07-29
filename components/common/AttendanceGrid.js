import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

const AttendanceGrid = ({ students, onAttendanceChange, loading, selectedDate, subject }) => {
  const [attendanceData, setAttendanceData] = useState({});

  const handleStatusChange = (studentId, status) => {
    const newData = { ...attendanceData, [studentId]: status };
    setAttendanceData(newData);
    onAttendanceChange(newData);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="attendance-grid">
      <div className="grid-header">
        <h3>Mark Attendance</h3>
        <p>Date: {selectedDate?.toDateString()} | Subject: {subject}</p>
      </div>
      
      <div className="student-list">
        {students.map(student => (
          <div key={student._id} className="student-item card">
            <div className="student-info">
              <h4>{student.name}</h4>
              <p>ID: {student.studentId}</p>
            </div>
            <div className="status-buttons">
              <button
                className={`btn ${attendanceData[student._id] === 'present' ? 'btn-success' : 'btn-outline'}`}
                onClick={() => handleStatusChange(student._id, 'present')}
              >
                Present
              </button>
              <button
                className={`btn ${attendanceData[student._id] === 'absent' ? 'btn-danger' : 'btn-outline'}`}
                onClick={() => handleStatusChange(student._id, 'absent')}
              >
                Absent
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .attendance-grid {
          padding: 1rem;
        }
        .grid-header {
          margin-bottom: 2rem;
          text-align: center;
        }
        .student-list {
          display: grid;
          gap: 1rem;
        }
        .student-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
        }
        .student-info h4 {
          margin: 0 0 0.5rem 0;
        }
        .student-info p {
          margin: 0;
          color: var(--light-text);
        }
        .status-buttons {
          display: flex;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default AttendanceGrid;