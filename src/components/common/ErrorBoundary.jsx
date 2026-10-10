import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#121212',
          color: '#ffffff',
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            background: '#1e1e1e',
            border: '1px solid #333333',
            borderRadius: '16px',
            padding: '28px',
            textAlign: 'center',
            boxShadow: '0 12px 32px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(226, 75, 74, 0.15)',
              color: '#e24b4a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <AlertTriangle size={24} />
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              Shift Session Interrupted
            </h2>
            <p style={{ fontSize: '13px', color: '#9e9e9e', lineHeight: 1.5, marginBottom: '20px' }}>
              The application encountered an unexpected UI state. Your shift data and calling logs are preserved in your workspace.
            </p>

            <button
              onClick={this.handleReload}
              style={{
                background: '#0f6e56',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 18px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RefreshCw size={15} />
              <span>Reload Shift Dashboard</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
