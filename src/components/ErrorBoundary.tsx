import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from './ui/Button';
import { Card, CardContent } from './ui/Card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-light-gray px-4">
          <Card className="w-full max-w-lg">
            <CardContent className="p-8 text-center">
              {/* Error Icon */}
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-secondary-red/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-secondary-red" />
                </div>
              </div>

              {/* Error Message */}
              <h1 className="text-2xl font-bold text-neutral-black mb-2">
                Something went wrong
              </h1>
              <p className="text-neutral-gray mb-6">
                We encountered an unexpected error. This has been logged and our team has been notified.
              </p>

              {/* Error Details (Development only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                  <h3 className="text-sm font-semibold text-red-800 mb-2">Error Details:</h3>
                  <pre className="text-xs text-red-700 overflow-auto max-h-32">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-xs text-red-600 cursor-pointer">Stack Trace</summary>
                      <pre className="text-xs text-red-600 mt-1 overflow-auto max-h-32">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={this.handleReload}
                  className="w-full"
                  leftIcon={<RefreshCw className="h-4 w-4" />}
                >
                  Reload Page
                </Button>
                <Button
                  variant="tertiary"
                  onClick={this.handleGoHome}
                  className="w-full"
                  leftIcon={<Home className="h-4 w-4" />}
                >
                  Go to Dashboard
                </Button>
              </div>

              {/* Help Text */}
              <div className="mt-6 pt-4 border-t border-neutral-border-gray">
                <p className="text-sm text-neutral-gray">
                  If this problem persists, please contact support at{' '}
                  <a 
                    href="mailto:support@tripongostays.com" 
                    className="text-primary-orange hover:underline"
                  >
                    support@tripongostays.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;