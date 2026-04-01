import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiEdit3, FiGrid, FiFilm, FiBookmark, FiHeart, FiTrash2, FiPlayCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Profile = () => {
  const { user, profile, updateProfile, fetchProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', bio: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [userPosts, setUserPosts] = useState([]);
  const [userReels, setUserReels] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    if (!user?.id) return;

    fetchProfile().then((data) => {
      if (data) {
        setFormData({ name: data.name || '', bio: data.bio || '' });
      }
    });
    
    fetchUserPosts();
    fetchUserReels();
  }, [user?.id]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const getOwnerId = (item) => {
    if (!item?.user) return null;
    if (typeof item.user === 'string') return item.user;
    return item.user._id?.toString?.() || item.user.id?.toString?.() || null;
  };

  async function fetchUserPosts() {
    try {
      const res = await api.get('/posts');
      const filtered = (res.data.posts || []).filter(
        (p) => getOwnerId(p) === user?.id?.toString()
      );
      setUserPosts(filtered);
    } catch (err) {
       console.log(err);
    }
  };

  async function fetchUserReels() {
    try {
      const res = await api.get('/reels');
      const filtered = (res.data.reels || []).filter(
        (r) => getOwnerId(r) === user?.id?.toString()
      );
      setUserReels(filtered);
    } catch (err) {
       console.log(err);
    }
  };

  const handleDeletePost = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${id}`);
      setUserPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Post deleted");
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };

  const handleDeleteReel = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this reel?")) return;
    try {
      await api.delete(`/reels/${id}`);
      setUserReels((prev) => prev.filter((r) => r._id !== id));
      toast.success("Reel deleted");
    } catch (err) {
      toast.error("Failed to delete reel");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSaveProfile = async () => {
    try {
      const data = new FormData();
      if (file) data.append('avatar', file);
      if (formData.name) data.append('name', formData.name);
      if (formData.bio) data.append('bio', formData.bio);

      const id = toast.loading('Save profile details...');
      await updateProfile(data);
      toast.dismiss(id);
      setIsEditing(false);
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
  };

  // Safe fallback for profile data
  const displayName = profile?.name || user?.username || 'User';
  const displayBio = profile?.bio || 'No bio yet. Click Edit Profile to add one!';
  const displayAvatar = preview || profile?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=random`;

  return (
    <motion.div
      style={{ ...styles.container, ...(isMobile ? styles.containerMobile : {}) }}
      initial="initial"
      animate="in"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
    >
      {/* Profile Header Block */}
      <div className="glass-panel" style={{ ...styles.headerBlock, ...(isMobile ? styles.headerBlockMobile : {}) }}>
        <div style={{ ...styles.topSection, ...(isMobile ? styles.topSectionMobile : {}) }}>
          <div style={styles.avatarContainer}>
            <div style={styles.avatarRing}>
              <img src={displayAvatar} alt="Profile" style={styles.avatar} />
            </div>
            {isEditing && (
              <label style={styles.editAvatarBtn}>
                <FiEdit3 size={16} />
                <input type="file" style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
              </label>
            )}
          </div>

          <div style={{ ...styles.infoContainer, ...(isMobile ? styles.infoContainerMobile : {}) }}>
            <div style={{ ...styles.nameHeader, ...(isMobile ? styles.nameHeaderMobile : {}) }}>
              <h1 style={{ ...styles.username, ...(isMobile ? styles.usernameMobile : {}) }}>{user?.username}</h1>
              {!isEditing ? (
                <button className="btn-outline" style={styles.editBtn} onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              ) : (
                <div style={styles.editActions}>
                  <button className="btn-primary" style={styles.saveBtn} onClick={handleSaveProfile}>Save</button>
                  <button className="btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              )}
            </div>

            <div style={{ ...styles.stats, ...(isMobile ? styles.statsMobile : {}) }}>
              <div style={styles.statItem}><strong>{userPosts.length}</strong> posts</div>
              <div style={styles.statItem}><strong>1.2K</strong> followers</div>
              <div style={styles.statItem}><strong>845</strong> following</div>
            </div>

            <div style={styles.bioSection}>
              {isEditing ? (
                <div style={styles.editForm}>
                  <input
                    type="text"
                    className="input-glass"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ marginBottom: '10px' }}
                  />
                  <textarea
                    className="input-glass"
                    placeholder="Bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                  />
                </div>
              ) : (
                <>
                  <h3 style={styles.name}>{displayName}</h3>
                  <p style={styles.bio}>{displayBio}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ ...styles.tabsContainer, ...(isMobile ? styles.tabsContainerMobile : {}) }}>
        <button
          style={{ ...styles.tab, ...(activeTab === 'posts' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('posts')}
        >
          <FiGrid size={20} /> <span style={{ ...styles.tabText, ...(isMobile ? styles.tabTextMobile : {}) }}>POSTS</span>
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'reels' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('reels')}
        >
          <FiFilm size={20} /> <span style={{ ...styles.tabText, ...(isMobile ? styles.tabTextMobile : {}) }}>REELS</span>
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'saved' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('saved')}
        >
          <FiBookmark size={20} /> <span style={{ ...styles.tabText, ...(isMobile ? styles.tabTextMobile : {}) }}>SAVED</span>
        </button>
      </div>

      {/* Grid Content */}
      <div style={{ ...styles.grid, ...(isMobile ? styles.gridMobile : {}) }}>
        {activeTab === 'posts' && userPosts.length > 0 ? (
           userPosts.map(post => (
            <motion.div key={post._id} style={styles.gridItem} whileHover={{ scale: 1.02 }}>
              <img src={post.image} alt="post" style={styles.gridImg} />
               <div style={styles.gridOverlay}>
                  <span><FiHeart /> 120</span>
               </div>
               <button 
                 onClick={(e) => handleDeletePost(post._id, e)} 
                 style={styles.deleteBtn}
                 title="Delete Post"
               >
                 <FiTrash2 size={16} />
               </button>
            </motion.div>
           ))
        ) : activeTab === 'reels' && userReels.length > 0 ? (
           userReels.map(reel => (
            <motion.div key={reel._id} style={styles.gridItem} whileHover={{ scale: 1.02 }}>
              <video src={reel.video} style={styles.gridImg} />
               <div style={styles.gridOverlay}>
                  <span style={{textAlign: 'center'}}><FiPlayCircle size={24} /> <br/> Reel</span>
               </div>
               <button 
                 onClick={(e) => handleDeleteReel(reel._id, e)} 
                 style={styles.deleteBtn}
                 title="Delete Reel"
               >
                 <FiTrash2 size={16} />
               </button>
            </motion.div>
           ))
        ) : (
          <div style={styles.emptyTab}>
             {activeTab === 'posts' ? <FiGrid size={50} style={{ marginBottom: '20px', color: 'var(--text-muted)' }}/> 
               : activeTab === 'reels' ? <FiFilm size={50} style={{ marginBottom: '20px', color: 'var(--text-muted)' }}/> 
               : <FiBookmark size={50} style={{ marginBottom: '20px', color: 'var(--text-muted)' }}/>}
             <h2>No {activeTab} yet.</h2>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px 0',
  },
  containerMobile: {
    padding: '8px 0',
  },
  headerBlock: {
    padding: '40px',
    marginBottom: '40px',
  },
  headerBlockMobile: {
    padding: '18px',
    marginBottom: '20px',
    borderRadius: '16px',
  },
  topSection: {
    display: 'flex',
    gap: '60px',
    alignItems: 'flex-start',
  },
  topSectionMobile: {
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    flexShrink: 0,
  },
  avatarRing: {
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    padding: '4px',
    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid var(--bg-dark)',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    background: 'var(--primary)',
    color: 'white',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
    transition: 'transform 0.2s',
  },
  infoContainer: {
    flex: 1,
  },
  infoContainerMobile: {
    width: '100%',
  },
  nameHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  nameHeaderMobile: {
    justifyContent: 'center',
    textAlign: 'center',
    gap: '12px',
  },
  username: {
    fontSize: '2rem',
    fontWeight: '300',
  },
  usernameMobile: {
    fontSize: '1.5rem',
  },
  editBtn: {
    padding: '8px 16px',
    fontSize: '0.9rem',
  },
  editActions: {
    display: 'flex',
    gap: '10px',
  },
  saveBtn: {
    padding: '8px 16px',
    fontSize: '0.9rem',
  },
  stats: {
    display: 'flex',
    gap: '40px',
    marginBottom: '20px',
    fontSize: '1.1rem',
  },
  statsMobile: {
    gap: '16px',
    justifyContent: 'space-between',
    width: '100%',
    fontSize: '0.95rem',
  },
  statItem: {
    color: 'var(--text-main)',
  },
  bioSection: {
    marginTop: '20px',
  },
  name: {
    fontWeight: '600',
    fontSize: '1.1rem',
    marginBottom: '5px',
  },
  bio: {
    lineHeight: '1.5',
    color: 'var(--text-muted)',
    whiteSpace: 'pre-line',
  },
  editForm: {
    width: '100%',
    maxWidth: '400px',
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '60px',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '20px',
    marginBottom: '30px',
  },
  tabsContainerMobile: {
    gap: '18px',
    marginBottom: '20px',
    overflowX: 'auto',
    justifyContent: 'flex-start',
    paddingTop: '14px',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    fontWeight: '600',
    letterSpacing: '1px',
    cursor: 'pointer',
    padding: '10px 0',
    position: 'relative',
    transition: 'color 0.3s',
  },
  activeTab: {
    color: 'var(--text-main)',
    borderTop: '2px solid var(--text-main)',
    marginTop: '-21px', // Pull up to overlap the border
    paddingTop: '19px',
  },
  tabText: {
  },
  tabTextMobile: {
    fontSize: '0.75rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
  },
  gridMobile: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  gridItem: {
    aspectRatio: '1 / 1',
    backgroundColor: 'var(--bg-card)',
    overflow: 'hidden',
    cursor: 'pointer',
    position: 'relative',
    borderRadius: '10px',
  },
  gridImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    transition: 'opacity 0.2s',
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    "&:hover": {
      opacity: 1,
    }
  },
  deleteBtn: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'rgba(255, 68, 68, 0.9)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    zIndex: 10,
    boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
    transition: 'background 0.2s',
  },
  emptyTab: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '50px',
    color: 'var(--text-muted)',
  }
};

export default Profile;
