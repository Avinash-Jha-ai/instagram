import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiSend, FiMusic } from 'react-icons/fi';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Reels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    fetchReels();
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const fetchReels = async () => {
    try {
      const res = await api.get('/reels');
      setReels(res.data.reels);
    } catch (err) {
      toast.error('Failed to load reels');
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
      <div style={{ ...styles.reelsWrapper, ...(isMobile ? styles.reelsWrapperMobile : {}) }}>
        {loading ? (
          <div style={styles.loader}>
            <div style={styles.spinner}></div>
          </div>
        ) : reels.length > 0 ? (
          reels.map((reel) => (
            <ReelCard key={reel._id} reel={reel} />
          ))
        ) : (
          <div style={styles.emptyState}>
            <h2>No reels yet.</h2>
            <p>Upload the first one!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Extracted continuous scroll reel component
const ReelCard = ({ reel }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(e => console.log('Autoplay prevented:', e));
            setIsPlaying(true);
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 } // Play when 60% of the video is visible
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="glass-panel" style={styles.reelContainer}>
      {/* Video Content */}
      <video
        ref={videoRef}
        src={reel.video}
        style={styles.video}
        loop
        playsInline
        onClick={togglePlay}
      />
      
      {/* Overlay & Controls */}
      <div style={styles.overlay}>
        <div style={styles.bottomInfo}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
               {reel.user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h3 style={styles.username}>@{reel.user?.username}</h3>
            <button style={styles.followBtn}>Follow</button>
          </div>
          <p style={styles.title}>{reel.title}</p>
          <div style={styles.musicTrack}>
            <FiMusic size={14} className="music-icon" />
            <span className="marquee">Original Audio • {reel.user?.username}</span>
          </div>
        </div>

        {/* Side Actions */}
        <div style={styles.sideActions}>
          <div style={styles.actionItem}>
            <div style={styles.actionBtn}>
              <FiHeart size={28} />
            </div>
            <span style={styles.actionCount}>1.2K</span>
          </div>
          <div style={styles.actionItem}>
            <div style={styles.actionBtn}>
              <FiMessageCircle size={28} />
            </div>
            <span style={styles.actionCount}>342</span>
          </div>
          <div style={styles.actionItem}>
            <div style={styles.actionBtn}>
              <FiSend size={28} />
            </div>
            <span style={styles.actionCount}>Share</span>
          </div>
        </div>
      </div>
      
      {/* Add Marquee CSS animation dynamically */}
      <style>{`
        .music-icon { animation: spin 4s linear infinite; }
        .marquee { display: inline-block; white-space: nowrap; animation: scrollLeft 10s linear infinite; }
        @keyframes scrollLeft {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    height: 'calc(100vh - 40px)', // Account for padding
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden', // Hide main layout scrollbar
    paddingBottom: '20px',
  },
  containerMobile: {
    height: 'calc(100vh - 96px)',
    paddingBottom: '0',
  },
  reelsWrapper: {
    width: '100%',
    maxWidth: '400px',
    height: '100%',
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory', // Smooth snapping effect
    borderRadius: '20px',
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE/Edge
  },
  reelsWrapperMobile: {
    maxWidth: '100%',
    borderRadius: '14px',
  },
  reelContainer: {
    width: '100%',
    height: '100%', // Take full height of wrapper
    scrollSnapAlign: 'start',
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: '20px', // Space between snap points (Optional: can remove for seamless)
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    cursor: 'pointer',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 40%)',
    pointerEvents: 'none', // Let clicks passthrough to video
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: '20px',
  },
  bottomInfo: {
    flex: 1,
    pointerEvents: 'auto',
    paddingRight: '20px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    border: '2px solid white',
  },
  username: {
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  followBtn: {
    background: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '15px',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  title: {
    fontSize: '0.95rem',
    marginBottom: '10px',
    lineHeight: '1.4',
  },
  musicTrack: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255,255,255,0.2)',
    padding: '6px 12px',
    borderRadius: '20px',
    width: 'fit-content',
    maxWidth: '200px',
    overflow: 'hidden',
    fontSize: '0.85rem',
  },
  sideActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    pointerEvents: 'auto',
    alignItems: 'center',
    paddingBottom: '10px',
  },
  actionItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  actionBtn: {
    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))',
  },
  actionCount: {
    fontSize: '0.85rem',
    fontWeight: '600',
    textShadow: '0px 1px 2px rgba(0,0,0,0.8)',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
};

export default Reels;
