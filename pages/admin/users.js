import { useState, useEffect } from 'react';
import PrivateRoute from '../../components/auth/PrivateRoute';
import Layout from '../../components/layout/Layout';
import { userService } from '../../services/user';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    filter === 'all' || user.role === filter
  );

  return (
    <PrivateRoute allowedRoles={['admin']}>
      <Layout>
        <div>
          <div className="page-header">
            <h1 className="animated-heading">User Management</h1>
            <p>Manage all system users</p>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Users</h3>
              <div>
                <select 
                  className="form-select" 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="all">All Users</option>
                  <option value="admin">Admins</option>
                  <option value="teacher">Teachers</option>
                  <option value="student">Students</option>
                  <option value="parent">Parents</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>ID</th>
                      <th>Class/Subject</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge badge-${user.role === 'admin' ? 'danger' : user.role === 'teacher' ? 'warning' : 'info'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{user.studentId || user.teacherId || user.parentId || 'N/A'}</td>
                        <td>
                          {user.role === 'student' 
                            ? `${user.class}${user.section}` 
                            : user.role === 'teacher' 
                            ? user.subjects?.join(', ') 
                            : 'N/A'
                          }
                        </td>
                        <td>
                          <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </PrivateRoute>
  );
}