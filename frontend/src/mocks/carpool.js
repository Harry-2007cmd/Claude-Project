// Mock Carpool data for Phase 1 (T1.5–T1.7). Wired to /carpool/* in T3.3.
// Shape mirrors carpool_rides / carpool_requests in ARCHITECTURE.md Section 3.
//
// Coordinates are real Birmingham-ish points so the placeholder map has
// something plausible to draw; the live Google Map replaces it in T3.3.

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const fromNow = (ms) => new Date(Date.now() + ms).toISOString();

export const MOCK_RIDES = [
  {
    id: 1,
    driver: { name: 'Ananya R.', department: 'Computer Science', year: 3, isCurrentUser: false },
    originText: '54 St Andrew St',
    destinationText: 'Eastside City Park',
    originLat: 52.4796,
    originLng: -1.8853,
    destinationLat: 52.4823,
    destinationLng: -1.8887,
    departureTime: fromNow(3 * HOUR),
    seatsAvailable: 3,
    distanceKm: 4.5,
    notes: 'Leaving from the hostel gate. Two bags max, please be on time.',
    status: 'active',
    requests: [],
  },
  {
    id: 2,
    driver: { name: 'Rohit K.', department: 'Mechanical', year: 2, isCurrentUser: false },
    originText: 'North Campus Gate',
    destinationText: 'Central Railway Station',
    originLat: 52.4862,
    originLng: -1.8904,
    destinationLat: 52.4778,
    destinationLng: -1.8996,
    departureTime: fromNow(6 * HOUR),
    seatsAvailable: 0, // 0 seats → request button disabled (PRD Section 6)
    distanceKm: 6.2,
    notes: 'Boot space is limited, hand luggage only.',
    status: 'active',
    requests: [],
  },
  {
    id: 3,
    // Driven by the signed-in user → shows the driver view, not a request button.
    driver: { name: 'You', department: null, year: null, isCurrentUser: true },
    originText: 'Library Block C',
    destinationText: 'Airport Terminal 2',
    originLat: 52.4508,
    originLng: -1.7439,
    destinationLat: 52.4539,
    destinationLng: -1.7480,
    departureTime: fromNow(DAY + 2 * HOUR),
    seatsAvailable: 2,
    distanceKm: 14.8,
    notes: 'Early start — I will wait 10 minutes max at the pickup point.',
    status: 'active',
    requests: [
      {
        id: 31,
        passenger: { name: 'Meera S.', department: 'Business', year: 4 },
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * HOUR).toISOString(),
      },
      {
        id: 32,
        passenger: { name: 'Dev P.', department: 'Electrical', year: 2 },
        status: 'pending',
        createdAt: new Date(Date.now() - HOUR).toISOString(),
      },
      {
        id: 33,
        passenger: { name: 'Sana M.', department: 'Civil', year: 1 },
        status: 'accepted',
        createdAt: new Date(Date.now() - 3 * HOUR).toISOString(),
      },
    ],
  },
  {
    id: 4,
    driver: { name: 'Kabir N.', department: 'Computer Science', year: 4, isCurrentUser: false },
    originText: 'South Hostel Block',
    destinationText: 'City Centre Mall',
    originLat: 52.4712,
    originLng: -1.8801,
    destinationLat: 52.4791,
    destinationLng: -1.9026,
    departureTime: fromNow(2 * DAY),
    seatsAvailable: 1,
    distanceKm: 5.1,
    notes: '',
    status: 'active',
    requests: [],
  },
  {
    id: 5,
    driver: { name: 'Priya V.', department: 'Civil', year: 3, isCurrentUser: false },
    originText: 'Main Gate',
    destinationText: 'Riverside Sports Complex',
    originLat: 52.4655,
    originLng: -1.8712,
    destinationLat: 52.4601,
    destinationLng: -1.8555,
    departureTime: fromNow(-4 * HOUR), // already departed → hidden from the list
    seatsAvailable: 2,
    distanceKm: 3.4,
    notes: '',
    status: 'active',
    requests: [],
  },
  {
    id: 6,
    driver: { name: 'Omar F.', department: 'Electrical', year: 3, isCurrentUser: false },
    originText: 'Engineering Block',
    destinationText: 'Old Town Market',
    originLat: 52.4688,
    originLng: -1.8764,
    destinationLat: 52.4832,
    destinationLng: -1.8931,
    departureTime: fromNow(9 * HOUR),
    seatsAvailable: 2,
    distanceKm: 7.3,
    notes: 'Car trouble — sorry everyone.',
    status: 'cancelled', // soft-cancelled state (PRD Section 6)
    requests: [],
  },
];

// Upcoming = not departed and not cancelled (PRD Section 6).
export function upcomingRides(rides = MOCK_RIDES) {
  const now = Date.now();
  return rides
    .filter((ride) => ride.status !== 'cancelled')
    .filter((ride) => new Date(ride.departureTime).getTime() > now)
    .sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
}

// Profile → My Rides (T1.9). Real source is GET /profile/rides in T3.5.
// Includes past and cancelled rides — this is the driver's own history, not the
// public upcoming list.
export function myMockRides() {
  return MOCK_RIDES.filter((ride) => ride.driver.isCurrentUser).sort(
    (a, b) => new Date(b.departureTime) - new Date(a.departureTime),
  );
}

export function findMockRide(rideId) {
  return MOCK_RIDES.find((ride) => String(ride.id) === String(rideId)) ?? null;
}
