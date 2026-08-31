import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LaunchScreen from './pages/LaunchScreen';

export default function App() {
  const { session, checking } = useAuth();

  // While we silently verify the stored token, show a branded launch screen —
  // never a flash of the login form for a user who's already signed in.
  if (checking) return <LaunchScreen />;

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={session ? <DashboardPage /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
