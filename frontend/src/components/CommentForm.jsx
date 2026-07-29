// CommentForm — add an answer to a post (T1.4). Phase 1 only appends to the
// page's local state; POST /posts/{id}/comments is wired in T3.2.

import { useState } from 'react';

import Button from './ui/Button';
import Input from './ui/Input';

export default function CommentForm({ onSubmit }) {
  const [body, setBody] = useState('');
  const [error, setError] = useState(undefined);

  function handleSubmit(event) {
    event.preventDefault();

    if (!body.trim()) {
      setError('Write something before posting.');
      return;
    }

    onSubmit(body.trim());
    setBody('');
    setError(undefined);
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit} noValidate>
      <Input
        label="Your answer"
        name="body"
        multiline
        placeholder="Share what you know…"
        value={body}
        onChange={(event) => {
          setBody(event.target.value);
          setError(undefined);
        }}
        error={error}
      />
      <div className="comment-form__actions">
        <Button type="submit" size="sm">
          Post answer
        </Button>
      </div>
    </form>
  );
}
