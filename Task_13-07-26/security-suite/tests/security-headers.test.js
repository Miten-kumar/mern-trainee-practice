// checks the headers helmet is supposed to set are actually there.
// run with: node tests/security-headers.test.js

const BASE = process.env.BASE_URL || "http://localhost:4900";

const expectedHeaders = [
  { header: "x-content-type-options", expected: "nosniff" },
  { header: "x-frame-options", expected: "SAMEORIGIN" },
  { header: "x-dns-prefetch-control", expected: "off" },
  { header: "strict-transport-security", expected: null }, // just needs to exist, value varies
];

let passed = 0;
let failed = 0;

async function main() {
  console.log(`checking security headers on ${BASE}\n`);

  const res = await fetch(`${BASE}/api/health`);

  for (const { header, expected } of expectedHeaders) {
    const actual = res.headers.get(header);

    if (actual === null) {
      console.log(`FAIL: "${header}" header is missing`);
      failed++;
      continue;
    }

    if (expected !== null && actual !== expected) {
      console.log(`FAIL: "${header}" was "${actual}", expected "${expected}"`);
      failed++;
      continue;
    }

    console.log(`PASS: "${header}": ${actual}`);
    passed++;
  }

  // this one should NOT be present - helmet removes it so attackers
  // can't easily tell this is an express app
  const poweredBy = res.headers.get("x-powered-by");
  if (poweredBy === null) {
    console.log(`PASS: "x-powered-by" header correctly hidden`);
    passed++;
  } else {
    console.log(`FAIL: "x-powered-by" is exposed as "${poweredBy}"`);
    failed++;
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("test script crashed:", err);
  process.exit(1);
});
