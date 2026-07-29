// CarpoolCreatePage — offer a ride (T1.7). UI only: validates, then returns to
// the list. POST /carpool/rides is wired in T3.3, and the origin/destination
// inputs become a Google Places map picker at the same time.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import MapView from '../components/MapView';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { toDateTimeLocalValue } from '../utils/date';

const MAX_SEATS = 6;
const MIN_SEATS = 1;

const EMPTY = {
  originText: '',
  destinationText: '',
  departureTime: '',
  notes: '',
};

export default function CarpoolCreatePage() {
  const navigate = useNavigate();

  const [values, setValues] = useState(EMPTY);
  const [seats, setSeats] = useState(1);
  const [errors, setErrors] = useState({});

  const minDeparture = toDateTimeLocalValue(new Date());

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const nextErrors = {};

    if (!values.originText.trim()) {
      nextErrors.originText = 'Where are you starting from?';
    }
    if (!values.destinationText.trim()) {
      nextErrors.destinationText = 'Where are you heading?';
    }
    if (!values.departureTime) {
      nextErrors.departureTime = 'Pick a departure time.';
    } else if (new Date(values.departureTime).getTime() <= Date.now()) {
      // A ride in the past would never show in the list (PRD Section 6).
      nextErrors.departureTime = 'Departure must be in the future.';
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Phase 1: nothing is persisted — the mock list is a static fixture.
    navigate('/carpool');
  }

  return (
    <div className="ride-create">
      <Link to="/carpool" className="text-sm">
        ← Back to Carpool
      </Link>

      <header className="page-header">
        <h1>Offer a ride</h1>
        <p className="text-muted text-sm">
          Share your route so other students can request a seat.
        </p>
      </header>

      <MapView
        height={200}
        origin={{ label: values.originText }}
        destination={{ label: values.destinationText }}
      />

      <Card as="section">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Input
            label="Origin"
            name="originText"
            placeholder="54 St Andrew St"
            value={values.originText}
            onChange={handleChange}
            error={errors.originText}
            hint="Map picker replaces this field in T3.3."
          />

          <Input
            label="Destination"
            name="destinationText"
            placeholder="Eastside City Park"
            value={values.destinationText}
            onChange={handleChange}
            error={errors.destinationText}
          />

          <Input
            label="Departure time"
            name="departureTime"
            type="datetime-local"
            min={minDeparture}
            value={values.departureTime}
            onChange={handleChange}
            error={errors.departureTime}
          />

          {/* Seat stepper, as in the reference's occupant control. */}
          <div className="ui-field">
            <span className="ui-field__label" id="seats-label">
              Seats available
            </span>
            <div className="stepper" role="group" aria-labelledby="seats-label">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSeats((prev) => Math.max(MIN_SEATS, prev - 1))}
                disabled={seats <= MIN_SEATS}
                aria-label="Remove a seat"
              >
                −
              </Button>
              <span className="stepper__value" aria-live="polite">
                {seats} {seats === 1 ? 'seat' : 'seats'}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSeats((prev) => Math.min(MAX_SEATS, prev + 1))}
                disabled={seats >= MAX_SEATS}
                aria-label="Add a seat"
              >
                +
              </Button>
            </div>
          </div>

          <Input
            label="Notes"
            name="notes"
            multiline
            placeholder="Anything passengers should know…"
            value={values.notes}
            onChange={handleChange}
          />

          <Button type="submit" size="lg" block>
            Offer a ride
          </Button>
        </form>
      </Card>
    </div>
  );
}
