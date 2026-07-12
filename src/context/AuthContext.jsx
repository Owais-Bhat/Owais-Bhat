import { createContext, useState, useEffect } from 'react';
import api, { getToken, setToken } from '../lib/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session from a stored JWT on load
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
        setProfile(data.profile);
        setIsAuthenticated(true);
      } catch (err) {
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);
      const { data } = await api.post('/auth/login', { email, password });
      setToken(data.token);
      setUser(data.user);
      setProfile(data.user.profile);
      setIsAuthenticated(true);
      return { success: true, profile: data.user.profile };
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, userData = {}) => {
    try {
      setError(null);
      setIsLoading(true);
      const { data } = await api.post('/auth/register', {
        email,
        password,
        firstName: userData.first_name,
        lastName: userData.last_name,
        institutionName: userData.institution_name,
        institutionType: userData.institution_type,
        institutionAddress: userData.institution_address,
        institutionPhone: userData.institution_phone,
        institutionEmail: userData.institution_email,
      });
      setToken(data.token);
      setUser(data.user);
      setProfile(data.user.profile);
      setIsAuthenticated(true);
      return { success: true, profile: data.user.profile };
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
    return { success: true };
  };

  const updateProfile = async (updates) => {
    try {
      setIsLoading(true);
      const { data } = await api.put('/auth/me', updates);
      setProfile(data.profile);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    profile,
    isAuthenticated,
    loading: isLoading,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
