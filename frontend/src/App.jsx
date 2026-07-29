// App — shared shell + routing (T1.1), with the Phase 1 fake auth guard (T1.2).
// Route map per ARCHITECTURE.md 5.4 / DECISIONS.md D14: landing page is Login,
// Community is home after auth.
//
// The guard reads the mock AuthContext; it starts enforcing real JWTs in T3.1
// without the route map needing to change.

import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import { useAuth } from './context/useAuth';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CommunityFeedPage from './pages/CommunityFeedPage';
import PostDetailPage from './pages/PostDetailPage';
import CarpoolListPage from './pages/CarpoolListPage';
import CarpoolDetailPage from './pages/CarpoolDetailPage';
import CarpoolCreatePage from './pages/CarpoolCreatePage';
import FoodPage from './pages/FoodPage';
import ProfilePage from './pages/ProfilePage';

// Wraps the four signed-in features: persistent Navbar + centered page column.
// Signed-out visitors bounce to Login, remembering where they were headed.
function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-shell__main">
        <Outlet />
      </main>
    </div>
  );
}

// Login/Signup render full-bleed with no Navbar, and are skipped once signed in.
function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/community" replace /> : children;
}

function NotFoundPage() {
  return (
    <div className="page-state">
      <h1>Page not found</h1>
      <p className="text-muted">That link doesn&apos;t go anywhere yet.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Landing page is Login (D14) */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        }
      />

      <Route element={<ProtectedLayout />}>
        <Route path="/community" element={<CommunityFeedPage />} />
        <Route path="/community/:postId" element={<PostDetailPage />} />
        <Route path="/carpool" element={<CarpoolListPage />} />
        <Route path="/carpool/new" element={<CarpoolCreatePage />} />
        <Route path="/carpool/:rideId" element={<CarpoolDetailPage />} />
        <Route path="/food" element={<FoodPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
