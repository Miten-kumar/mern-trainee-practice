require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');

const { attachUser } = require('./rest/middleware/authMiddleware');
const { attachDbStats } = require('./utils/queryStatsMiddleware');
const authRoutes = require('./rest/routes/auth.routes');
const userRoutes = require('./rest/routes/users.routes');
const postRoutes = require('./rest/routes/posts.routes');
const commentRoutes = require('./rest/routes/comments.routes');

const { typeDefs } = require('./graphql/typeDefs');
const { resolvers } = require('./graphql/resolvers');
const { buildContext } = require('./graphql/context');
const { dbStatsPlugin } = require('./graphql/dbStatsPlugin');

const PORT = process.env.PORT || 4000;

async function main() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // ---- REST API, mounted under /api ----
  app.use(attachDbStats);
  app.use(attachUser);
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/posts', commentRoutes); // adds POST /api/posts/:postId/comments

  app.use((err, req, res, next) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(err.statusCode || 500).json({ error: err.message || 'Internal server error' });
  });

  // ---- GraphQL API, mounted at /graphql ----
  const apolloServer = new ApolloServer({ typeDefs, resolvers, plugins: [dbStatsPlugin] });
  await apolloServer.start();
  app.use('/graphql', express.json(), expressMiddleware(apolloServer, { context: buildContext }));

  app.get('/', (_req, res) => {
    res.json({
      message: 'REST vs GraphQL demo API',
      rest: '/api (see README for endpoints)',
      graphql: '/graphql',
    });
  });

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`REST API      → http://localhost:${PORT}/api`);
    // eslint-disable-next-line no-console
    console.log(`GraphQL API   → http://localhost:${PORT}/graphql`);
  });
}

main();
