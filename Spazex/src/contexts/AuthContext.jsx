import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage (persist login)
    const storedUser = localStorage.getItem('spazex_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login - in real app, this would call Firebase
    const mockUser = {
      email: email,
      displayName: 'John Doe',
      uid: '123456',
      shopName: "John's Spaza Shop",
      role: 'owner'
    };
    
    setUser(mockUser);
    localStorage.setItem('spazex_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('spazex_user');
  };

  const value = {
    user,
    loading,
    login,
    logout,
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