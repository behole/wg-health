'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AppError } from '@/types';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: AppError) => void;
}

interface State {
  hasError: boolean;
  error: AppError | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null 
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const appError: AppError = {
      code: 'REACT_ERROR',
      message: error.message,
      details: {
        stack: error.stack,
        name: error.name
      },
      timestamp: new Date()
    };

    return {
      hasError: true,
      error: appError
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError: AppError = {
      code: 'REACT_ERROR',
      message: error.message,
      details: {
        stack: error.stack,
        name: error.name,
        componentStack: errorInfo.componentStack
      },
      timestamp: new Date()
    };

    console.error('ErrorBoundary caught an error:', appError);
    
    if (this.props.onError) {
      this.props.onError(appError);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Something went wrong
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  We encountered an unexpected error. Please try refreshing the page.
                </p>
                
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4 text-left">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700">
                      Error Details (Development)
                    </summary>
                    <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                      {this.state.error.message}
                      {this.state.error.details?.stack && (
                        <div className="mt-2">
                          {this.state.error.details.stack}
                        </div>
                      )}
                    </pre>
                  </details>
                )}

                <div className="mt-6 flex flex-col space-y-3">
                  <button
                    onClick={this.handleRetry}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;