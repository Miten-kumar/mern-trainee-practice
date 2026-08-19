/**
 * In-memory "tables" + data access functions.
 *
 * Every read goes through `stats.run(...)` from simulateDb.js so that
 * whoever is calling these functions (a REST route or a GraphQL resolver)
 * contributes to a per-request query count. That's what lets the perf
 * script prove the N+1 problem instead of just asserting it.
 */

const bcrypt = require('bcryptjs');

const users = [
  { id: 'u1', name: 'Aarav Shah', email: 'aarav@example.com', bio: 'Backend engineer, likes Go and cricket.' },
  { id: 'u2', name: 'Priya Nair', email: 'priya@example.com', bio: 'Frontend dev, React + design systems.' },
  { id: 'u3', name: 'Rohan Mehta', email: 'rohan@example.com', bio: 'DevOps, breaks prod on Fridays.' },
  { id: 'u4', name: 'Sneha Iyer', email: 'sneha@example.com', bio: 'Full-stack, writes about GraphQL.' },
  { id: 'u5', name: 'Karan Patel', email: 'karan@example.com', bio: 'Student, learning MERN.' },
  { id: 'u6', name: 'Ananya Verma', email: 'ananya@example.com', bio: 'Tech lead, reviews too many PRs.' },
];

// Every seeded user gets the same demo password so this project is easy to try:
// password -> "password123"
const DEMO_PASSWORD_HASH = bcrypt.hashSync('password123', 8);
const passwordsByUserId = Object.fromEntries(users.map((u) => [u.id, DEMO_PASSWORD_HASH]));

const posts = [
  { id: 'p1', authorId: 'u1', title: 'Why we moved our config service to Go', body: 'A short retro on the rewrite...', createdAt: '2026-06-01T09:00:00Z' },
  { id: 'p2', authorId: 'u2', title: 'Design tokens: the boring infra that saves your UI', body: 'Tokens are not exciting, but...', createdAt: '2026-06-03T10:15:00Z' },
  { id: 'p3', authorId: 'u1', title: 'What actually happens on a cache miss', body: 'A walk through the request path...', createdAt: '2026-06-05T08:30:00Z' },
  { id: 'p4', authorId: 'u4', title: 'GraphQL resolvers, explained with food orders', body: 'Think of a resolver as a waiter...', createdAt: '2026-06-06T11:00:00Z' },
  { id: 'p5', authorId: 'u3', title: 'Our first on-call postmortem, and what we changed', body: 'It was a bad Friday...', createdAt: '2026-06-08T07:45:00Z' },
  { id: 'p6', authorId: 'u2', title: 'Building an accessible dropdown from scratch', body: 'ARIA roles are not optional...', createdAt: '2026-06-09T13:20:00Z' },
  { id: 'p7', authorId: 'u6', title: 'What I look for in a pull request', body: 'Size matters, mostly...', createdAt: '2026-06-11T09:10:00Z' },
  { id: 'p8', authorId: 'u4', title: 'DataLoader in one page', body: 'Batching and caching, together...', createdAt: '2026-06-12T14:00:00Z' },
  { id: 'p9', authorId: 'u5', title: 'My first month as a trainee engineer', body: 'Everything is a new tool...', createdAt: '2026-06-14T09:00:00Z' },
  { id: 'p10', authorId: 'u1', title: 'Rate limiting with a token bucket', body: 'Simple, cheap, effective...', createdAt: '2026-06-15T16:40:00Z' },
  { id: 'p11', authorId: 'u3', title: 'Blue-green deploys on a budget', body: 'You do not need a fancy platform...', createdAt: '2026-06-17T10:05:00Z' },
  { id: 'p12', authorId: 'u6', title: 'Why we write RFCs for small changes too', body: 'Writing forces clarity...', createdAt: '2026-06-18T12:30:00Z' },
];

let commentIdCounter = 1;
function makeComment(postId, authorId, text, createdAt) {
  return { id: `c${commentIdCounter++}`, postId, authorId, text, createdAt };
}

const comments = [
  ...['u2', 'u3', 'u4'].map((a, i) => makeComment('p1', a, `Comment ${i + 1} on p1`, '2026-06-01T10:00:00Z')),
  ...['u1', 'u5'].map((a, i) => makeComment('p2', a, `Comment ${i + 1} on p2`, '2026-06-03T11:00:00Z')),
  ...['u4', 'u6', 'u2'].map((a, i) => makeComment('p3', a, `Comment ${i + 1} on p3`, '2026-06-05T09:00:00Z')),
  ...['u1'].map((a, i) => makeComment('p4', a, `Comment ${i + 1} on p4`, '2026-06-06T12:00:00Z')),
  ...['u2', 'u6'].map((a, i) => makeComment('p5', a, `Comment ${i + 1} on p5`, '2026-06-08T08:00:00Z')),
  ...['u3', 'u4', 'u5', 'u1'].map((a, i) => makeComment('p6', a, `Comment ${i + 1} on p6`, '2026-06-09T14:00:00Z')),
  ...['u2'].map((a, i) => makeComment('p7', a, `Comment ${i + 1} on p7`, '2026-06-11T10:00:00Z')),
  ...['u1', 'u3'].map((a, i) => makeComment('p8', a, `Comment ${i + 1} on p8`, '2026-06-12T15:00:00Z')),
  ...['u6', 'u2', 'u4'].map((a, i) => makeComment('p9', a, `Comment ${i + 1} on p9`, '2026-06-14T10:00:00Z')),
  ...['u5'].map((a, i) => makeComment('p10', a, `Comment ${i + 1} on p10`, '2026-06-15T17:00:00Z')),
  ...['u2', 'u4'].map((a, i) => makeComment('p11', a, `Comment ${i + 1} on p11`, '2026-06-17T11:00:00Z')),
  ...['u1', 'u3', 'u5'].map((a, i) => makeComment('p12', a, `Comment ${i + 1} on p12`, '2026-06-18T13:00:00Z')),
];

function publicUser(user) {
  if (!user) return null;
  const { id, name, email, bio } = user;
  return { id, name, email, bio };
}

// --- Data access, each wrapped in stats.run so callers get charged a "query" ---

function getAllUsers(stats) {
  return stats.run('users.findAll', () => users.map(publicUser));
}

function getUserById(stats, id) {
  return stats.run(`users.findById(${id})`, () => publicUser(users.find((u) => u.id === id)));
}

// batch version used by the DataLoader - ONE simulated query for many ids
function getUsersByIds(stats, ids) {
  return stats.run(`users.findByIds([${ids.length} ids])`, () =>
    ids.map((id) => publicUser(users.find((u) => u.id === id)))
  );
}

function getUserByEmail(stats, email) {
  return stats.run(`users.findByEmail(${email})`, () => users.find((u) => u.email === email));
}

function getPasswordHash(userId) {
  return passwordsByUserId[userId];
}

function createUser(stats, { name, email, passwordHash }) {
  return stats.run('users.insert', () => {
    const id = `u${users.length + 1}`;
    const user = { id, name, email, bio: '' };
    users.push(user);
    passwordsByUserId[id] = passwordHash;
    return publicUser(user);
  });
}

function getAllPosts(stats) {
  return stats.run('posts.findAll', () => posts.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
}

function getPostById(stats, id) {
  return stats.run(`posts.findById(${id})`, () => posts.find((p) => p.id === id));
}

function getPostsByAuthorId(stats, authorId) {
  return stats.run(`posts.findByAuthorId(${authorId})`, () => posts.filter((p) => p.authorId === authorId));
}

function createPost(stats, { authorId, title, body }) {
  return stats.run('posts.insert', () => {
    const id = `p${posts.length + 1}`;
    const post = { id, authorId, title, body, createdAt: new Date().toISOString() };
    posts.push(post);
    return post;
  });
}

function getCommentsByPostId(stats, postId) {
  return stats.run(`comments.findByPostId(${postId})`, () => comments.filter((c) => c.postId === postId));
}

// batch version used by the DataLoader - ONE simulated query for many post ids
function getCommentsByPostIds(stats, postIds) {
  return stats.run(`comments.findByPostIds([${postIds.length} ids])`, () =>
    postIds.map((postId) => comments.filter((c) => c.postId === postId))
  );
}

function getCommentCountByPostId(stats, postId) {
  return stats.run(`comments.countByPostId(${postId})`, () => comments.filter((c) => c.postId === postId).length);
}

function createComment(stats, { postId, authorId, text }) {
  return stats.run('comments.insert', () => {
    const comment = makeComment(postId, authorId, text, new Date().toISOString());
    comments.push(comment);
    return comment;
  });
}

module.exports = {
  getAllUsers,
  getUserById,
  getUsersByIds,
  getUserByEmail,
  getPasswordHash,
  createUser,
  getAllPosts,
  getPostById,
  getPostsByAuthorId,
  createPost,
  getCommentsByPostId,
  getCommentsByPostIds,
  getCommentCountByPostId,
  createComment,
};
