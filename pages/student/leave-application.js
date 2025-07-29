import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PrivateRoute from '../../components/auth/PrivateRoute';
import Layout from '../../components/layout/Layout';
import api from '../../services/api';
import { userService } from '../../services/user';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function StudentLeaveApplicationPage() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    teacherId: '',
    subject: 'Mathematics',
    reason: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teachersRes, leavesRes] = await Promise.all([
        userService.getTeachers(),
        api.get('/leaves')
      ]);
      
      setTeachers(teachersRes.data);
      setLeaves(leavesRes.data.data || leavesRes.data); // Handle different response structures
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Add user-friendly error handling
      alert('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Add form validation
    if (!formData.teacherId || !formData.reason || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields.');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('End date must be after start date.');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/leaves', formData);
      alert('Leave application submitted successfully!');
      setShowForm(false);
      setFormData({
        teacherId: '',
        subject: 'Mathematics',
        reason: '',
        startDate: '',
        endDate: ''
      });
      fetchData();
    } catch (error) {
      console.error('Failed to submit leave application:', error);
      alert('Failed to submit leave application. Please try again.');
    } finally {
      setSubmitting(false);
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

  // MAIN RETURN - This was missing in your code
  return (
    <PrivateRoute allowedRoles={['student']}>
      <Layout>
        <div className="student-leave-page">
          <div className="page-header">
            <h1>Leave Applications</h1>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="btn btn-primary"
            >
              {showForm ? 'Cancel' : 'New Application'}
            </button>
          </div>

          {showForm && (
            <div className="leave-form-container">
              <h2>Submit Leave Application</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Teacher:</label>
                  <select 
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(teacher => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Subject:</label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Reason:</label>
                  <textarea 
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                    rows="4"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date:</label>
                    <input 
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>End Date:</label>
                    <input 
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn btn-success"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </div>
          )}

          <div className="leaves-list">
            <h2>My Leave Applications</h2>
            {leaves.length === 0 ? (
              <p>No leave applications found.</p>
            ) : (
              <div className="leaves-grid">
                {leaves.map(leave => (
                  <div key={leave._id} className="leave-card">
                    <div className="leave-header">
                      <span className={`status ${leave.status}`}>
                        {leave.status}
                      </span>
                      <span className="date">
                        {new Date(leave.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p><strong>Subject:</strong> {leave.subject}</p>
                    <p><strong>Reason:</strong> {leave.reason}</p>
                    <p><strong>Duration:</strong> {leave.startDate} to {leave.endDate}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </PrivateRoute>
  );
}
