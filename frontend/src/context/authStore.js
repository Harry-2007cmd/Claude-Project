// The auth context object lives here so AuthContext.jsx exports only the
// provider component and useAuth.js exports only the hook — that split is what
// keeps Vite fast refresh working for all three files.

import { createContext } from 'react';

export const AuthContext = createContext(null);
