import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export interface AuthState {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType {
  state: AuthState;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (credentials: {
    email: string;
    password: string;
    name: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  resendConfirmationEmail: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isLoading: true,
    error: null,
  });

  const setUser = (user: User | null) => {
    setState((prev) => ({ ...prev, user }));
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setState((prev) => ({ ...prev, user: null, loading: false }));
          return;
        }

        setState((prev) => ({ ...prev, user: profile, loading: false }));
      } else {
        setState((prev) => ({ ...prev, user: null, loading: false }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const { error } = await supabase.auth.signInWithPassword(credentials);
      if (error) throw error;
    } catch (error: any) {
      setState((prev) => ({ ...prev, error: error.message }));
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error resending confirmation email:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (credentials: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      // First, sign up the user
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
          options: {
            data: {
              name: credentials.name,
            },
          },
        });

      if (signUpError) throw signUpError;

      // Check if email confirmation is required
      if (signUpData?.user?.identities?.length === 0) {
        // Try to resend the confirmation email
        const { success, error } = await resendConfirmationEmail(
          credentials.email
        );
        if (!success) {
          console.error('Failed to resend confirmation email:', error);
        }
        throw new Error(
          "Email confirmation required. Please check your email. If you don't see it, check your spam folder or click the resend button."
        );
      }

      // Sign in immediately after signup
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

      if (signInError) throw signInError;
      if (!signInData.session)
        throw new Error('Failed to create session after signup');

      // Create the profile
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: signInData.session.user.id,
          email: signInData.session.user.email,
          name: credentials.name,
          level: 1,
          currentXP: 0,
          xpToNextLevel: 100,
          streakDays: 0,
          lastActive: new Date().toISOString(),
        },
      ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('Failed to create user profile');
      }

      // Set the user in the state
      setState((prev) => ({
        ...prev,
        user: {
          id: signInData.session.user.id,
          email: signInData.session.user.email!,
          name: credentials.name,
          level: 1,
          currentXP: 0,
          xpToNextLevel: 100,
          streakDays: 0,
          lastActive: new Date().toISOString(),
        },
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      console.error('Registration error:', error);
      setState((prev) => ({ ...prev, error: error.message }));
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setState((prev) => ({ ...prev, user: null }));
    } catch (error: any) {
      setState((prev) => ({ ...prev, error: error.message }));
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        clearError,
        setUser,
        resendConfirmationEmail,
      }}
    >
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
