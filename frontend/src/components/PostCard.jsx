import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiSend, FiMoreVertical } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?.id));
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');

  const handleLike = async () => {
    if (!user) return toast.error("Please login first");
    try {
      if (isLiked) {
        setLikesCount(prev => prev - 1);
        setIsLiked(false);
        await api.delete(`/posts/${post._id}/like`);
      } else {
        setLikesCount(prev => prev + 1);
        setIsLiked(true);
        await api.post(`/posts/${post._id}/like`);
      }
    } catch (err) {
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount + 1 : likesCount - 1);
    }
  };

  const handleShare = async () => {
    if (!user) return toast.error("Please login first");
    try {
      await api.post(`/posts/${post._id}/share`);
      toast.success('Post shared!');
    } catch (err) {
      toast.error('Share failed');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login first");
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/posts/${post._id}/comments`, { text: commentText });
      setComments(res.data.comments);
      setCommentText('');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  return (
    <motion.div
      className="glass-panel"
      style={styles.card}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Post Header */}
      <div style={styles.header}>
        <div 
          style={{...styles.userInfo, cursor: 'pointer'}} 
          onClick={() => navigate(`/profile/${post.user?._id || post.user?.id}`)}
        >
          <div style={styles.avatar}>
            {post.user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 style={styles.username}>{post.user?.username || 'Unknown User'}</h3>
            <span style={styles.time}>
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                month: 'short', day: 'numeric'
              })}
            </span>
          </div>
        </div>
        <button style={styles.moreBtn}>
          <FiMoreVertical size={20} />
        </button>
      </div>

      {/* Post Image */}
      <div style={styles.imageContainer}>
        <img src={post.image} alt="Post content" style={styles.image} loading="lazy" />
      </div>

      {/* Post Actions */}
      <div style={styles.actions}>
        <div style={styles.actionGroup}>
          <motion.button 
            style={{...styles.actionBtn, color: isLiked ? 'red' : 'inherit'}} 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
          >
            <FiHeart size={24} fill={isLiked ? 'red' : 'none'} />
          </motion.button>
          <motion.button style={styles.actionBtn} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowComments(!showComments)}>
            <FiMessageCircle size={24} />
          </motion.button>
          <motion.button style={styles.actionBtn} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleShare}>
            <FiSend size={24} />
          </motion.button>
        </div>
      </div>

      {/* Likes & Caption */}
      <div style={styles.content}>
        <p style={styles.likes}><strong>{likesCount} likes</strong></p>
        <p style={styles.caption}>
          <strong>{post.user?.username}</strong> {post.caption}
        </p>
        <p style={styles.comments} onClick={() => setShowComments(!showComments)}>
          {comments.length > 0 ? `View all ${comments.length} comments` : 'Add the first comment'}
        </p>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div 
              style={styles.commentSection}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div style={styles.commentList}>
                {comments.map((c, i) => (
                  <div key={i} style={styles.commentItem}>
                    <strong>{c.user?.username || 'User'}</strong> {c.text}
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddComment} style={styles.commentForm}>
                <input 
                  type="text" 
                  value={commentText} 
                  onChange={(e) => setCommentText(e.target.value)} 
                  placeholder="Add a comment..." 
                  style={styles.commentInput}
                />
                <button type="submit" style={styles.postBtn} disabled={!commentText.trim()}>Post</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const styles = {
  card: {
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto 30px',
    padding: '0',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
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
    fontSize: '1.2rem',
  },
  username: {
    fontSize: '0.95rem',
    fontWeight: '600',
  },
  time: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  moreBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-main)',
    cursor: 'pointer',
  },
  imageContainer: {
    width: '100%',
    maxHeight: '600px',
    backgroundColor: '#000',
    display: 'flex',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    maxHeight: '600px',
    objectFit: 'cover',
  },
  actions: {
    padding: '16px 16px 8px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  actionGroup: {
    display: 'flex',
    gap: '16px',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-main)',
    cursor: 'pointer',
    padding: '0',
  },
  content: {
    padding: '0 16px 16px',
  },
  likes: {
    fontSize: '0.95rem',
    marginBottom: '8px',
  },
  caption: {
    fontSize: '0.95rem',
    lineHeight: '1.4',
    marginBottom: '8px',
  },
  comments: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  commentSection: {
    marginTop: '10px',
    overflow: 'hidden',
  },
  commentList: {
    maxHeight: '150px',
    overflowY: 'auto',
    marginBottom: '10px',
    fontSize: '0.9rem',
  },
  commentItem: {
    marginBottom: '8px',
  },
  commentForm: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '10px',
  },
  commentInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: 'var(--text-main)',
    outline: 'none',
    fontSize: '0.9rem',
  },
  postBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    fontWeight: 'bold',
    cursor: 'pointer',
    opacity: 0.8,
  },
};

export default PostCard;
