import { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ElementDetail from './pages/ElementDetail';

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // 记录错误便于调试
    try { console.error('页面崩溃:', error.message, info.componentStack); } catch {}
  }

  handleRetry = () => {
    this.setState({ error: null });
    // 重新挂载
    setTimeout(() => window.location.reload(), 100);
  };

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: 40, textAlign: 'center', fontFamily: 'system-ui, sans-serif',
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#0a1628', color: '#fff',
        }}>
          <span style={{ fontSize: 48, marginBottom: 16 }}>⚠️</span>
          <h2 style={{ color: '#fff', marginBottom: 8 }}>页面出错了</h2>
          <p style={{ color: '#8899aa', fontSize: 14, marginBottom: 4 }}>
            {this.state.error?.message || '未知错误'}
          </p>
          <button onClick={this.handleRetry}
            style={{
              marginTop: 20, padding: '10px 32px', fontSize: 16,
              background: '#2980b9', color: '#fff', border: 'none',
              borderRadius: 8, cursor: 'pointer',
            }}
          >
            刷新页面
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/element/:elementId" element={<ElementDetail />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
