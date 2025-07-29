import { useRouter } from 'next/router';
import Link from 'next/link';
import { getRoleRoutes } from '../../utils/roles';
import styles from '../../styles/Layout.module.css';

const Sidebar = ({ user, isOpen, onClose }) => {
  const router = useRouter();
  const routes = getRoleRoutes(user.role);

  return (
    <>
      {isOpen && <div className={styles.sidebarOverlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <nav className={styles.sidebarNav}>
          <ul className={styles.navList}>
            {routes.map((route) => (
              <li key={route.path} className={styles.navItem}>
                <Link href={route.path}>
                  <a
                    className={`${styles.navLink} ${
                      router.pathname === route.path ? styles.navLinkActive : ''
                    }`}
                    onClick={onClose}
                  >
                    <img
                      src={`/icons/${route.icon}.svg`}
                      alt={route.name}
                      className={styles.navIcon}
                    />
                    <span>{route.name}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
