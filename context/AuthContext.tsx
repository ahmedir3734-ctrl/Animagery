import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Anime } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addToMyList: (anime: Anime) => void;
  removeFromMyList: (animeId: string) => void;
  addToHistory: (anime: Anime) => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (isOpen: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USERS = 'animagery_users';
const STORAGE_KEY_CURRENT = 'animagery_current_user_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  // Load session on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (storedUserId) {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
      const foundUser = users.find((u: any) => u.id === storedUserId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
    setLoading(false);
  }, []);

  // Sync user changes to localStorage whenever user object updates
  useEffect(() => {
    if (user) {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
      const updatedUsers = users.map((u: any) => u.id === user.id ? user : u);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedUsers));
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      // Don't expose password in state
      const { password, ...safeUser } = foundUser;
      setUser(safeUser);
      localStorage.setItem(STORAGE_KEY_CURRENT, safeUser.id);
      return true;
    }
    return false;
  };

  const register = async (email: string, username: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
    if (users.find((u: any) => u.email === email)) {
      return false; // User exists
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      username,
      password, // In a real app, hash this!
      myList: [],
      history: [],
      avatarColor: ['#ef4444', '#f97316', '#84cc16', '#06b6d4', '#8b5cf6', '#d946ef'][Math.floor(Math.random() * 6)]
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem(STORAGE_KEY_CURRENT, safeUser.id);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_CURRENT);
    setAuthModalOpen(false);
  };

  const addToMyList = (anime: Anime) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (user.myList.some(a => a.id === anime.id)) return;
    setUser(prev => prev ? ({ ...prev, myList: [anime, ...prev.myList] }) : null);
  };

  const removeFromMyList = (animeId: string) => {
    if (!user) return;
    setUser(prev => prev ? ({ ...prev, myList: prev.myList.filter(a => a.id !== animeId) }) : null);
  };

  const addToHistory = (anime: Anime) => {
    if (!user) return;
    // Remove existing entry of same anime to move it to top
    const filteredHistory = user.history.filter(a => a.id !== anime.id);
    setUser(prev => prev ? ({ ...prev, history: [anime, ...filteredHistory].slice(0, 20) }) : null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      addToMyList, 
      removeFromMyList,
      addToHistory,
      isAuthModalOpen,
      setAuthModalOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};