import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiSend, FiMusic, FiX } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
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
  const { user } = useAuth();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [likesCount, setLikesCount] = useState(reel.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(reel.likes?.includes(user?.id));
  const [sharesCount, setSharesCount] = useState(reel.sharesCount || 0);
  
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(reel.comments || []);
  const [commentText, setCommentText] = useState('');

  // We roughly assume follows based on user.following list if available, else keep generic state for demo
  const [isFollowing, setIsFollowing] = useState(false);

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

  const handleLike = async () => {
    if (!user) return toast.error("Please login first");
    try {
      if (isLiked) {
        setLikesCount(prev => prev - 1);
        setIsLiked(false);
        await api.delete(`/reels/${reel._id}/like`);
      } else {
        setLikesCount(prev => prev + 1);
        setIsLiked(true);
        await api.post(`/reels/${reel._id}/like`);
      }
    } catch (err) {
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount + 1 : likesCount - 1);
    }
  };

  const handleShare = async () => {
    if (!user) return toast.error("Please login first");
    try {
      await api.post(`/reels/${reel._id}/share`);
      setSharesCount(prev => prev + 1);
      toast.success('Reel shared!');
    } catch (err) {
      toast.error('Share failed');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login first");
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/reels/${reel._id}/comments`, { text: commentText });
      setComments(res.data.comments);
      setCommentText('');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const handleFollow = async () => {
    if (!user) return toast.error("Please login first");
    if (reel.user?._id === user.id) return;
    try {
      if (isFollowing) {
        await api.delete(`/profile/follow/${reel.user._id}`);
        setIsFollowing(false);
      } else {
        await api.post(`/profile/follow/${reel.user._id}`);
        setIsFollowing(true);
      }
    } catch (err) {
      toast.error('Action failed');
    }
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
             {user && reel.user?._id !== user.id && (
               <button 
                 style={{...styles.followBtn, background: isFollowing ? 'rgba(255,255,255,0.2)' : 'transparent'}}
                 onClick={handleFollow}
               >
                 {isFollowing ? 'Following' : 'Follow'}
               </button>
             )}
          </div>
          <p style={styles.title}>{reel.title}</p>
          <div style={styles.musicTrack}>
            <FiMusic size={14} className="music-icon" />
            <span className="marquee">Original Audio • {reel.user?.username}</span>
          </div>
        </div>

        {/* Side Actions */}
        <div style={styles.sideActions}>
          <div style={styles.actionItem} onClick={handleLike}>
            <div style={styles.actionBtn}>
              <FiHeart size={28} fill={isLiked ? 'red' : 'none'} color={isLiked ? 'red' : 'white'} />
            </div>
            <span style={styles.actionCount}>{likesCount}</span>
          </div>
          <div style={styles.actionItem} onClick={() => setShowComments(true)}>
            <div style={styles.actionBtn}>
              <FiMessageCircle size={28} />
            </div>
            <span style={styles.actionCount}>{comments.length}</span>
          </div>
          <div style={styles.actionItem} onClick={handleShare}>
            <div style={styles.actionBtn}>
              <FiSend size={28} />
            </div>
            <span style={styles.actionCount}>{sharesCount || 'Share'}</span>
          </div>
        </div>
      </div>
      
      {/* Comments Drawer */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            style={styles.commentDrawer}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div style={styles.drawerHeader}>
              <h4>Comments ({comments.length})</h4>
              <FiX size={24} style={{cursor: 'pointer'}} onClick={() => setShowComments(false)} />
            </div>
            <div style={styles.drawerComments}>
              {comments.length > 0 ? comments.map((c, i) => (
                <div key={i} style={styles.drawerCommentItem}>
                  <strong>{c.user?.username || 'User'}</strong>
                  <p>{c.text}</p>
                </div>
              )) : (
                <p style={{textAlign: 'center', color: 'gray', marginTop: '20px'}}>No comments yet.</p>
              )}
            </div>
            <form style={styles.drawerForm} onSubmit={handleAddComment}>
              <input 
                type="text" 
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                style={styles.drawerInput}
              />
              <button type="submit" style={styles.drawerPostBtn} disabled={!commentText.trim()}>Post</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

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
  commentDrawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '60%',
    backgroundColor: 'var(--bg-card)',
    borderRadius: '20px 20px 0 0',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 20,
    borderTop: '1px solid rgba(255,255,255,0.1)'
  },
  drawerHeader: {
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  drawerComments: {
    flex: 1,
    overflowY: 'auto',
    padding: '15px',
  },
  drawerCommentItem: {
    marginBottom: '15px',
    fontSize: '0.9rem',
    lineHeight: '1.4',
  },
  drawerForm: {
    padding: '15px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    gap: '10px',
  },
  drawerInput: {
    flex: 1,
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    padding: '12px 15px',
    borderRadius: '20px',
    color: 'white',
    outline: 'none',
  },
  drawerPostBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default Reels;
