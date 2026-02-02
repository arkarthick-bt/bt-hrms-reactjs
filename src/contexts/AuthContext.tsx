import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAccessToken, get, post } from '../apiHelpers';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';

export type AuthUser = Record<string, any> | null;

export type LoginResponse = Record<string, any>;

export type AuthContextValue = {
  user: AuthUser;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (u: AuthUser) => void;
  login: (endpoint: string, credentials: any, options?: { tokenKey?: string }) => Promise<LoginResponse>;
  logout: (endpoint?: string, options?: { tokenKey?: string }) => Promise<void>;
  fetchProfile?: (endpoint?: string) => Promise<void>;
  fetchScopes: (customTokenKey?: string) => Promise<void>;
  refreshScopes: () => Promise<void>; // New function to refresh scopes
  scopes: string[];
};

const defaultValue: AuthContextValue = {
  user: null,
  token: null,
  loading: false,
  isAuthenticated: false,
  setUser: () => { },
  login: async () => ({} as LoginResponse),
  logout: async () => { },
  fetchScopes: async (customTokenKey?: string) => { },
  refreshScopes: async () => { }, // Default implementation
  scopes: [],
};

const AuthContext = createContext<AuthContextValue>(defaultValue);

export type AuthProviderProps = {
  children: React.ReactNode;
  /** If provided, will try to fetch the profile on mount when a token exists */
  profileEndpoint?: string;
  /** sessionStorage key for access token (default: 'accessToken') */
  tokenKey?: string;
};

const USER_KEY = 'userDetails';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, profileEndpoint, tokenKey = 'accessToken' }) => {
  const [user, setUserState] = useState<AuthUser>(() => {
    try {
      const savedUser = sessionStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => getAccessToken(tokenKey));
  const [loading, setLoading] = useState(false);
  const [scopes, setScopes] = useState<string[]>(() => {
    try {
      const savedScopes = sessionStorage.getItem('scopes');
      if (savedScopes) {
        const parsed = JSON.parse(savedScopes);
        return Array.isArray(parsed) ? parsed : (parsed.data || parsed.scopes || []);
      }
    } catch { /* ignore */ }
    return [];
  });

  const setUser = (newUser: AuthUser) => {
    setUserState(newUser);
    if (newUser) {
      sessionStorage.setItem(USER_KEY, JSON.stringify(newUser));
    } else {
      sessionStorage.removeItem(USER_KEY);
    }
  };

  useEffect(() => {
    // If token exists, fetch profile and scopes (only if scopes are empty)
    if (token) {
      if (profileEndpoint) void fetchProfile(profileEndpoint);
      if (scopes.length === 0) {
        void fetchScopes(tokenKey);
      } else {
        console.log('[AuthContext] Scopes already loaded, skipping initial fetch');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, profileEndpoint]);

  const fetchProfile = async (endpoint?: string) => {
    if (!endpoint) return;
    setLoading(true);
    try {
      const data = await get(endpoint, { tokenKey });
      setUser(data ?? null);
    } catch (err) {
      // If fetching profile fails, clear user
      setUser(null);
      // eslint-disable-next-line no-console
      console.warn('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (endpoint: string, credentials: any, options?: { tokenKey?: string }) => {
    setLoading(true);
    try {
      const res = await post<LoginResponse>(endpoint, credentials, { tokenKey: options?.tokenKey ?? tokenKey });

      // Try to discover token in response
      const tokenCandidates = ['token', 'accessToken', 'access_token', 'authToken', 'auth_token'];
      let foundToken: string | null = null as unknown as string | null;
      for (const key of tokenCandidates) {
        if (res && (res as any)[key]) {
          foundToken = String((res as any)[key]);
          break;
        }
      }

      // If response contains nested data object
      if (!foundToken && res && (res as any).data) {
        for (const key of tokenCandidates) {
          if ((res as any).data[key]) {
            foundToken = String((res as any).data[key]);
            break;
          }
        }
      }

      if (foundToken) {
        try {
          sessionStorage.setItem(options?.tokenKey ?? tokenKey, foundToken);

          // Discover sessionId in response
          const sessionCandidates = ['sessionId', 'sessionID', 'sid', 'session_id'];
          let foundSessionId: string | null = null;

          for (const key of sessionCandidates) {
            if (res && (res as any)[key]) {
              foundSessionId = String((res as any)[key]);
              break;
            }
          }

          if (!foundSessionId && res && (res as any).data) {
            for (const key of sessionCandidates) {
              if ((res as any).data[key]) {
                foundSessionId = String((res as any).data[key]);
                break;
              }
            }
          }

          if (foundSessionId) {
            sessionStorage.setItem('sessionId', foundSessionId);
          }
        } catch (err) {
          // ignore storage errors
        }
        setToken(foundToken);

        // Fetch user scopes/permissions
        console.log('[AuthContext] Triggering fetchScopes after login...');
        await fetchScopes(options?.tokenKey ?? tokenKey);
      } else {
        // If the request was successful but no token was found in the response
        throw new Error('Authentication successful but no access token received. Please contact support.');
      }

      // Improved user info discovery
      console.log('[AuthContext] Login response:', res);
      let foundUser: any = null;

      // Check for user object in various possible locations
      if (res && res.user) {
        foundUser = res.user;
      } else if (res && res.data && res.data.user) {
        foundUser = res.data.user;
      } else if (res && res.data && (res.data.name || res.data.username || res.data.id || res.data.uid)) {
        foundUser = res.data;
      } else if (res && res.profile) {
        foundUser = res.profile;
      } else if (res && (res.name || res.username || res.email || res.firstName)) {
        foundUser = res;
      }

      if (foundUser) {
        console.log('[AuthContext] Discovered user:', foundUser);
        const displayName = foundUser.displayName || foundUser.name || foundUser.fullName ||
          (foundUser.firstName ? `${foundUser.firstName} ${foundUser.lastName || ''}`.trim() : null) ||
          foundUser.username || foundUser.email;

        foundUser.displayName = displayName;
        setUser(foundUser);
      } else {
        console.warn('[AuthContext] No user object found in response. Using fallback.');
        const fallbackUser = { username: 'User', displayName: 'Authenticated User' };
        setUser(fallbackUser);
        foundUser = fallbackUser;
      }

      // Session ID discovery
      if (!sessionStorage.getItem('sessionId')) {
        const sessionId = foundUser.sessionId || (res.data ? res.data.sessionId : null) || res.sessionId;
        if (sessionId) sessionStorage.setItem('sessionId', String(sessionId));
      }

      return res;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (endpoint?: string, options?: { tokenKey?: string }) => {
    try {
      if (endpoint) {
        await post(endpoint, {}, { tokenKey: options?.tokenKey ?? tokenKey });
      }
    } catch (err) {
      console.error('Logout API call failed', err);
    } finally {
      try {
        sessionStorage.removeItem(options?.tokenKey ?? tokenKey);
        sessionStorage.removeItem('sessionId');
        sessionStorage.removeItem(USER_KEY);
        sessionStorage.removeItem('scopes');
      } catch (err) {
        // ignore
      }
      setToken(null);
      setUser(null);
      setScopes([]);
    }
  };
  
  const fetchScopes = async (customTokenKey?: string) => {
    const activeTokenKey = customTokenKey || tokenKey;
    const currentToken = getAccessToken(activeTokenKey);
    
    if (!currentToken) return;

    try {
      const url = API_BASE_URL + API_ENDPOINTS.ROLES.SCOPES;
      const scopesResponse = await get(url, { tokenKey: activeTokenKey });
      
      if (scopesResponse) {
        sessionStorage.setItem('scopes', JSON.stringify(scopesResponse));
        const extracted = Array.isArray(scopesResponse) 
          ? scopesResponse 
          : (scopesResponse.data || scopesResponse.scopes || []);
        setScopes(extracted);
      }
    } catch (scopeErr) {
      console.error('[AuthContext] Failed to fetch scopes:', scopeErr);
    }
  };

  // New function to refresh scopes (force re-fetch)
  const refreshScopes = async () => {
    console.log('[AuthContext] Manually refreshing scopes...');
    await fetchScopes(tokenKey);
  };

  const value: AuthContextValue = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    setUser,
    login,
    logout,
    fetchProfile,
    fetchScopes,
    refreshScopes, // Add the new function
    scopes,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export default AuthContext;
