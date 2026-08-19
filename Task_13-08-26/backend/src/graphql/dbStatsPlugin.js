/**
 * Reports how many simulated DB queries a GraphQL request made, via the
 * standard `extensions` field on the response - NOT as a regular query
 * field. A query field like `queryStats { queryCount }` would resolve
 * before sibling fields (like `posts`) finish their nested DataLoader
 * batches, since top-level fields run concurrently. Reading the count in
 * `willSendResponse`, after the whole response is assembled, gives the
 * real total instead of a partial snapshot.
 */
const dbStatsPlugin = {
  async requestDidStart() {
    return {
      async willSendResponse({ contextValue, response }) {
        if (response.body.kind === 'single' && contextValue.stats) {
          response.body.singleResult.extensions = {
            ...response.body.singleResult.extensions,
            dbQueryCount: contextValue.stats.getCount(),
          };
        }
      },
    };
  },
};

module.exports = { dbStatsPlugin };
