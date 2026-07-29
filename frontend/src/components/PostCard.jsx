// PostCard — one post in the Community feed (T1.3). Layout follows the
// community reference (avatar + author row, title, body preview, tag +
// comment count footer), re-skinned into the shared dark palette per D13.
// Body is clamped here; the full text lives on the detail page (PRD Section 6).

import { useNavigate } from 'react-router-dom';

import Card from './ui/Card';
import { formatRelativeTime, initialsOf } from '../utils/date';

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const { author } = post;

  const authorMeta = [author.department, author.year ? `Year ${author.year}` : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <Card
      interactive
      className="post-card"
      onClick={() => navigate(`/community/${post.id}`)}
      aria-label={`Open post: ${post.title}`}
    >
      <div className="post-card__author">
        <span className="avatar" aria-hidden="true">
          {initialsOf(author.name)}
        </span>
        <span className="post-card__author-text">
          <span className="post-card__author-name">{author.name}</span>
          <span className="text-muted text-xs">{authorMeta}</span>
        </span>
        <span className="text-muted text-xs post-card__time">
          {formatRelativeTime(post.createdAt)}
        </span>
      </div>

      <h3 className="post-card__title">{post.title}</h3>
      <p className="post-card__body">{post.body}</p>

      <div className="post-card__footer">
        {post.departmentTag && <span className="tag">{post.departmentTag}</span>}
        <span className="text-muted text-xs">
          {post.commentCount === 0
            ? 'No answers yet'
            : `${post.commentCount} ${post.commentCount === 1 ? 'answer' : 'answers'}`}
        </span>
      </div>
    </Card>
  );
}
