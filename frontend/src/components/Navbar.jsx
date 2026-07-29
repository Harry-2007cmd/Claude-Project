// Navbar — persistent shell nav (T1.1). Community / Carpool / Food / Profile,
// per ARCHITECTURE.md 5.3 and DECISIONS.md D14. Styling lives in tokens.css
// (.navbar*). Only rendered inside the protected layout — see App.jsx.
// The log-out control uses the fake AuthContext from T1.2.

import { NavLink, useNavigate } from 'react-router-dom';

import Button from './ui/Button';
import { useAuth } from '../context/useAuth';

const LINKS = [
  { to: '/community', label: 'Community' },
  { to: '/carpool', label: 'Carpool' },
  { to: '/food', label: 'Food' },
  { to: '/profile', label: 'Profile' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="navbar">
      <nav className="navbar__inner" aria-label="Main">
        <NavLink to="/community" className="navbar__brand">
          Campus&nbsp;Connect
        </NavLink>

        <ul className="navbar__links">
          {LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="navbar__user">
          {user?.name && <span className="navbar__username">{user.name}</span>}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </nav>
    </header>
  );
}
