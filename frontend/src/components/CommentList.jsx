// CommentList — flat comment list on a post (T1.4). No threading in MVP (D6).
// Renders the "No answers yet" empty state from PRD Section 6.

import { formatRelativeTime, initialsOf } from '../utils/date';

export default function CommentList({ comments }) {
  if (comments.length === 0) {
    return (
      <div className="page-state">
        <h3>No answers yet</h3>
        <p className="text-muted text-sm">Be the first to help out.</p>
      </div>
    );
  }

  return (
    <ul className="comment-list">
      {comments.map((comment) => {
        const { author } = comment;
        const authorMeta = [author.department, author.year ? `Year ${author.year}` : null]
          .filter(Boolean)
          .join(' · ');

        return (
          <li key={comment.id} className="comment">
            <span className="avatar avatar--sm" aria-hidden="true">
              {initialsOf(author.name)}
            </span>
            <div className="comment__content">
              <div className="comment__meta">
                <span className="comment__author">{author.name}</span>
                <span className="text-muted text-xs">{authorMeta}</span>
                <span className="text-muted text-xs comment__time">
                  {formatRelativeTime(comment.createdAt)}
                </span>
              </div>
              <p className="comment__body">{comment.body}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
