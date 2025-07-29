import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import styles from '../../styles/Form.module.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Pre-filled credentials for easy testing
  const testCredentials = {
    admin: { email: 'adminalfa@gmail.com', password: 'admin123' },
    teacher: { email: 'teacher1@school.com', password: 'teacher123' },
    student: { email: 'student1@school.com', password: 'student123' },
    parent: { email: 'parent1@gmail.com', password: 'parent123' }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...testCredentials[role],
      role
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1 className="animated-heading">Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <div className={styles.roleSelector}>
          <h3>Select Role for Quick Login:</h3>
          <div className={styles.roleButtons}>
            {Object.keys(testCredentials).map(role => (
              <button
                key={role}
                type="button"
                className={`${styles.roleBtn} ${formData.role === role ? styles.roleBtnActive : ''}`}
                onClick={() => handleRoleChange(role)}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? <LoadingSpinner /> : 'Sign In'}
          </button>
        </form>

        <div className={styles.testCredentials}>
          <h4>Test Credentials:</h4>
          <div className={styles.credentialsList}>
            <div><strong>Admin:</strong> adminalfa@gmail.com / admin123</div>
            <div><strong>Teacher:</strong> teacher1@school.com / teacher123</div>
            <div><strong>Student:</strong> student1@school.com / student123</div>
            <div><strong>Parent:</strong> parent1@gmail.com / parent123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
