// App — currently renders the throwaway T1.0 style guide so the palette and the
// shared ui/ components can be sanity-checked. Replaced by the real Navbar +
// routing shell in T1.1 (see docs/TASKS.md), at which point StyleGuide.jsx goes.
import StyleGuide from './StyleGuide';

export default function App() {
  return <StyleGuide />;
}
