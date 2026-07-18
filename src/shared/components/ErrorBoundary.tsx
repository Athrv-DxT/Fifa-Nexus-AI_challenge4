import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from './Button';
import { secureLogger } from '../utils/security';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error using secure logger, ensuring no sensitive data leaks
    secureLogger.error(
      'simulation',
      `Application render crash caught by ErrorBoundary: ${error.message}`,
      { componentStack: errorInfo.componentStack?.slice(0, 200) }
    );
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-dark-950 text-slate-200 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-brand-dark-900 border border-brand-dark-700 rounded-lg p-8 text-center space-y-6 shadow-xl">
            <ShieldAlert className="w-16 h-16 text-brand-red mx-auto animate-pulse" />
            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-wider text-slate-100">
                APPLICATION EXCEPTION
              </h1>
              <p className="text-sm text-slate-400">
                A critical rendering error occurred inside the tournament command center. The incident has been automatically logged for security review.
              </p>
            </div>
            <div className="bg-brand-dark-950 border border-brand-dark-800 rounded p-4 text-xs font-mono text-left text-slate-400 break-all">
              Error Ref: {this.state.errorMessage.slice(0, 100) || 'Unknown Render Error'}
            </div>
            <Button
              variant="danger"
              className="w-full uppercase font-bold text-xs py-2.5"
              onClick={this.handleReset}
            >
              Reset Session Control
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
