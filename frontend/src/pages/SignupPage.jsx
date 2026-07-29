// SignupPage — UI only (T1.2). Fields mirror POST /auth/signup
// (ARCHITECTURE.md Section 4): name, email, password, department, year.
// Submit is fake — validates, sets a mock user, redirects to Community.
// Wired to the real endpoint in T3.1.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { useAuth } from '../context/useAuth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const YEARS = [1, 2, 3, 4];

const EMPTY = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  department: '',
  year: '',
};

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const nextErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = 'Full name is required.';
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!EMAIL_PATTERN.test(values.email.trim())) {
      nextErrors.email = "Something doesn't look right here.";
    }

    if (!values.password) {
      nextErrors.password = 'Password is required.';
    } else if (values.password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    if (values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    signup({
      name: values.name.trim(),
      email: values.email.trim(),
      department: values.department.trim(),
      year: values.year,
    });
    navigate('/community', { replace: true });
  }

  return (
    <div className="auth-shell">
      <Card className="auth-card" as="section">
        <header className="auth-card__header">
          <span className="auth-card__brand">Campus Connect</span>
          <h1>Welcome onboard!</h1>
          <p className="text-muted text-sm">One more step and you&apos;ll be ready to go.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Input
            label="Full name"
            name="name"
            autoComplete="name"
            placeholder="Complete your full name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Complete your email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
          />

          <Input
            label="Confirm password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          <div className="auth-form__row">
            <Input
              label="Department"
              name="department"
              placeholder="Computer Science"
              value={values.department}
              onChange={handleChange}
            />

            <Input label="Year" name="year" as="select" value={values.year} onChange={handleChange}>
              <option value="">Select</option>
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  Year {year}
                </option>
              ))}
            </Input>
          </div>

          <Button type="submit" size="lg" block disabled={submitting}>
            Continue
          </Button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </Card>
    </div>
  );
}
