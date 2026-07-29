// Shared date formatting helpers. Used by Community now (T1.3/T1.4) and by
// Carpool departure times later.

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// "just now" / "3h ago" / "2d ago", falling back to a date past a week.
export function formatRelativeTime(isoString) {
  const timestamp = new Date(isoString).getTime();
  if (Number.isNaN(timestamp)) return '';

  const elapsed = Date.now() - timestamp;

  if (elapsed < MINUTE) return 'just now';
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m ago`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h ago`;
  if (elapsed < 7 * DAY) return `${Math.floor(elapsed / DAY)}d ago`;

  return new Date(timestamp).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  });
}

// "Today, 18:30" / "Tomorrow, 07:15" / "Fri 3 Aug, 09:00" — carpool departures.
export function formatDeparture(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';

  const time = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const dayOffset = Math.floor((date - startOfToday) / DAY);

  if (dayOffset === 0) return `Today, ${time}`;
  if (dayOffset === 1) return `Tomorrow, ${time}`;
  if (dayOffset === -1) return `Yesterday, ${time}`;

  const day = date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  return `${day}, ${time}`;
}

// Value for a <input type="datetime-local"> min attribute, in local time.
export function toDateTimeLocalValue(date) {
  const offsetMs = date.getTimezoneOffset() * MINUTE;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

// "AR" from "Ananya R." — used for the avatar placeholder.
export function initialsOf(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}
