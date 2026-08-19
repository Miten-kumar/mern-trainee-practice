# Dependency Scan Notes

`npm audit` requires network access to the registry, so this was run against the pinned
`package.json` manifests offline for this exercise; treat the table below as representative
of the class of issues typically caught, and re-run for real numbers before shipping:

```
cd backend && npm audit --production
cd frontend && npm audit --production
```

## What to look for, and how each was addressed here

| Package | Known issue class in older versions | Action taken |
|---|---|---|
| `express` | Older 4.x had ReDoS issues in some routing edge cases | Pinned to `^4.19.2` |
| `jsonwebtoken` | Pre-9.x had algorithm-confusion vulnerabilities (`alg: none`) | Pinned to `^9.0.2`; algorithm explicitly HS256 via `jwt.sign` defaults, never accepting `alg` from input |
| `bcrypt` | N/A — kept current for native-binding CVEs | Pinned to `^5.1.1` |
| `dompurify` | Bypass CVEs periodically found and patched upstream | Pinned to `^3.1.6`, subscribe to security advisories |
| `helmet` | N/A, low CVE surface | Pinned to `^7.1.0` |

## Process going forward
1. Add `npm audit --production` (or `npm audit signatures`) as a required CI check on both
   `frontend/` and `backend/`; fail the build on `high`/`critical`.
2. Enable Dependabot (or Renovate) for automated patch PRs.
3. Review the CHANGELOG of any dependency before accepting a major-version bump — some of
   these packages (`jsonwebtoken`, `express`) have had breaking security-relevant default
   changes between majors (e.g. `jsonwebtoken` v9 disabling `none` algorithm by default).
4. Track any accepted-risk exceptions (can't upgrade yet, no fix available) in this file
   with a reason and a re-review date — don't just suppress the audit warning silently.
