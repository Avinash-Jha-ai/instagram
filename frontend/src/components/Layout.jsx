import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiHome, FiFilm, FiPlusSquare, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Layout = () => {
  const { logout, profile } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <FiHome size={24} /> },
    { name: 'Reels', path: '/reels', icon: <FiFilm size={24} /> },
    { name: 'Create', path: '/create', icon: <FiPlusSquare size={24} /> },
    { name: 'Profile', path: '/profile', icon: <FiUser size={24} /> },
  ];

  return (
    <div style={styles.container}>
      {/* Desktop Sidebar */}
      {!isMobile && (
      <nav className="glass-panel" style={styles.sidebar}>
        <div style={styles.logo}>
          <span style={styles.logoText}>Instagram</span>
        </div>

        <ul style={styles.navLinks}>
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {}),
                })}
              >
                {item.icon}
                <span style={styles.navText}>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div style={styles.userSection}>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            <FiLogOut size={24} />
            <span style={styles.navText}>Logout</span>
          </button>
        </div>
      </nav>
      )}

      {/* Main Content Area */}
      <main style={{ ...styles.mainContent, ...(isMobile ? styles.mainContentMobile : {}) }}>
        <Outlet />
      </main>

      {/* Mobile Bottom Bar */}
      {isMobile && (
      <nav className="glass-panel" style={styles.bottomBar}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.mobileNavItem,
              ...(isActive ? { color: 'var(--primary)' } : {}),
            })}
          >
            {item.icon}
          </NavLink>
        ))}
      </nav>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    position: 'relative',
  },
  sidebar: {
    width: '280px',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    padding: '30px 20px',
    zIndex: 100,
    borderRight: '1px solid var(--border-color)',
    borderRadius: '0',
  },
  logo: {
    marginBottom: '50px',
    padding: '0 15px',
  },
  logoText: {
    fontSize: '2rem',
    fontWeight: 'bold',
    background: 'linear-gradient(to right, var(--primary), var(--secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontFamily: '"Outfit", sans-serif',
  },
  navLinks: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '12px 15px',
    borderRadius: '12px',
    color: 'var(--text-main)',
    transition: 'all 0.3s ease',
  },
  navItemActive: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'var(--primary)',
    boxShadow: 'inset 4px 0 0 var(--primary)',
  },
  navText: {
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  userSection: {
    marginTop: 'auto',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    width: '100%',
    padding: '12px 15px',
    background: 'transparent',
    border: 'none',
    color: '#ff4444',
    cursor: 'pointer',
    borderRadius: '12px',
    transition: 'background 0.3s',
  },
  mainContent: {
    flex: 1,
    marginLeft: '280px',
    padding: '40px',
    paddingBottom: '40px',
    minHeight: '100vh',
  },
  mainContentMobile: {
    marginLeft: 0,
    padding: '16px',
    paddingBottom: 'calc(92px + env(safe-area-inset-bottom))',
  },
  bottomBar: {
    display: 'flex',
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '72px',
    padding: '0 8px env(safe-area-inset-bottom)',
    borderTop: '1px solid var(--border-color)',
    zIndex: 100,
    borderRadius: '0',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    background: 'rgba(20, 20, 25, 0.95)',
    backdropFilter: 'blur(14px)',
  },
  mobileNavItem: {
    color: 'var(--text-muted)',
    flex: 1,
    height: '100%',
    padding: '10px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
  },
};

export default Layout;
