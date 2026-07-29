// RideCard — one ride in the Carpool list (T1.5). Uses the reference's
// "Your location → Destination" stacked row with a teal origin dot and purple
// destination dot, plus distance on the right (design-reference 10K/10L).

import { useNavigate } from 'react-router-dom';

import Card from './ui/Card';
import { formatDeparture, initialsOf } from '../utils/date';

export default function RideCard({ ride }) {
  const navigate = useNavigate();
  const seatsLabel =
    ride.seatsAvailable === 0
      ? 'No seats left'
      : `${ride.seatsAvailable} seat${ride.seatsAvailable === 1 ? '' : 's'} left`;

  return (
    <Card
      interactive
      className="ride-card"
      onClick={() => navigate(`/carpool/${ride.id}`)}
      aria-label={`Open ride from ${ride.originText} to ${ride.destinationText}`}
    >
      <div className="ride-card__header">
        <span className="avatar" aria-hidden="true">
          {initialsOf(ride.driver.name)}
        </span>
        <span className="post-card__author-text">
          <span className="post-card__author-name">{ride.driver.name}</span>
          <span className="text-muted text-xs">{formatDeparture(ride.departureTime)}</span>
        </span>
        {typeof ride.distanceKm === 'number' && (
          <span className="ride-card__distance text-xs">{ride.distanceKm} km</span>
        )}
      </div>

      <div className="route">
        <div className="route__row">
          <span className="route__dot route__dot--origin" aria-hidden="true" />
          <span className="route__labels">
            <span className="route__title">Your location</span>
            <span className="text-muted text-xs">{ride.originText}</span>
          </span>
        </div>
        <div className="route__row">
          <span className="route__dot route__dot--dest" aria-hidden="true" />
          <span className="route__labels">
            <span className="route__title">{ride.destinationText}</span>
            <span className="text-muted text-xs">Destination</span>
          </span>
        </div>
      </div>

      <div className="ride-card__footer">
        <span className={ride.seatsAvailable === 0 ? 'tag tag--muted' : 'tag'}>{seatsLabel}</span>
        {ride.driver.isCurrentUser && <span className="tag tag--primary">Your ride</span>}
      </div>
    </Card>
  );
}
