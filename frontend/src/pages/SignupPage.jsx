import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';

export default function SignupPage() {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim())     return setError('Name is required');
    if (!email.trim())    return setError('Email is required');
    if (password.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    try {
      const res = await api.signup({ name, email, password });
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px'
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px', height: '48px',
            backgroundColor: '#2563eb',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.5rem'
          }}>
            ✓
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: '0 0 0.25rem' }}>
            Create your account
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
            Join TaskFlow to manage your projects
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.25rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.375rem'
            }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                border: '1.5px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box',
                color: '#111827',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e  => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.375rem'
            }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                border: '1.5px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box',
                color: '#111827'
              }}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e  => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.375rem'
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                border: '1.5px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box',
                color: '#111827'
              }}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e  => e.target.style.borderColor = '#e5e7eb'}
            />
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
              Must be at least 6 characters
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: loading ? '#93c5fd' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.9375rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={e => { if (!loading) e.target.style.backgroundColor = '#1d4ed8' }}
            onMouseOut={e  => { if (!loading) e.target.style.backgroundColor = '#2563eb' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#6b7280',
          marginTop: '1.5rem',
          marginBottom: 0
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: '500', textDecoration: 'none' }}
            onMouseOver={e => e.target.style.textDecoration = 'underline'}
            onMouseOut={e  => e.target.style.textDecoration = 'none'}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}