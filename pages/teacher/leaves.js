import { useState, useEffect } from 'react';
import PrivateRoute from '../../components/auth/PrivateRoute';
import Layout from '../../components/layout/Layout';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function TeacherLeavesPage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await api.get('/leaves');
      setLeaves(response.data.data);
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveStatus = async (leaveId, status, remarks = '') => {
    try {
      await api.put(`/leaves/${leaveId}`, {
        status,
        teacherRemarks: remarks
      });
      alert(`Leave ${status} successfully!`);
      fetchLeaves();
    } catch (error) {
      console.error('Failed to update leave:', error);
      alert('Failed to update leave status.');
    }
  };

  const handleStatusUpdate = (leave, status) => {
    let remarks = '';
    if (status === 'rejected') {
      remarks = prompt('Please provide a reason for rejection:');
      if (!remarks) return;
    }
    updateLeaveStatus(leave._id, status, remarks);
  };

  return (
    <PrivateRoute allowedRoles={['teacher']}>
      <Layout>
        <div>
          <div className="page-header">
            <h1 className="animated-heading">Leave Requests</h1>
            <p>Review and manage student leave applications</p>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Leave Applications</h3>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <div className="leaves-list">
                {leaves.length === 0 ? (
                  <p>No leave applications found.</p>
                ) : (
                  leaves.map(leave => (
                    <div key={leave._id} className="card" style={{ marginBottom: '1rem' }}>
                      <div className="card-header">
                        <div>
                          <h4>{leave.studentId?.name}</h4>
                          <p>Class {leave.studentId?.class}{leave.studentId?.section} - ID: {leave.studentId?.studentId}</p>
                        </div>
                        <span className={`badge ${
                          leave.status === 'approved' ? 'badge-success' :
                          leave.status === 'rejected' ? 'badge-danger' : 'badge-warning'
                        }`}>
                          {leave.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid grid-2">
                        <div>
                          <p><strong>Subject:</strong> {leave.subject}</p>
                          <p><strong>Reason:</strong> {leave.reason}</p>
                          {leave.teacherRemarks && (
                            <p><strong>Teacher Remarks:</strong> {leave.teacherRemarks}</p>
                          )}
                        </div>
                        <div>
                          <p><strong>Start Date:</strong> {new Date(leave.startDate).toLocaleDateString()}</p>
                          <p><strong>End Date:</strong> {new Date(leave.endDate).toLocaleDateString()}</p>
                          <p><strong>Applied On:</strong> {new Date(leave.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {leave.status === 'pending' && (
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                          <button
                            className="btn btn-success"
                            onClick={() => handleStatusUpdate(leave, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleStatusUpdate(leave, 'rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      )}
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
