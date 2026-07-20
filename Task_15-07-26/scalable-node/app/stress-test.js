const autocannon = require("autocannon");

// hits nginx (not a node instance directly) so this actually tests
// the whole setup - load balancing, both backends, everything together
const TARGET_URL = process.env.TARGET_URL || "http://localhost:8080/work";

console.log(`stress testing ${TARGET_URL} with 1000 concurrent connections for 15s...`);

autocannon(
  {
    url: TARGET_URL,
    connections: 1000,
    duration: 15,
  },
  (err, result) => {
    if (err) {
      console.error("stress test failed:", err.message);
      process.exit(1);
    }
    console.log(autocannon.printResult(result));
  }
);
