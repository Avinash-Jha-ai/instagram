import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiSend, FiMoreVertical } from 'react-icons/fi';

const PostCard = ({ post }) => {
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
        <div style={styles.userInfo}>
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
          <motion.button style={styles.actionBtn} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FiHeart size={24} />
          </motion.button>
          <motion.button style={styles.actionBtn} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FiMessageCircle size={24} />
          </motion.button>
          <motion.button style={styles.actionBtn} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FiSend size={24} />
          </motion.button>
        </div>
      </div>

      {/* Likes & Caption */}
      <div style={styles.content}>
        <p style={styles.likes}><strong>1,245 likes</strong></p>
        <p style={styles.caption}>
          <strong>{post.user?.username}</strong> {post.caption}
        </p>
        <p style={styles.comments}>View all 84 comments</p>
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
};

export default PostCard;
