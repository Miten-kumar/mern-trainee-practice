const db = require('../db/data');
const { register, login } = require('../auth/auth');

function requireAuth(context) {
  if (!context.user) {
    const err = new Error('Authentication required');
    err.extensions = { code: 'UNAUTHENTICATED' };
    throw err;
  }
}

const resolvers = {
  Query: {
    me: async (_parent, _args, context) => {
      if (!context.user) return null;
      return db.getUserById(context.stats, context.user.id);
    },
    users: (_parent, _args, context) => db.getAllUsers(context.stats),
    user: (_parent, { id }, context) => db.getUserById(context.stats, id),
    posts: (_parent, _args, context) => db.getAllPosts(context.stats),
    post: (_parent, { id }, context) => db.getPostById(context.stats, id),
  },

  Mutation: {
    register: (_parent, args, context) => register(context.stats, args),
    login: (_parent, args, context) => login(context.stats, args),
    createPost: (_parent, { title, body }, context) => {
      requireAuth(context);
      return db.createPost(context.stats, { authorId: context.user.id, title, body });
    },
    createComment: (_parent, { postId, text }, context) => {
      requireAuth(context);
      return db.createComment(context.stats, { postId, authorId: context.user.id, text });
    },
  },

  User: {
    // Field-level resolver, only runs if a query actually asks for `posts`.
    // This is the flip side of DataLoader: GraphQL only pays for what's requested.
    posts: (user, _args, context) => db.getPostsByAuthorId(context.stats, user.id),
  },

  Post: {
    // The classic N+1 spot. Without a loader this fires once per post.
    // With userLoader, every Post.author call in the same request batches
    // into a single users.findByIds query.
    author: (post, _args, context) => context.loaders.userLoader.load(post.authorId),
    comments: (post, _args, context) => context.loaders.commentsByPostLoader.load(post.id),
    commentCount: async (post, _args, context) => {
      const comments = await context.loaders.commentsByPostLoader.load(post.id);
      return comments.length;
    },
  },

  Comment: {
    author: (comment, _args, context) => context.loaders.userLoader.load(comment.authorId),
  },
};

module.exports = { resolvers };
