// Input — shared labelled form field (T1.0). Styling lives in styles/tokens.css
// (.ui-field*). Renders an <input> by default; pass `multiline` for a textarea
// (post bodies, comments, ride notes) or `as="select"` with <option> children.

import { useId } from 'react';

export default function Input({
  label,
  hint,
  error,
  multiline = false,
  as,
  id,
  className = '',
  children,
  ...props
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;

  const Control = as || (multiline ? 'textarea' : 'input');

  const controlClasses = ['ui-field__control', error ? 'ui-field__control--error' : '', className]
    .filter(Boolean)
    .join(' ');

  const describedBy = [error ? errorId : '', hint ? hintId : ''].filter(Boolean).join(' ');

  return (
    <div className="ui-field">
      {label && (
        <label className="ui-field__label" htmlFor={fieldId}>
          {label}
        </label>
      )}
      <Control
        id={fieldId}
        className={controlClasses}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        {...props}
      >
        {children}
      </Control>
      {error && (
        <span id={errorId} className="ui-field__error" role="alert">
          {error}
        </span>
      )}
      {hint && !error && (
        <span id={hintId} className="ui-field__hint">
          {hint}
        </span>
      )}
    </div>
  );
}
