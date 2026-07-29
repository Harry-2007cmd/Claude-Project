// FoodPage — hero banner + browse grid (T1.8), the layout kept from the food
// reference and recoloured to the shared palette (D13). Mock data only:
// GET /food/recommendations (backend Places proxy, D8) is wired in T3.4.

import { useMemo, useState } from 'react';

import MapView from '../components/MapView';
import PlaceCard from '../components/PlaceCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { FOOD_CATEGORIES, MOCK_PLACES } from '../mocks/food';

const ALL = 'All';

export default function FoodPage() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [category, setCategory] = useState(ALL);
  const [savedIds, setSavedIds] = useState(() => new Set());
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const places = useMemo(() => {
    const needle = submittedQuery.trim().toLowerCase();

    return MOCK_PLACES.filter((place) => {
      const matchesQuery =
        !needle ||
        place.name.toLowerCase().includes(needle) ||
        place.category.toLowerCase().includes(needle) ||
        place.address.toLowerCase().includes(needle);

      const matchesCategory = category === ALL || place.category === category;
      const matchesSaved = !showSavedOnly || savedIds.has(place.placeId);

      return matchesQuery && matchesCategory && matchesSaved;
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [submittedQuery, category, showSavedOnly, savedIds]);

  function handleSearch(event) {
    event.preventDefault();
    setSubmittedQuery(query);
  }

  // A Set keyed by place_id, so saving twice is impossible (PRD Section 6).
  function handleToggleSave(place) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(place.placeId)) {
        next.delete(place.placeId);
      } else {
        next.add(place.placeId);
      }
      return next;
    });
  }

  return (
    <div className="food">
      {/* Hero search banner — reference's "Are you starving?" panel. */}
      <section className="food-hero">
        <div className="food-hero__content">
          <h1>Hungry on campus?</h1>
          <p className="text-muted text-sm">
            Find food spots near you in a few clicks.
          </p>

          <form className="food-hero__search" onSubmit={handleSearch} role="search">
            <Input
              label="Search"
              name="query"
              placeholder="Search a place, cuisine or street"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="food-hero__input"
            />
            <Button type="submit" size="md">
              Find food
            </Button>
          </form>

          {/* Manual search is also the fallback when location is denied
              (PRD Section 6); the real permission prompt lands in T3.4. */}
          <p className="text-muted text-xs">
            Showing places near campus. Location permission is requested in T3.4.
          </p>
        </div>
      </section>

      <MapView
        height={220}
        markers={places.map((place) => ({
          key: place.placeId,
          label: place.name,
          lat: place.lat,
          lng: place.lng,
          highlighted: savedIds.has(place.placeId),
        }))}
      />

      <div className="chips" role="group" aria-label="Filter by category">
        {FOOD_CATEGORIES.map((option) => (
          <button
            key={option}
            type="button"
            className={option === category ? 'chip chip--active' : 'chip'}
            aria-pressed={option === category}
            onClick={() => setCategory(option)}
          >
            {option}
          </button>
        ))}
        <button
          type="button"
          className={showSavedOnly ? 'chip chip--active' : 'chip'}
          aria-pressed={showSavedOnly}
          onClick={() => setShowSavedOnly((prev) => !prev)}
        >
          ♥ Favorites{savedIds.size > 0 ? ` (${savedIds.size})` : ''}
        </button>
      </div>

      {places.length === 0 ? (
        <div className="page-state">
          <h3>No places found nearby</h3>
          <p className="text-muted text-sm">
            {showSavedOnly
              ? 'You have not saved any places yet.'
              : 'Try a different search or category.'}
          </p>
        </div>
      ) : (
        <div className="place-grid">
          {places.map((place) => (
            <PlaceCard
              key={place.placeId}
              place={place}
              isSaved={savedIds.has(place.placeId)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
