// CommunityFeedPage — home screen after login (D14). Mock data only in Phase 1;
// wired to GET /posts in T3.2.
//
// Layout from the community reference (ARCHITECTURE.md 5.2): a horizontal row
// of department filter chips above a card feed, newest post first.

import { useMemo, useState } from 'react';

import PostCard from '../components/PostCard';
import PostComposer from '../components/PostComposer';
import Button from '../components/ui/Button';
import { useAuth } from '../context/useAuth';
import { DEPARTMENT_TAGS, MOCK_POSTS } from '../mocks/community';

const ALL = 'All';

export default function CommunityFeedPage() {
  const { user } = useAuth();
  const [activeTag, setActiveTag] = useState(ALL);
  const [isComposing, setIsComposing] = useState(false);

  // Local copy so a new post can be prepended without mutating the fixture.
  const [allPosts, setAllPosts] = useState(MOCK_POSTS);

  const posts = useMemo(() => {
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
    return activeTag === ALL
      ? sorted
      : sorted.filter((post) => post.departmentTag === activeTag);
  }, [allPosts, activeTag]);

  function handleCreatePost(draft) {
    setAllPosts((prev) => [
      {
        ...draft,
        id: `local-${prev.length + 1}`,
        author: {
          name: 'You',
          department: user?.department ?? null,
          year: user?.year ?? null,
          isCurrentUser: true,
        },
        createdAt: new Date().toISOString(),
        commentCount: 0,
      },
      ...prev,
    ]);
    setIsComposing(false);
    setActiveTag(ALL);
  }

  return (
    <div className="feed">
      <header className="page-header page-header--with-action">
        <div>
          <h1>Community</h1>
          <p className="text-muted text-sm">
            Ask anything about courses, campus or life here — seniors and peers answer.
          </p>
        </div>
        <Button size="sm" onClick={() => setIsComposing(true)}>
          Ask a question
        </Button>
      </header>

      <div className="chips" role="group" aria-label="Filter by department">
        {[ALL, ...DEPARTMENT_TAGS].map((tag) => (
          <button
            key={tag}
            type="button"
            className={tag === activeTag ? 'chip chip--active' : 'chip'}
            aria-pressed={tag === activeTag}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="page-state">
          <h3>Nothing here yet</h3>
          <p className="text-muted text-sm">
            {activeTag === ALL
              ? 'Be the first to ask a question.'
              : `No posts tagged ${activeTag} yet.`}
          </p>
        </div>
      ) : (
        <div className="feed__list">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {isComposing && (
        <PostComposer onClose={() => setIsComposing(false)} onSubmit={handleCreatePost} />
      )}
    </div>
  );
}
