// PostComposer — modal for asking a question (PRD 3.1). Added when resolving
// the gap where the PRD promised post creation but no Phase 1 task built it.
// Phase 1 prepends to the feed's local state only; POST /posts lands in T3.2.

import { useEffect, useRef, useState } from 'react';

import Button from './ui/Button';
import Input from './ui/Input';
import { DEPARTMENT_TAGS } from '../mocks/community';

const MAX_TITLE_LENGTH = 120;

export default function PostComposer({ onClose, onSubmit }) {
  const [values, setValues] = useState({ title: '', body: '', departmentTag: '' });
  const [errors, setErrors] = useState({});
  const dialogRef = useRef(null);

  // Close on Escape, and move focus into the dialog on open.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.querySelector('input, textarea')?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!values.title.trim()) {
      nextErrors.title = 'Give your question a title.';
    } else if (values.title.trim().length > MAX_TITLE_LENGTH) {
      nextErrors.title = `Keep the title under ${MAX_TITLE_LENGTH} characters.`;
    }
    if (!values.body.trim()) {
      nextErrors.body = 'Add some detail so people can answer.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      title: values.title.trim(),
      body: values.body.trim(),
      departmentTag: values.departmentTag || null,
    });
  }

  return (
    <div className="modal" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="composer-title"
        ref={dialogRef}
      >
        <header className="modal__header">
          <h2 id="composer-title">Ask a question</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            ✕
          </Button>
        </header>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Input
            label="Title"
            name="title"
            placeholder="What do you want to know?"
            value={values.title}
            onChange={handleChange}
            error={errors.title}
          />

          <Input
            label="Details"
            name="body"
            multiline
            placeholder="Add context — course, year, what you have already tried…"
            value={values.body}
            onChange={handleChange}
            error={errors.body}
          />

          <Input
            label="Department tag"
            name="departmentTag"
            as="select"
            value={values.departmentTag}
            onChange={handleChange}
            hint="Optional — helps the right people find your question."
          >
            <option value="">No tag</option>
            {DEPARTMENT_TAGS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </Input>

          <div className="profile__actions">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Post question
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
