import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Generate a simple unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('spazex_user');
    const storedUserData = localStorage.getItem('spazex_user_data');
    
    if (storedUser && storedUserData) {
      try {
        setUser(JSON.parse(storedUser));
        setUserData(JSON.parse(storedUserData));
      } catch (err) {
        console.error('Error parsing stored user data:', err);
        localStorage.removeItem('spazex_user');
        localStorage.removeItem('spazex_user_data');
      }
    }
    setLoading(false);
  }, []);

  const register = async (email, password, displayName) => {
    try {
      setError(null);
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('spazex_users') || '[]');
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Create new user
      const newUser = {
        id: generateId(),
        email,
        password, // In a real app, this would be hashed
        displayName,
        createdAt: new Date().toISOString()
      };

      // Save to users list
      users.push(newUser);
      localStorage.setItem('spazex_users', JSON.stringify(users));

      // Create user data
      const userData = {
        displayName,
        email,
        shopName: `${displayName}'s Spaza Shop`,
        phone: '',
        address: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save user session
      const sessionUser = {
        uid: newUser.id,
        email: newUser.email,
        displayName: newUser.displayName
      };

      localStorage.setItem('spazex_user', JSON.stringify(sessionUser));
      localStorage.setItem('spazex_user_data', JSON.stringify(userData));

      setUser(sessionUser);
      setUserData(userData);

      return { user: sessionUser };
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      
      // Find user in localStorage
      const users = JSON.parse(localStorage.getItem('spazex_users') || '[]');
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // Create session data
      const sessionUser = {
        uid: foundUser.id,
        email: foundUser.email,
        displayName: foundUser.displayName
      };

      const userData = {
        displayName: foundUser.displayName,
        email: foundUser.email,
        shopName: `${foundUser.displayName}'s Spaza Shop`,
        phone: '',
        address: '',
        createdAt: foundUser.createdAt,
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage
      localStorage.setItem('spazex_user', JSON.stringify(sessionUser));
      localStorage.setItem('spazex_user_data', JSON.stringify(userData));

      setUser(sessionUser);
      setUserData(userData);

      return { user: sessionUser };
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('spazex_user');
      localStorage.removeItem('spazex_user_data');
      setUser(null);
      setUserData(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      const users = JSON.parse(localStorage.getItem('spazex_users') || '[]');
      const foundUser = users.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('No user found with this email');
      }

      // In a real app, send reset email
      alert(`Password reset link sent to ${email}`);
      return true;
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateUserData = async (data) => {
    if (!user) return;
    
    try {
      // Update user data in localStorage
      const currentData = JSON.parse(localStorage.getItem('spazex_user_data') || '{}');
      const updatedData = {
        ...currentData,
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('spazex_user_data', JSON.stringify(updatedData));
      setUserData(updatedData);

      // Update display name in users list if changed
      if (data.displayName) {
        const users = JSON.parse(localStorage.getItem('spazex_users') || '[]');
        const updatedUsers = users.map(u => {
          if (u.id === user.uid) {
            return { ...u, displayName: data.displayName };
          }
          return u;
        });
        localStorage.setItem('spazex_users', JSON.stringify(updatedUsers));
        
        // Update session
        const sessionUser = JSON.parse(localStorage.getItem('spazex_user') || '{}');
        sessionUser.displayName = data.displayName;
        localStorage.setItem('spazex_user', JSON.stringify(sessionUser));
        setUser(sessionUser);
      }

      return true;
    } catch (err) {
      console.error('Update user data error:', err);
      setError(err.message);
      throw err;
    }
  };

  // Helper to get all users (for debugging)
  const getAllUsers = () => {
    return JSON.parse(localStorage.getItem('spazex_users') || '[]');
  };

  const value = {
    user,
    userData,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    updateUserData,
    getAllUsers,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;