import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiImage, FiVideo } from 'react-icons/fi';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [type, setType] = useState('post'); // post or reel
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (type === 'post' && !selectedFile.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    if (type === 'reel' && !selectedFile.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    if (type === 'post') {
      formData.append('image', file);
      formData.append('caption', caption);
    } else {
      formData.append('video', file);
      formData.append('title', caption);
    }

    setLoading(true);
    const id = toast.loading('Uploading to Cloudinary... 🚀');
    
    try {
      if (type === 'post') {
        await api.post('/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Post created successfully!', { id });
        navigate('/');
      } else {
        await api.post('/reels', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Reel created successfully!', { id });
        navigate('/reels');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload', { id });
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.05 },
  };

  return (
    <motion.div
      style={styles.container}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.4 }}
    >
      <div className="glass-panel" style={styles.card}>
        <h1 style={styles.title}>Create New</h1>

        <div style={styles.tabs}>
          <button
            style={{ ...styles.tabBtn, ...(type === 'post' ? styles.activeTab : {}) }}
            onClick={() => { setType('post'); setFile(null); setPreview(null); }}
          >
            <FiImage size={20} /> Post
          </button>
          <button
            style={{ ...styles.tabBtn, ...(type === 'reel' ? styles.activeTab : {}) }}
            onClick={() => { setType('reel'); setFile(null); setPreview(null); }}
          >
            <FiVideo size={20} /> Reel
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div
            style={styles.uploadArea}
            onClick={() => document.getElementById('fileInput').click()}
          >
            {preview ? (
              type === 'post' ? (
                <img src={preview} alt="Preview" style={styles.preview} />
              ) : (
                <video src={preview} autoPlay loop muted style={styles.preview} />
              )
            ) : (
              <div style={styles.uploadPlaceholder}>
                <FiUploadCloud size={60} color="var(--primary)" />
                <p>Click to browse files</p>
                <span style={styles.supportText}>
                  {type === 'post' ? 'PNG, JPG, JPEG (Max 5MB)' : 'MP4, MOV (Max 50MB)'}
                </span>
              </div>
            )}
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept={type === 'post' ? 'image/*' : 'video/*'}
            />
          </div>

          <textarea
            className="input-glass"
            style={styles.textarea}
            placeholder={type === 'post' ? "Write a caption..." : "Write a title..."}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
          />

          <motion.button
            type="submit"
            className="btn-primary"
            style={styles.submitBtn}
            disabled={loading || !file}
            whileHover={(!loading && file) ? { scale: 1.02 } : {}}
            whileTap={(!loading && file) ? { scale: 0.98 } : {}}
          >
            {loading ? 'Publishing...' : 'Share'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
  },
  card: {
    width: '100%',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    textAlign: 'center',
  },
  tabs: {
    display: 'flex',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    padding: '5px',
    marginBottom: '20px',
  },
  tabBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '12px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
  activeTab: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'var(--text-main)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  uploadArea: {
    width: '100%',
    height: '350px',
    border: '2px dashed var(--border-color)',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
  },
  uploadPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    color: 'var(--text-muted)',
  },
  supportText: {
    fontSize: '0.8rem',
    opacity: 0.7,
  },
  preview: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  textarea: {
    resize: 'none',
    fontSize: '1.1rem',
  },
  submitBtn: {
    padding: '15px',
    fontSize: '1.1rem',
    opacity: 1, // Will be overridden by disabled state visually via normal CSS behavior or motion
  },
};

export default CreatePost;
