// PlaceCard — one food place in the browse grid (T1.8). Keeps the reference's
// card shape (image tile with a corner badge, name, meta, action) with the
// rating badge taking the place of the reference's discount badge, recoloured
// to the shared palette per D13.
//
// Photos come from the Places proxy in T3.4; until then the tile is a tinted
// placeholder derived from the category.

import Button from './ui/Button';

const CATEGORY_GLYPH = {
  Cafe: '☕',
  'Fast food': '🍟',
  'South Indian': '🍛',
  Bakery: '🥐',
  Dessert: '🍨',
};

export default function PlaceCard({ place, isSaved, onToggleSave }) {
  return (
    <article className="place-card">
      <div className="place-card__media" aria-hidden="true">
        <span className="place-card__glyph">{CATEGORY_GLYPH[place.category] ?? '🍽️'}</span>
        <span className="place-card__badge">★ {place.rating.toFixed(1)}</span>
      </div>

      <div className="place-card__body">
        <h3 className="place-card__name">{place.name}</h3>

        <p className="text-muted text-xs place-card__meta">
          {place.category} · {place.distanceKm} km · {'₹'.repeat(place.priceLevel)}
        </p>

        <p className="text-muted text-xs">{place.address}</p>

        <div className="place-card__footer">
          <span className={place.openNow ? 'status status--accepted' : 'status status--declined'}>
            {place.openNow ? 'Open now' : 'Closed'}
          </span>
          <span className="text-muted text-xs">
            {place.userRatingsTotal.toLocaleString()} ratings
          </span>
        </div>

        {/* Toggling off removes the favorite, so a place can never be saved
            twice (PRD Section 6). */}
        <Button
          variant={isSaved ? 'secondary' : 'primary'}
          size="sm"
          block
          onClick={() => onToggleSave(place)}
          aria-pressed={isSaved}
        >
          {isSaved ? 'Saved' : 'Save'}
        </Button>
      </div>
    </article>
  );
}
