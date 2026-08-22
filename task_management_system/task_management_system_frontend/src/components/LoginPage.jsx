import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiLogIn, FiUserPlus, FiMail, FiLock, FiUser } from 'react-icons/fi';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login, register } = useAuth();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.map((e) => e.message).join(', ') ||
        'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError(null);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <h1>Task Manager</h1>
          <p className="auth-subtitle">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${!isRegister ? 'active' : ''}`}
            onClick={() => toggleMode()}
            disabled={!isRegister}
          >
            <FiLogIn /> Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${isRegister ? 'active' : ''}`}
            onClick={() => toggleMode()}
            disabled={isRegister}
          >
            <FiUserPlus /> Sign Up
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <div className="input-group">
              <label htmlFor="auth-name">
                <FiUser style={{ marginRight: '0.5rem' }} />
                Name
              </label>
              <input
                type="text"
                id="auth-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                disabled={loading}
                autoComplete="name"
              />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="auth-email">
              <FiMail style={{ marginRight: '0.5rem' }} />
              Email
            </label>
            <input
              type="email"
              id="auth-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="auth-password">
              <FiLock style={{ marginRight: '0.5rem' }} />
              Password
            </label>
            <input
              type="password"
              id="auth-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isRegister ? 'Min 6 characters' : 'Enter your password'}
              required
              minLength={isRegister ? 6 : undefined}
              disabled={loading}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : isRegister ? (
              <>
                <FiUserPlus /> Create Account
              </>
            ) : (
              <>
                <FiLogIn /> Sign In
              </>
            )}
          </button>
        </form>

        <p className="auth-footer">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" className="auth-link" onClick={toggleMode}>
            {isRegister ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
