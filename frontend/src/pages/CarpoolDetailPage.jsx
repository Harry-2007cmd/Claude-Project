// CarpoolDetailPage — map + bottom-sheet layout (T1.6), the closest page to the
// carpool reference (10K/10L): full-bleed map with a sheet of ride detail and a
// purple CTA sitting over it. Mock data only until T3.3.
//
// Covers the PRD Section 6 cases: own ride shows the driver's request list
// instead of a request button, zero seats disables it, a cancelled ride says so,
// and accepting past seat capacity is blocked.

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import MapView from '../components/MapView';
import RideRequestButton from '../components/RideRequestButton';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { findMockRide } from '../mocks/carpool';
import { formatDeparture, formatRelativeTime, initialsOf } from '../utils/date';

export default function CarpoolDetailPage() {
  const { rideId } = useParams();
  const ride = findMockRide(rideId);

  // Local mock state: seat requests and remaining capacity.
  const [requests, setRequests] = useState(() => ride?.requests ?? []);
  const [seatsLeft, setSeatsLeft] = useState(() => ride?.seatsAvailable ?? 0);
  const [myRequestStatus, setMyRequestStatus] = useState(null);
  const [capacityError, setCapacityError] = useState('');

  if (!ride) {
    return (
      <div className="page-state">
        <h1>Ride not found</h1>
        <p className="text-muted">
          It may have been cancelled. <Link to="/carpool">Back to Carpool</Link>
        </p>
      </div>
    );
  }

  function handleRequestSeat() {
    setMyRequestStatus('pending');
  }

  function handleDecision(requestId, nextStatus) {
    setCapacityError('');

    if (nextStatus === 'accepted' && seatsLeft === 0) {
      // Seat count is validated on accept (PRD Section 6).
      setCapacityError('No seats left — decline a request or add a seat first.');
      return;
    }

    setRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, status: nextStatus } : request,
      ),
    );

    if (nextStatus === 'accepted') {
      setSeatsLeft((prev) => Math.max(0, prev - 1));
    }
  }

  const pendingCount = requests.filter((request) => request.status === 'pending').length;

  return (
    <div className="ride-detail">
      <Link to="/carpool" className="text-sm">
        ← Back to Carpool
      </Link>

      <MapView
        height={300}
        origin={{ lat: ride.originLat, lng: ride.originLng, label: ride.originText }}
        destination={{
          lat: ride.destinationLat,
          lng: ride.destinationLng,
          label: ride.destinationText,
        }}
      />

      {/* Bottom sheet, overlapping the map like the reference. */}
      <Card className="ride-sheet">
        <div className="ride-card__header">
          <span className="avatar" aria-hidden="true">
            {initialsOf(ride.driver.name)}
          </span>
          <span className="post-card__author-text">
            <span className="post-card__author-name">{ride.driver.name}</span>
            <span className="text-muted text-xs">
              {[ride.driver.department, ride.driver.year ? `Year ${ride.driver.year}` : null]
                .filter(Boolean)
                .join(' · ') || 'Driver'}
            </span>
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

        <dl className="ride-sheet__facts">
          <div>
            <dt className="text-muted text-xs">Departs</dt>
            <dd>{formatDeparture(ride.departureTime)}</dd>
          </div>
          <div>
            <dt className="text-muted text-xs">Seats left</dt>
            <dd>{seatsLeft}</dd>
          </div>
        </dl>

        {ride.notes && <p className="text-sm text-muted">{ride.notes}</p>}

        {ride.status === 'cancelled' && (
          <p className="auth-form__banner">This ride was cancelled by the driver.</p>
        )}

        <RideRequestButton
          ride={ride}
          requestStatus={myRequestStatus}
          onRequest={handleRequestSeat}
        />
      </Card>

      {/* Driver-only: accept or decline seat requests on your own ride. */}
      {ride.driver.isCurrentUser && (
        <section className="ride-requests">
          <h2>
            Seat requests{pendingCount > 0 ? ` · ${pendingCount} pending` : ''}
          </h2>

          {capacityError && <p className="auth-form__banner">{capacityError}</p>}

          {requests.length === 0 ? (
            <div className="page-state">
              <h3>No requests yet</h3>
              <p className="text-muted text-sm">Passengers will show up here.</p>
            </div>
          ) : (
            <ul className="request-list">
              {requests.map((request) => (
                <li key={request.id} className="request">
                  <span className="avatar avatar--sm" aria-hidden="true">
                    {initialsOf(request.passenger.name)}
                  </span>
                  <span className="request__text">
                    <span className="post-card__author-name">{request.passenger.name}</span>
                    <span className="text-muted text-xs">
                      {[
                        request.passenger.department,
                        request.passenger.year ? `Year ${request.passenger.year}` : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}{' '}
                      · {formatRelativeTime(request.createdAt)}
                    </span>
                  </span>

                  {request.status === 'pending' ? (
                    <span className="request__actions">
                      <Button size="sm" onClick={() => handleDecision(request.id, 'accepted')}>
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDecision(request.id, 'declined')}
                      >
                        Decline
                      </Button>
                    </span>
                  ) : (
                    <span className={`status status--${request.status}`}>{request.status}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
