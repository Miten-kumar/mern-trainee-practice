import { Component, ErrorInfo, ReactNode } from 'react';
import { errorLogger } from '../services/errorLogger';

interface Props {
  children: ReactNode;
  level: 'root' | 'page' | 'section';
  fallback: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

// error boundaries only catch errors during rendering, in lifecycle
// methods, and in constructors of the tree below them. They do NOT
// catch errors in event handlers, async code, or server side rendering
// - those need to be handled with try/catch where they happen instead.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    errorLogger.logError(error, {
      componentStack: info.componentStack ?? undefined,
      level: this.props.level,
    });
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.reset);
    }
    return this.props.children;
  }
}
