import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authStorage } from '@/services/auth/authStorage';
import { authApi, UserProfile, LoginRequest } from '@/services/api/authApi';
import { ApiError } from '@/services/api/types';

interface AuthContextType {
  user: UserProfile | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<UserProfile>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const restoreSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedAccessToken = await authStorage.getAccessToken();
      const storedRefreshToken = await authStorage.getRefreshToken();

      if (!storedAccessToken) {
        setIsLoading(false);
        return;
      }

      // 1. Verify access token with /auth/me
      try {
        const meRes = await authApi.me(storedAccessToken);
        if (meRes.success && meRes.data?.user) {
          setUser(meRes.data.user);
          setAccessToken(storedAccessToken);
          setIsLoading(false);
          return;
        }
      } catch (err: any) {
        // Access token might be expired, try refreshing
        if (storedRefreshToken) {
          try {
            const refreshRes = await authApi.refresh(storedRefreshToken);
            if (refreshRes.success && refreshRes.data?.accessToken) {
              const newAccessToken = refreshRes.data.accessToken;
              await authStorage.saveTokens(newAccessToken, storedRefreshToken);
              const meRes = await authApi.me(newAccessToken);
              if (meRes.success && meRes.data?.user) {
                setUser(meRes.data.user);
                setAccessToken(newAccessToken);
                setIsLoading(false);
                return;
              }
            }
          } catch {
            // Refresh failed as well
          }
        }
      }

      // If validation/refresh fails, clear invalid session
      await authStorage.clearTokens();
      setUser(null);
      setAccessToken(null);
    } catch {
      await authStorage.clearTokens();
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = async (credentials: LoginRequest): Promise<UserProfile> => {
    const res = await authApi.login(credentials);

    if (!res.success || !res.data) {
      throw new ApiError(res.message || 'Login failed', 400);
    }

    const { user: loggedInUser, tokens } = res.data;

    await authStorage.saveTokens(tokens.accessToken, tokens.refreshToken);
    setAccessToken(tokens.accessToken);
    setUser(loggedInUser);

    return loggedInUser;
  };

  const logout = async (): Promise<void> => {
    await authStorage.clearTokens();
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user && !!accessToken,
        login,
        logout,
        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
