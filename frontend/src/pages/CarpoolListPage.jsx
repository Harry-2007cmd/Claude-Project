// CarpoolListPage — upcoming rides (T1.5). Mock data only; GET /carpool/rides
// arrives in T3.3. Departed and cancelled rides are filtered out of the list
// (PRD Section 6) by upcomingRides().

import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import RideCard from '../components/RideCard';
import Button from '../components/ui/Button';
import { upcomingRides } from '../mocks/carpool';

export default function CarpoolListPage() {
  const rides = useMemo(() => upcomingRides(), []);

  return (
    <div className="feed">
      <header className="page-header page-header--with-action">
        <div>
          <h1>Carpool</h1>
          <p className="text-muted text-sm">Upcoming rides shared by other students.</p>
        </div>
        <Link to="/carpool/new">
          <Button size="sm">Offer a ride</Button>
        </Link>
      </header>

      {rides.length === 0 ? (
        <div className="page-state">
          <h3>No upcoming rides</h3>
          <p className="text-muted text-sm">Be the first to offer one.</p>
        </div>
      ) : (
        <div className="feed__list">
          {rides.map((ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))}
        </div>
      )}
    </div>
  );
}
