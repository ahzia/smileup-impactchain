'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginResponse, RegisterRequest } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  refreshAuthToken: () => Promise<boolean>;
  isAuthenticated: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load authentication state from localStorage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedToken = localStorage.getItem('smileup_token');
        const storedRefreshToken = localStorage.getItem('smileup_refresh_token');
        const storedUser = localStorage.getItem('smileup_user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setRefreshToken(storedRefreshToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        // Clear invalid state
        localStorage.removeItem('smileup_token');
        localStorage.removeItem('smileup_refresh_token');
        localStorage.removeItem('smileup_user');
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!token || !refreshToken) return;

    const checkTokenExpiry = async () => {
      try {
        // Decode JWT to check expiry (basic check)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;

        // If token expires in less than 5 minutes, refresh it
        if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
          console.log('Token expiring soon, refreshing...');
          await refreshAuthToken();
        }
      } catch (error) {
        console.error('Error checking token expiry:', error);
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60 * 1000);
    checkTokenExpiry(); // Check immediately

    return () => clearInterval(interval);
  }, [token, refreshToken]);

  const refreshAuthToken = async (): Promise<boolean> => {
    if (!refreshToken) return false;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const { accessToken, refreshToken: newRefreshToken, user: userData } = data.data;
        
        // Store in localStorage
        localStorage.setItem('smileup_token', accessToken);
        localStorage.setItem('smileup_refresh_token', newRefreshToken);
        localStorage.setItem('smileup_user', JSON.stringify(userData));
        
        // Update state
        setToken(accessToken);
        setRefreshToken(newRefreshToken);
        setUser(userData);
        
        return true;
      } else {
        console.error('Token refresh failed:', data.error);
        // If refresh fails, logout the user
        logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const { accessToken, refreshToken: newRefreshToken, user: userData } = data.data;
        
        // Store in localStorage
        localStorage.setItem('smileup_token', accessToken);
        localStorage.setItem('smileup_refresh_token', newRefreshToken);
        localStorage.setItem('smileup_user', JSON.stringify(userData));
        
        // Update state
        setToken(accessToken);
        setRefreshToken(newRefreshToken);
        setUser(userData);
        
        return true;
      } else {
        console.error('Login failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const { accessToken, refreshToken: newRefreshToken, user: userData } = data.data;
        
        // Store in localStorage
        localStorage.setItem('smileup_token', accessToken);
        localStorage.setItem('smileup_refresh_token', newRefreshToken);
        localStorage.setItem('smileup_user', JSON.stringify(userData));
        
        // Update state
        setToken(accessToken);
        setRefreshToken(newRefreshToken);
        setUser(userData);
        
        return true;
      } else {
        console.error('Registration failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call logout API to blacklist the token
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear localStorage
      localStorage.removeItem('smileup_token');
      localStorage.removeItem('smileup_refresh_token');
      localStorage.removeItem('smileup_user');
      
      // Clear state
      setToken(null);
      setRefreshToken(null);
      setUser(null);
    }
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        isLoading,
        login,
        register,
        logout,
        refreshAuthToken,
        isAuthenticated,
        showAuthModal,
        setShowAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Utility function to get auth headers
export function getAuthHeaders(token: string | null) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
} 