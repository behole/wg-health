'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AppState, AppError } from '../../types';
import { onAuthStateChange } from '@/lib/auth';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: AppError | null) => void;
    setTheme: (theme: 'light' | 'dark' | 'auto') => void;
    completeOnboarding: () => void;
    clearError: () => void;
  };
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: AppError | null }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'auto' }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'CLEAR_ERROR' };

const initialState: AppState = {
  user: null,
  theme: 'auto',
  isLoading: true,
  error: null,
  onboardingCompleted: false
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isLoading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        onboardingCompleted: true
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial state from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('plan-d-theme') as 'light' | 'dark' | 'auto' | null;
      const savedOnboarding = localStorage.getItem('plan-d-onboarding-completed') === 'true';

      if (savedTheme) {
        dispatch({ type: 'SET_THEME', payload: savedTheme });
      }

      if (savedOnboarding) {
        dispatch({ type: 'COMPLETE_ONBOARDING' });
      }
    } catch (error) {
      console.warn('Failed to load saved preferences:', error);
    }
  }, []);

  // Set up auth listener
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChange((user) => {
        dispatch({ type: 'SET_USER', payload: user });
      });

      return unsubscribe;
    } catch (error) {
      console.warn('Auth setup warning:', error);
      // Set loading to false if auth fails to initialize
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Save theme to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('plan-d-theme', state.theme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, [state.theme]);

  // Save onboarding status to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('plan-d-onboarding-completed', state.onboardingCompleted.toString());
    } catch (error) {
      console.warn('Failed to save onboarding status:', error);
    }
  }, [state.onboardingCompleted]);

  const actions = {
    setUser: (user: User | null) => dispatch({ type: 'SET_USER', payload: user }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: AppError | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    setTheme: (theme: 'light' | 'dark' | 'auto') => dispatch({ type: 'SET_THEME', payload: theme }),
    completeOnboarding: () => dispatch({ type: 'COMPLETE_ONBOARDING' }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' })
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    actions
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export { AppContext };