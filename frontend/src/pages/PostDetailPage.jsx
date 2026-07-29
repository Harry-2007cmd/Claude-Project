// PostDetailPage — full post + its flat comment list (T1.4). Mock data only;
// wired to GET /posts/{id} and POST /posts/{id}/comments in T3.2.

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import Card from '../components/ui/Card';
import { useAuth } from '../context/useAuth';
import { findMockComments, findMockPost } from '../mocks/community';
import { formatRelativeTime, initialsOf } from '../utils/date';

export default function PostDetailPage() {
  const { postId } = useParams();
  const { user } = useAuth();

  const post = findMockPost(postId);
  // Local copy so a mock comment can be appended without touching the fixture.
  const [comments, setComments] = useState(() => findMockComments(postId));

  if (!post) {
    return (
      <div className="page-state">
        <h1>Post not found</h1>
        <p className="text-muted">
          It may have been removed. <Link to="/community">Back to Community</Link>
        </p>
      </div>
    );
  }

  function handleAddComment(body) {
    setComments((prev) => [
      ...prev,
      {
        id: `local-${prev.length + 1}`,
        body,
        author: {
          name: user?.name ?? 'You',
          department: user?.department ?? null,
          year: user?.year ?? null,
        },
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  const { author } = post;
  const authorMeta = [author.department, author.year ? `Year ${author.year}` : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="post-detail">
      <Link to="/community" className="text-sm">
        ← Back to Community
      </Link>

      <Card as="article" className="post-detail__post">
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

        <h1>{post.title}</h1>
        {/* Full body here — the feed clamps it (PRD Section 6). */}
        <p className="post-detail__body">{post.body}</p>

        {post.departmentTag && <span className="tag">{post.departmentTag}</span>}
      </Card>

      <section className="post-detail__answers">
        <h2>
          {comments.length === 0
            ? 'Answers'
            : `${comments.length} ${comments.length === 1 ? 'answer' : 'answers'}`}
        </h2>
        <CommentList comments={comments} />
      </section>

      <CommentForm onSubmit={handleAddComment} />
    </div>
  );
}
