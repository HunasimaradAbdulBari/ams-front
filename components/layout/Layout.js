import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import Sidebar from './sidebar';
import { gsap } from 'gsap';
import styles from '../../styles/Layout.module.css';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Add null check and ensure DOM is ready
    const element = document.querySelector('.layout-content');
    if (element) {
      gsap.fromTo(element, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  // Add loading state instead of returning null immediately
  if (!user) {
    return (
      <div className={styles.loadingContainer}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Header 
        user={user} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className={styles.layoutBody}>
        <Sidebar 
          user={user}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className={`${styles.mainContent} layout-content`}>
          <div className={styles.contentWrapper}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
