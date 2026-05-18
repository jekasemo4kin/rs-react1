import { Component,  type ReactNode } from 'react';

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
    }
  }

  componentDidCatch() {
    this.props.onErrorTrigger(true);
  }

  render() {
  if (this.state.hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-400px text-center px-4 bg-white rounded-2xl shadow-sm border border-red-100">
        <div className="bg-red-50 p-8 rounded-3xl max-w-md">
          <div className="text-red-500 mb-4 flex justify-center">
             <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.876c1.73 0 2.813-1.874 1.948-3.374L13.949 3.34c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
             </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Critical Application Error</h2>
          <p className="text-red-600/80 mb-6">
            The application encountered a critical error. Click the button below to resume operation.
          </p>
          <button 
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onErrorTrigger(false);
            }}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-200 active:scale-95"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return this.props.children;
}
}