import { Component, type ErrorInfo, type ReactNode } from 'react';
import { BuggyButton } from './BuggyButton';

interface Props {
  children: ReactNode;
  resetCondition: unknown;
  onErrorTrigger: (status: boolean) => void;
}

interface State {
  hasError: boolean;
  
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.hasError && prevProps.resetCondition !== this.props.resetCondition) {
      this.setState({ hasError: false });
      this.props.onErrorTrigger(false);
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onErrorTrigger(true);
  }

  render() {
    return (
        <>
            {this.state.hasError ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <p className="text-red-600 text-lg font-semibold mb-2">Oops! Something went wrong</p>
                <p className="text-red-400 text-sm">Попробуйте снова нажать Search или изменить запрос</p>
            </div>
            </div>
            ) : (
            this.props.children
            )}
        <BuggyButton />
        </>
    );
    }
}