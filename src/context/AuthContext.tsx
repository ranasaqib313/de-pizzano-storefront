'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: 'customer' | 'staff' | 'admin';
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithPassword: (credentials: { email: string; password: string }) => Promise<{ error: Error | null }>;
  signUp: (data: { email: string; password: string; fullName: string }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const configured = isSupabaseConfigured();

  const fetchProfile = useCallback(async (userId: string) => {
    if (!configured) return;
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data as UserProfile);
      } else {
        // Fallback default profile if trigger hasn't completed yet
        setProfile({
          id: userId,
          full_name: null,
          phone: null,
          role: 'customer',
        });
      }
    } catch {
      // Ignore profile fetch error
    }
  }, [configured]);

  useEffect(() => {
    if (!configured) {
      // Check if a demo session was stored in localStorage
      try {
        const storedDemoUser = localStorage.getItem('depizzano_demo_user');
        if (storedDemoUser) {
          const parsed = JSON.parse(storedDemoUser);
          setUser(parsed.user);
          setProfile(parsed.profile);
        }
      } catch {
        // Ignore
      }
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
      setIsLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          await fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [configured, fetchProfile]);

  const signInWithGoogle = useCallback(async () => {
    if (!configured) {
      return {
        error: new Error(
          'Supabase is not configured yet. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.'
        ),
      };
    }

    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to initiate Google sign-in'),
      };
    }
  }, [configured]);

  const signInWithPassword = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      if (!configured) {
        // Fallback demo login when offline/unconfigured
        const mockUser = {
          id: 'demo-user-123',
          email,
          user_metadata: { full_name: email.split('@')[0] },
        } as unknown as User;
        const mockProfile: UserProfile = {
          id: 'demo-user-123',
          full_name: email.split('@')[0],
          phone: '0318-2588631',
          role: 'customer',
        };
        setUser(mockUser);
        setProfile(mockProfile);
        try {
          localStorage.setItem('depizzano_demo_user', JSON.stringify({ user: mockUser, profile: mockProfile }));
        } catch {
          // Ignore
        }
        return { error: null };
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        setUser(data.user);
        if (data.user) {
          await fetchProfile(data.user.id);
        }
        return { error: null };
      } catch (err) {
        return {
          error: err instanceof Error ? err : new Error('Invalid email or password'),
        };
      }
    },
    [configured, fetchProfile]
  );

  const signUp = useCallback(
    async ({ email, password, fullName }: { email: string; password: string; fullName: string }) => {
      if (!configured) {
        // Fallback demo signup when offline/unconfigured
        const mockUser = {
          id: 'demo-user-new',
          email,
          user_metadata: { full_name: fullName },
        } as unknown as User;
        const mockProfile: UserProfile = {
          id: 'demo-user-new',
          full_name: fullName,
          phone: null,
          role: 'customer',
        };
        setUser(mockUser);
        setProfile(mockProfile);
        try {
          localStorage.setItem('depizzano_demo_user', JSON.stringify({ user: mockUser, profile: mockProfile }));
        } catch {
          // Ignore
        }
        return { error: null };
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;
        setUser(data.user);
        if (data.user) {
          await fetchProfile(data.user.id);
        }
        return { error: null };
      } catch (err) {
        return {
          error: err instanceof Error ? err : new Error('Registration failed'),
        };
      }
    },
    [configured, fetchProfile]
  );

  const signOut = useCallback(async () => {
    if (configured) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {
        // Ignore
      }
    }
    setUser(null);
    setProfile(null);
    setSession(null);
    try {
      localStorage.removeItem('depizzano_demo_user');
    } catch {
      // Ignore
    }
  }, [configured]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  const value = useMemo(
    () => ({
      user,
      profile,
      session,
      isLoading,
      isAuthenticated: Boolean(user),
      isConfigured: configured,
      signInWithGoogle,
      signInWithPassword,
      signUp,
      signOut,
      refreshProfile,
    }),
    [
      user,
      profile,
      session,
      isLoading,
      configured,
      signInWithGoogle,
      signInWithPassword,
      signUp,
      signOut,
      refreshProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Return safe default context if rendered outside provider (e.g. in isolated unit tests)
    return {
      user: null,
      profile: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
      isConfigured: false,
      signInWithGoogle: async () => ({ error: null }),
      signInWithPassword: async () => ({ error: null }),
      signUp: async () => ({ error: null }),
      signOut: async () => {},
      refreshProfile: async () => {},
    };
  }
  return context;
}

