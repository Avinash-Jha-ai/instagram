import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.username, formData.password);
      } else {
        await register(formData.username, formData.password);
      }
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors) {
        // Express validator errors
        setError(err.response.data.errors[0].msg);
      } else {
        setError(err.response?.data?.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  return (
    <div style={{ ...styles.container, ...(isMobile ? styles.containerMobile : {}) }}>
      <motion.div
        className="glass-panel"
        style={{ ...styles.card, ...(isMobile ? styles.cardMobile : {}) }}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div style={styles.logoContainer}>
          <div style={styles.glowOrb}></div>
          <h1 style={styles.title}>Instagram</h1>
        </div>

        <h2 style={{ ...styles.subtitle, ...(isMobile ? styles.subtitleMobile : {}) }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              className="input-glass"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="password"
              className="input-glass"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? <span style={styles.spinner}></span> : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div style={styles.toggleContainer}>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button
            style={styles.toggleBtn}
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  containerMobile: {
    alignItems: 'flex-start',
    paddingTop: '40px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '40px 30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  cardMobile: {
    padding: '26px 18px',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: '30px',
  },
  glowOrb: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100px',
    height: '100px',
    background: 'var(--primary)',
    filter: 'blur(50px)',
    opacity: 0.5,
    zIndex: 0,
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #8a2be2, #ff007f)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    position: 'relative',
    zIndex: 1,
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'var(--text-muted)',
    marginBottom: '30px',
  },
  subtitleMobile: {
    fontSize: '1rem',
    marginBottom: '20px',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    width: '100%',
  },
  submitBtn: {
    width: '100%',
    marginTop: '10px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.1rem',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  toggleContainer: {
    marginTop: '30px',
    display: 'flex',
    gap: '8px',
    fontSize: '0.9rem',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-main)',
    fontWeight: 'bold',
    cursor: 'pointer',
    position: 'relative',
    padding: '0 4px',
  },
  error: {
    width: '100%',
    padding: '12px',
    background: 'rgba(255, 68, 68, 0.1)',
    border: '1px solid rgba(255, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#ff4444',
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
};

export default Auth;
