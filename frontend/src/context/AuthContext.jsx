import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await api.get('/auth/get-me');
      setUser(res.data.user);
      try {
        const profileRes = await api.get('/profile/me');
        setProfile(profileRes.data.profile);
      } catch {
        setProfile(null);
      }
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(username, password) {
    const res = await api.post('/auth/login', { username, password });
    if (res.data.token) {
      localStorage.setItem('authToken', res.data.token);
    }
    setUser(res.data.user);
    toast.success('Welcome back! 🎉');
    try {
      const profileRes = await api.get('/profile/me');
      setProfile(profileRes.data.profile);
    } catch {
      setProfile(null);
    }
    return res.data;
  }

  async function register(username, password) {
    const res = await api.post('/auth/register', { username, password });
    if (res.data.token) {
      localStorage.setItem('authToken', res.data.token);
    }
    setUser(res.data.user);
    toast.success('Account created! 🚀');
    return res.data;
  }

  async function logout() {
    await api.get('/auth/logout');
    localStorage.removeItem('authToken');
    setUser(null);
    setProfile(null);
    toast.success('Logged out');
  }

  async function updateProfile(formData) {
    try {
      const res = await api.post('/profile/update', formData);
      setProfile(res.data.profile);
      toast.success('Profile updated! ✨');
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      throw err;
    }
  }

  async function fetchProfile() {
    try {
      const res = await api.get('/profile/me');
      setProfile(res.data.profile);
      return res.data.profile;
    } catch {
      return null;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        updateProfile,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
