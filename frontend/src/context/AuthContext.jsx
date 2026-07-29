// AuthContext — FAKE local auth for Phase 1 (T1.2).
// No network calls, no JWT: login/signup just accept the form values and keep a
// user object in state + localStorage so the shell can show a signed-in state.
// Replaced by real /auth calls + JWT storage in T3.1 (see docs/TASKS.md).

import { useCallback, useMemo, useState } from 'react';

import { AuthContext } from './authStore';

const STORAGE_KEY = 'campus-connect:mock-user';

function readStoredUser() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistUser(user) {
  try {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore storage failures (private mode) — auth is fake in Phase 1 anyway.
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  // Phase 1: any well-formed credentials succeed. Real validation is T3.1.
  const login = useCallback(({ email }) => {
    const mockUser = {
      name: email.split('@')[0],
      email,
      department: null,
      year: null,
      bio: null,
    };
    setUser(mockUser);
    persistUser(mockUser);
    return mockUser;
  }, []);

  const signup = useCallback(({ name, email, department, year }) => {
    const mockUser = {
      name,
      email,
      department: department || null,
      year: year ? Number(year) : null,
      bio: null,
    };
    setUser(mockUser);
    persistUser(mockUser);
    return mockUser;
  }, []);

  // Profile edit (T1.9). Only department/year/bio are editable in MVP — name
  // and email are fixed (PRD 3.4). Becomes PATCH /auth/me in T3.5.
  const updateProfile = useCallback((changes) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = {
        ...prev,
        department: changes.department?.trim() || null,
        year: changes.year ? Number(changes.year) : null,
        bio: changes.bio?.trim() || null,
      };
      persistUser(next);
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    persistUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, signup, logout, updateProfile }),
    [user, login, signup, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
