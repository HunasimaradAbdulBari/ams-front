import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import { gsap } from 'gsap';
import styles from '../../styles/Layout.module.css';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo('.layout-content', 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  if (!user) return null;

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
