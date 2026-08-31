import { useAuth } from '../AuthContext';
import { SCHOOL } from '../config';

export default function DashboardPage() {
  const { session, logout } = useAuth();
  const name = session?.user?.full_name || session?.user?.family_name || 'there';

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <div className="app-header-eyebrow">{SCHOOL.name}</div>
          <h1>Hi, {name.split(' ')[0]}</h1>
        </div>
        <button className="icon-btn" onClick={logout} aria-label="Sign out">⏻</button>
      </header>

      <main className="app-content">
        <div className="proof-card">
          <div className="proof-card-title">Skeleton is live</div>
          <p>
            This page loaded because your token was verified against acad.com.ng
            and hasn't been revoked — not because a session timer hasn't run out.
            The next step is porting each screen from <code>core/staff/*.php</code>{' '}
            into pages like this one, calling the matching JSON endpoint.
          </p>
        </div>
      </main>

      <nav className="app-tabbar" aria-label="Primary">
        <button className="tab active">Home</button>
        <button className="tab">Classes</button>
        <button className="tab">Attendance</button>
        <button className="tab">Profile</button>
      </nav>
    </div>
  );
}
