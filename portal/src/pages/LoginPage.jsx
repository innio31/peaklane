import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { SCHOOL } from '../config';

const ROLES = [
  { key: 'student', label: 'Student', hint: 'Admission number' },
  { key: 'staff', label: 'Staff', hint: 'Staff ID' },
  { key: 'parent', label: 'Parent', hint: 'Username' },
  { key: 'admin', label: 'Admin', hint: 'Username' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const activeRole = ROLES.find((r) => r.key === role);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(role, username, password);
    } catch (err) {
      const messages = {
        invalid_credentials: `That ${activeRole.hint.toLowerCase()} and password don't match.`,
        password_change_required: 'Your password needs to be changed before you can sign in on a new device.',
        invalid_request: 'Enter both fields to continue.',
      };
      setError(messages[err.message] || "Couldn't sign in — check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-mark">{SCHOOL.code}</div>
        <h1>{SCHOOL.name}</h1>

        <div className="role-tabs" role="tablist" aria-label="Sign in as">
          {ROLES.map((r) => (
            <button
              key={r.key}
              type="button"
              role="tab"
              aria-selected={role === r.key}
              className={role === r.key ? 'role-tab active' : 'role-tab'}
              onClick={() => { setRole(r.key); setError(''); }}
            >
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            {activeRole.hint}
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="login-note">You'll stay signed in on this device until you sign out.</p>
      </div>
    </div>
  );
}
