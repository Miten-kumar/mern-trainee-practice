/**
 * A tiny stand-in for a real database driver.
 *
 * The point of this project isn't the storage engine, it's showing how many
 * round trips REST vs GraphQL end up making for the same page of data. So
 * instead of wiring up Postgres, every "query" here:
 *   1. bumps a per-request counter
 *   2. waits a few ms, like a real network hop to a DB would
 *
 * That's enough to make the N+1 problem visible and measurable without
 * needing a real database running in the grading environment.
 */

const SIMULATED_LATENCY_MS = 12;

function createDbStats() {
  let queryCount = 0;
  const log = [];

  return {
    // wraps any "query" so we can count + delay it consistently
    run(label, fn) {
      queryCount += 1;
      log.push(label);
      return new Promise((resolve) => {
        setTimeout(() => resolve(fn()), SIMULATED_LATENCY_MS);
      });
    },
    getCount() {
      return queryCount;
    },
    getLog() {
      return log.slice();
    },
    reset() {
      queryCount = 0;
      log.length = 0;
    },
  };
}

module.exports = { createDbStats, SIMULATED_LATENCY_MS };
