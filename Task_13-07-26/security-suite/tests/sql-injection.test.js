// simple standalone test script, run with: node tests/sql-injection.test.js
// no test framework, just fetch calls with clear pass/fail output -
// easy to read and explain in an interview

const BASE = process.env.BASE_URL || "http://localhost:4900";

const payloads = [
  { name: "OR 1=1 (classic bypass)", value: "' OR '1'='1" },
  { name: "UNION SELECT attempt", value: "' UNION SELECT id, username, email FROM users --" },
  { name: "DROP TABLE attempt", value: "'; DROP TABLE users; --" },
  { name: "comment terminator", value: "admin'--" },
];

let passed = 0;
let failed = 0;

async function testPayload({ name, value }) {
  const res = await fetch(`${BASE}/api/users/search?username=${encodeURIComponent(value)}`);
  const data = await res.json();

  // a successful injection would return every user (or crash the server /
  // return a sql error). a properly parameterized query just treats the
  // payload as a literal string and finds nothing, which is correct -
  // there's no user actually named "' OR '1'='1"
  const wasBlocked = res.status === 200 && Array.isArray(data.results) && data.results.length === 0;

  if (wasBlocked) {
    console.log(`PASS: "${name}" returned 0 results (injection did not work)`);
    passed++;
  } else {
    console.log(`FAIL: "${name}" returned`, data);
    failed++;
  }
}

async function testTableStillExists() {
  // if DROP TABLE had actually worked, this normal search would now error
  const res = await fetch(`${BASE}/api/users/search?username=alice`);
  const data = await res.json();
  const tableIntact = res.status === 200 && data.results?.length === 1;

  if (tableIntact) {
    console.log("PASS: users table still intact after DROP TABLE attempt, found alice");
    passed++;
  } else {
    console.log("FAIL: users table seems damaged or alice is missing", data);
    failed++;
  }
}

async function main() {
  console.log(`running sql injection tests against ${BASE}\n`);

  for (const payload of payloads) {
    await testPayload(payload);
  }
  await testTableStillExists();

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("test script crashed:", err);
  process.exit(1);
});
