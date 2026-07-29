// LoginPage — UI only (T1.2). This is the landing page (D14).
// Submit is fake: it validates, then drops a mock user into AuthContext and
// redirects to Community. Wired to POST /auth/login in T3.1.

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { useAuth } from '../context/useAuth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Where the user was headed before the guard bounced them here.
  const redirectTo = location.state?.from ?? '/community';

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const nextErrors = {};
    if (!values.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!EMAIL_PATTERN.test(values.email.trim())) {
      nextErrors.email = "Something doesn't look right here.";
    }
    if (!values.password) {
      nextErrors.password = 'Password is required.';
    }
    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    login({ email: values.email.trim() });
    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="auth-shell">
      <Card className="auth-card" as="section">
        <header className="auth-card__header">
          <span className="auth-card__brand">Campus Connect</span>
          <h1>Welcome back!</h1>
          <p className="text-muted text-sm">Complete your details to log into your account.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Your email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Button type="submit" size="lg" block disabled={submitting}>
            Log in
          </Button>
        </form>

        <p className="auth-card__footer">
          Are you new here? <Link to="/signup">Create an account</Link>
        </p>
      </Card>
    </div>
  );
}
