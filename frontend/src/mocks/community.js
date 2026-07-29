// Mock Community data for Phase 1 (T1.3 / T1.4). No backend calls until Phase 3
// — the real feed comes from GET /posts and GET /posts/{id} in T3.2.
// Shape mirrors the API response in ARCHITECTURE.md Section 4 so swapping the
// source later is a one-line change in the pages.

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// Timestamps are relative to load time so the feed always looks recent.
const ago = (ms) => new Date(Date.now() - ms).toISOString();

export const DEPARTMENT_TAGS = [
  'Computer Science',
  'Mechanical',
  'Electrical',
  'Civil',
  'Business',
  'Campus Life',
];

export const MOCK_POSTS = [
  {
    id: 1,
    title: 'Which electives are actually worth taking in 3rd year CS?',
    body: "I'm picking electives for next semester and the course catalogue descriptions are useless. Has anyone taken Distributed Systems or Computer Graphics? Mainly wondering about the workload and whether the projects are group-based, because I'm already carrying a heavy core load and can't take on another 4-person group project that turns into me doing everything the night before the deadline.",
    departmentTag: 'Computer Science',
    author: { name: 'Ananya R.', department: 'Computer Science', year: 3 },
    createdAt: ago(2 * HOUR),
    commentCount: 3,
  },
  {
    id: 2,
    title: 'Best place to print project reports near the north gate?',
    body: 'The stationery shop inside campus closes at 5pm and I need spiral binding done late. Any recommendations that stay open past 8?',
    departmentTag: 'Campus Life',
    // Authored by the signed-in user — surfaces in Profile → My Posts (T1.9).
    author: { name: 'You', department: null, year: null, isCurrentUser: true },
    createdAt: ago(7 * HOUR),
    commentCount: 2,
  },
  {
    id: 3,
    title: 'How do seniors manage internship applications with attendance rules?',
    body: "Attendance is 75% minimum but interview rounds are all on weekdays. Did you just take the shortage, or is there a way to get it excused? Asking before I plan my applications for the next cycle.",
    departmentTag: 'Business',
    author: { name: 'Meera S.', department: 'Business', year: 4 },
    createdAt: ago(DAY + 3 * HOUR),
    commentCount: 1,
  },
  {
    id: 4,
    title: "Lab manual for Signals & Systems — anyone have last year's copy?",
    body: 'The library copies are all issued out and the department store is out of stock. Happy to pay for photocopying.',
    departmentTag: 'Electrical',
    author: { name: 'You', department: null, year: null, isCurrentUser: true },
    createdAt: ago(2 * DAY),
    commentCount: 0,
  },
  {
    id: 5,
    title: 'Is the 8am shuttle from the hostel reliable during exam week?',
    body: "First-year here. I've heard it gets full quickly and people end up walking. Should I be leaving earlier, or is the 8:20 one usually emptier?",
    departmentTag: 'Campus Life',
    author: { name: 'Sana M.', department: 'Civil', year: 1 },
    createdAt: ago(3 * DAY),
    commentCount: 2,
  },
];

export const MOCK_COMMENTS = {
  1: [
    {
      id: 101,
      body: "Took Distributed Systems last year. Workload is fair but the project is a 3-person group and it's genuinely the best thing I did in the degree. Graphics is lighter but the maths ramps up fast around week 6.",
      author: { name: 'Kabir N.', department: 'Computer Science', year: 4 },
      createdAt: ago(HOUR),
    },
    {
      id: 102,
      body: 'Seconding DS. Pick your group early though — the prof does not reshuffle after week 2.',
      author: { name: 'Iris T.', department: 'Computer Science', year: 4 },
      createdAt: ago(40 * 60 * 1000),
    },
    {
      id: 103,
      body: 'If you want the lighter option go Graphics, but only if you liked linear algebra.',
      author: { name: 'Ravi J.', department: 'Computer Science', year: 3 },
      createdAt: ago(20 * 60 * 1000),
    },
  ],
  2: [
    {
      id: 201,
      body: 'There is a shop opposite the north gate bus stop open till 10pm, does binding in about 15 minutes.',
      author: { name: 'Priya V.', department: 'Civil', year: 3 },
      createdAt: ago(5 * HOUR),
    },
    {
      id: 202,
      body: 'Careful with that one during placement season, the queue gets long. Go before 8.',
      author: { name: 'Arjun L.', department: 'Mechanical', year: 4 },
      createdAt: ago(4 * HOUR),
    },
  ],
  3: [
    {
      id: 301,
      body: 'Talk to your faculty advisor before the interview, not after. Mine logged it as on-duty leave and it never counted against attendance.',
      author: { name: 'Nikhil B.', department: 'Business', year: 4 },
      createdAt: ago(DAY),
    },
  ],
  4: [],
  5: [
    {
      id: 501,
      body: 'The 8am fills up at the hostel stop itself. 8:20 is usually fine except on exam days.',
      author: { name: 'Tara G.', department: 'Civil', year: 2 },
      createdAt: ago(2 * DAY),
    },
    {
      id: 502,
      body: 'During exam week just walk, it takes 12 minutes and you avoid the whole thing.',
      author: { name: 'Omar F.', department: 'Electrical', year: 3 },
      createdAt: ago(2 * DAY),
    },
  ],
};

// Profile → My Posts (T1.9). Real source is GET /profile/posts in T3.5.
export function myMockPosts() {
  return MOCK_POSTS.filter((post) => post.author.isCurrentUser).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
}

export function findMockPost(postId) {
  return MOCK_POSTS.find((post) => String(post.id) === String(postId)) ?? null;
}

export function findMockComments(postId) {
  return MOCK_COMMENTS[postId] ?? [];
}
