import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import toast from 'react-hot-toast';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data.posts);
    } catch (err) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };

  return (
    <motion.div
      style={{ ...styles.container, ...(isMobile ? styles.containerMobile : {}) }}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
    >
      <div style={{ ...styles.header, ...(isMobile ? styles.headerMobile : {}) }}>
        <h1 style={{ ...styles.title, ...(isMobile ? styles.titleMobile : {}) }}>For You</h1>
      </div>

      <div style={styles.feed}>
        {loading ? (
          <div style={styles.loader}>
            <div style={styles.spinner}></div>
          </div>
        ) : posts.length > 0 ? (
          <AnimatePresence>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </AnimatePresence>
        ) : (
          <div style={styles.emptyState}>
            <h2>No posts yet.</h2>
            <p>Be the first to share something amazing!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    width: '100%',
  },
  containerMobile: {
    maxWidth: '100%',
  },
  header: {
    padding: '20px 0',
    marginBottom: '20px',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    background: 'rgba(15, 15, 19, 0.8)',
    backdropFilter: 'blur(10px)',
    zIndex: 10,
  },
  headerMobile: {
    padding: '12px 0',
    marginBottom: '14px',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
  },
  titleMobile: {
    fontSize: '1.35rem',
  },
  feed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    paddingBottom: '50px',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    padding: '50px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(138,43,226,0.3)',
    borderTopColor: '#8a2be2',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  emptyState: {
    textAlign: 'center',
    padding: '50px 20px',
    color: 'var(--text-muted)',
    background: 'var(--bg-card)',
    borderRadius: '20px',
    border: '1px solid var(--border-color)',
  },
};

export default Home;
