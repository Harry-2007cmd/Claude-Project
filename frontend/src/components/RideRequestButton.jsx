// RideRequestButton — seat request CTA (T1.6). Encapsulates the states from
// PRD Section 6: own ride, no seats left, cancelled ride, already requested.
// Phase 1 only flips local state; POST /carpool/rides/{id}/request lands in T3.3.

import Button from './ui/Button';

export default function RideRequestButton({ ride, requestStatus, onRequest }) {
  if (ride.driver.isCurrentUser) {
    return (
      <p className="text-muted text-sm">You are driving this ride.</p>
    );
  }

  if (ride.status === 'cancelled') {
    return (
      <Button size="lg" block disabled>
        Ride cancelled
      </Button>
    );
  }

  if (requestStatus) {
    const label = {
      pending: 'Request sent',
      accepted: 'Seat confirmed',
      declined: 'Request declined',
    }[requestStatus];

    return (
      <Button size="lg" block disabled>
        {label}
      </Button>
    );
  }

  if (ride.seatsAvailable === 0) {
    return (
      <Button size="lg" block disabled>
        No seats left
      </Button>
    );
  }

  return (
    <Button size="lg" block onClick={onRequest}>
      Request seat
    </Button>
  );
}
