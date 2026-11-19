import { useState } from 'react';
import { loginRequest, getErrorMessage } from '../services/api';
import ErrorAlert from './ErrorAlert';

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    try {
      setLoading(true);
      const data = await loginRequest({ email: email.trim(), password });
      onSuccess(data.user);
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed. Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ErrorAlert message={error} onDismiss={() => setError('')} />

      <div className="form-group">
        <label htmlFor="login-email" className="form-label">
          Email Address
        </label>
        <input
          id="login-email"
          type="email"
          className="form-input"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password" className="form-label">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          className="form-input"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: '100%', marginTop: '0.5rem' }}
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <div
        style={{
          marginTop: '1.1rem',
          padding: '0.75rem 0.9rem',
          background: 'var(--bg)',
          borderRadius: '10px',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
        }}
      >
        <strong>Demo Account:</strong> <code>thwyba@alzikrayat.demo</code> /{' '}
        <code>Demo@1234</code>
      </div>
    </form>
  );
}
