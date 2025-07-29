import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/Layout.module.css';

const Header = ({ user, sidebarOpen, setSidebarOpen }) => {
  const { logout } = useAuth();
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button
          className={styles.hamburger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className={styles.logo}>
          Attendance Management System
        </h1>
      </div>
      
      <div className={styles.headerRight}>
        <div className={styles.userInfo}>
          <span className={styles.welcomeText}>
            Welcome, <strong>{user.name}</strong>
          </span>
          <span className={styles.userRole}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </div>
        
        <div className={styles.headerActions}>
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <button
            className={styles.logoutBtn}
            onClick={logout}
            aria-label="Logout"
          >
            <img src="/icons/logout.svg" alt="Logout" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
