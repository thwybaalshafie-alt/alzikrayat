import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function LoginRegister({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const { loginUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/gallery', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleAuthSuccess = (userData) => {
    loginUser(userData);
    navigate('/gallery');
  };

  return (
    <div className="form-card">
      <div style={{ textAlign: 'center', marginBottom: '1.4rem' }}>
        <h1 style={{ margin: '0 0 0.3rem', fontSize: '1.75rem' }}>
          {mode === 'login' ? 'Welcome Back' : 'Join Alzikrayat'}
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          {mode === 'login'
            ? 'Sign in to upload photos, leave comments, and manage your gallery.'
            : 'Create your free account to start sharing memories.'}
        </p>
      </div>

      <div className="auth-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'login'}
          className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'register'}
          className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
          onClick={() => setMode('register')}
        >
          Register
        </button>
      </div>

      {mode === 'login' ? (
        <LoginForm onSuccess={handleAuthSuccess} />
      ) : (
        <RegisterForm onSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}
