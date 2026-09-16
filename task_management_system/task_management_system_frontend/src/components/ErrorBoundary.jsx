import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error loading chunk:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container">
          <div className="glass-panel center-content" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <FiAlertTriangle size={54} color="#ef4444" style={{ marginBottom: '1rem' }} />
            <h2 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Failed to Load Route Chunk</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '460px' }}>
              The dynamic JavaScript module for this route could not be loaded. This might happen due to a network interruption or updated application bundle.
            </p>
            <button onClick={this.handleRetry} className="auth-submit" style={{ display: 'inline-flex', width: 'auto', gap: '0.5rem' }}>
              <FiRefreshCw /> Retry Loading
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
