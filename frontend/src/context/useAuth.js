// useAuth — kept in its own module so AuthContext.jsx only exports components.
// Mixing a hook and a component in one file breaks Vite fast refresh for that
// file (it forces a full page reload on every edit).

import { useContext } from 'react';

import { AuthContext } from './authStore';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return context;
}
