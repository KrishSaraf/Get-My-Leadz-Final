import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  connectCRM: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    // Check if there's a stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setState({
        isAuthenticated: true,
        user: JSON.parse(storedUser),
        loading: false,
      });
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simple authentication - just check if email and password match
      const { data: userData, error } = await supabase
        .from('auth_users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !userData) {
        throw new Error('Invalid email or password');
      }

      const user = {
        id: userData.id,
        email: userData.email,
        name: userData.name || email.split('@')[0],
      };

      // Store user data in localStorage for session persistence
      localStorage.setItem('user', JSON.stringify(user));

      setState({
        isAuthenticated: true,
        user,
        loading: false,
      });
    } catch (error) {
      throw new Error('Invalid email or password');
    }
  };

  const logout = async () => {
    // Clear stored user data
    localStorage.removeItem('user');
    
    setState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  };

  const connectCRM = async () => {
    // Simulate CRM connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    setState(prev => ({ ...prev, isAuthenticated: true }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, connectCRM }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}