// ProfilePage — self-view only (D15 / PRD 3.4): own info, an edit form for
// department/year/bio, and "My Posts" / "My Rides" tabs. Name and email are not
// editable in MVP. Mock data now; GET /profile, GET /profile/posts,
// GET /profile/rides and PATCH /auth/me are wired in T3.5.
//
// Layout has no reference screenshot — kept deliberately plain per
// ARCHITECTURE.md 5.2, reusing the shared card/feed pieces.

import { useMemo, useState } from 'react';

import PostCard from '../components/PostCard';
import RideCard from '../components/RideCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { useAuth } from '../context/useAuth';
import { myMockRides } from '../mocks/carpool';
import { myMockPosts } from '../mocks/community';
import { initialsOf } from '../utils/date';

const YEARS = [1, 2, 3, 4];
const TABS = [
  { id: 'posts', label: 'My Posts' },
  { id: 'rides', label: 'My Rides' },
];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  const posts = useMemo(() => myMockPosts(), []);
  const rides = useMemo(() => myMockRides(), []);

  const [draft, setDraft] = useState(() => ({
    department: user?.department ?? '',
    year: user?.year ?? '',
    bio: user?.bio ?? '',
  }));

  function handleChange(event) {
    const { name, value } = event.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  function handleEdit() {
    // Re-seed the draft so a cancelled edit never leaks into the next one.
    setDraft({
      department: user?.department ?? '',
      year: user?.year ?? '',
      bio: user?.bio ?? '',
    });
    setIsEditing(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    updateProfile(draft);
    setIsEditing(false);
  }

  return (
    <div className="profile">
      <Card className="profile__header" as="section">
        <div className="profile__identity">
          <span className="avatar avatar--lg" aria-hidden="true">
            {initialsOf(user?.name ?? '')}
          </span>
          <div className="profile__identity-text">
            <h1>{user?.name}</h1>
            <p className="text-muted text-sm">{user?.email}</p>
            <p className="text-muted text-xs">
              {[user?.department, user?.year ? `Year ${user.year}` : null]
                .filter(Boolean)
                .join(' · ') || 'No department or year set'}
            </p>
          </div>
          {!isEditing && (
            <Button variant="secondary" size="sm" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Name and email are read-only in MVP (PRD 3.4). */}
            <Input label="Name" value={user?.name ?? ''} disabled />
            <Input label="Email" value={user?.email ?? ''} disabled />

            <div className="auth-form__row">
              <Input
                label="Department"
                name="department"
                placeholder="Computer Science"
                value={draft.department}
                onChange={handleChange}
              />
              <Input label="Year" name="year" as="select" value={draft.year} onChange={handleChange}>
                <option value="">Select</option>
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    Year {year}
                  </option>
                ))}
              </Input>
            </div>

            <Input
              label="Bio"
              name="bio"
              multiline
              placeholder="A line or two about you…"
              value={draft.bio}
              onChange={handleChange}
            />

            <div className="profile__actions">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save changes
              </Button>
            </div>
          </form>
        ) : (
          <>
            <p className={user?.bio ? 'profile__bio' : 'profile__bio text-muted text-sm'}>
              {user?.bio || 'No bio yet — add one so people know who is answering.'}
            </p>

            <dl className="profile__stats">
              <div>
                <dt className="text-muted text-xs">Posts</dt>
                <dd>{posts.length}</dd>
              </div>
              <div>
                <dt className="text-muted text-xs">Rides</dt>
                <dd>{rides.length}</dd>
              </div>
            </dl>
          </>
        )}
      </Card>

      <div className="tabs" role="tablist" aria-label="Your activity">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={activeTab === tab.id ? 'tab tab--active' : 'tab'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'posts' ? (
        <section id="panel-posts" role="tabpanel" aria-labelledby="tab-posts">
          {posts.length === 0 ? (
            <div className="page-state">
              <h3>No posts yet</h3>
              <p className="text-muted text-sm">Questions you ask will show up here.</p>
            </div>
          ) : (
            <div className="feed__list">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <section id="panel-rides" role="tabpanel" aria-labelledby="tab-rides">
          {rides.length === 0 ? (
            <div className="page-state">
              <h3>No rides yet</h3>
              <p className="text-muted text-sm">Rides you offer will show up here.</p>
            </div>
          ) : (
            <div className="feed__list">
              {rides.map((ride) => (
                <RideCard key={ride.id} ride={ride} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
