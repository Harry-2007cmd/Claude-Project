// MapView — STATIC placeholder for T1.6 / T1.8. Draws either a stylised route
// between origin and destination (Carpool) or a scatter of pins (Food), so the
// surrounding layout can be judged without a key. T3.3/T3.4 replace the body
// with the Google Maps JS API using VITE_GOOGLE_MAPS_API_KEY; the props below
// are the ones it will need.

// Spreads pins deterministically across the viewBox — the placeholder shows
// relative positions, not real geography.
function scatterPins(markers) {
  const lats = markers.map((marker) => marker.lat).filter((value) => typeof value === 'number');
  const lngs = markers.map((marker) => marker.lng).filter((value) => typeof value === 'number');

  if (lats.length !== markers.length || lngs.length !== markers.length) {
    return markers.map((marker, index) => ({
      ...marker,
      x: 50 + ((index * 67) % 220),
      y: 60 + ((index * 91) % 160),
    }));
  }

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latSpan = maxLat - minLat || 1;
  const lngSpan = maxLng - minLng || 1;

  return markers.map((marker) => ({
    ...marker,
    x: 50 + ((marker.lng - minLng) / lngSpan) * 220,
    y: 220 - ((marker.lat - minLat) / latSpan) * 160,
  }));
}

// Projects the two points into the viewBox so the route roughly matches their
// real bearing. Falls back to a diagonal when coordinates are missing.
function projectRoute(origin, destination) {
  const fallback = { from: { x: 60, y: 210 }, to: { x: 260, y: 70 } };
  if (
    typeof origin?.lat !== 'number' ||
    typeof origin?.lng !== 'number' ||
    typeof destination?.lat !== 'number' ||
    typeof destination?.lng !== 'number'
  ) {
    return fallback;
  }

  const latSpan = destination.lat - origin.lat;
  const lngSpan = destination.lng - origin.lng;
  if (latSpan === 0 && lngSpan === 0) return fallback;

  // Normalise the bearing into a 200x140 box with 60px padding.
  const scale = Math.max(Math.abs(latSpan), Math.abs(lngSpan));
  const dx = (lngSpan / scale) * 100;
  const dy = (latSpan / scale) * 70;

  return {
    from: { x: 160 - dx, y: 140 + dy },
    to: { x: 160 + dx, y: 140 - dy },
  };
}

export default function MapView({
  origin,
  destination,
  markers,
  height = 260,
  className = '',
}) {
  const isScatter = Array.isArray(markers);
  const pins = isScatter ? scatterPins(markers) : [];

  const { from, to } = isScatter ? { from: null, to: null } : projectRoute(origin, destination);
  const midX = isScatter ? 0 : (from.x + to.x) / 2 + 30;
  const midY = isScatter ? 0 : (from.y + to.y) / 2;

  let label = 'Map placeholder';
  if (isScatter) {
    label = `Map placeholder showing ${pins.length} nearby place${pins.length === 1 ? '' : 's'}`;
  } else if (origin?.label && destination?.label) {
    label = `Map placeholder showing the route from ${origin.label} to ${destination.label}`;
  }

  return (
    <div
      className={['map-view', className].filter(Boolean).join(' ')}
      style={{ height: `${height}px` }}
      role="img"
      aria-label={label}
    >
      <svg viewBox="0 0 320 280" preserveAspectRatio="xMidYMid slice" className="map-view__canvas">
        {/* Street grid suggestion */}
        <g className="map-view__grid">
          <path d="M0 60 H320 M0 140 H320 M0 220 H320 M70 0 V280 M170 0 V280 M250 0 V280" />
          <path d="M-20 240 L140 80 L320 120" />
        </g>

        {isScatter ? (
          pins.map((pin) => (
            <g key={pin.key ?? pin.label}>
              <circle
                className={
                  pin.highlighted
                    ? 'map-view__pin map-view__pin--dest'
                    : 'map-view__pin map-view__pin--origin'
                }
                cx={pin.x}
                cy={pin.y}
                r="8"
              />
              <circle className="map-view__pin-dot" cx={pin.x} cy={pin.y} r="3" />
            </g>
          ))
        ) : (
          <>
            {/* Route */}
            <path
              className="map-view__route"
              d={`M${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
              fill="none"
            />

            {/* Origin (accent) and destination (primary) markers */}
            <circle className="map-view__pin map-view__pin--origin" cx={from.x} cy={from.y} r="8" />
            <circle className="map-view__pin-dot" cx={from.x} cy={from.y} r="3" />
            <circle className="map-view__pin map-view__pin--dest" cx={to.x} cy={to.y} r="8" />
            <circle className="map-view__pin-dot" cx={to.x} cy={to.y} r="3" />
          </>
        )}
      </svg>

      <span className="map-view__badge text-xs">
        Map placeholder · live map added in Phase 3
      </span>
    </div>
  );
}
