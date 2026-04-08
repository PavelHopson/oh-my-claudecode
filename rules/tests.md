---
name: tests
description: Rules for test files — naming, structure, coverage, fixtures
globs: ["tests/**", "test/**", "__tests__/**", "*.test.*", "*.spec.*"]
---

# Test Rules

## Naming
- Test files mirror source: `src/services/UserService.ts` → `tests/services/UserService.test.ts`
- Test names describe behavior: `it('returns 404 when user not found')` not `it('test getUser')`
- Group related tests with `describe()` matching the class/function name

## Structure (AAA)
- **Arrange** — set up data and dependencies
- **Act** — call the function under test (one action per test)
- **Assert** — verify the result (prefer one logical assertion per test)

## Fixtures & Factories
- Use factories for test data — not raw object literals repeated across tests
- Fixtures in `tests/fixtures/` — shared across test files
- Clean up after each test — no test-to-test state leakage
- Use transactions or truncation for DB tests, not manual deletes

## Coverage
- Critical paths (auth, payments, data mutations) must have tests
- Aim for meaningful coverage, not 100% — test behavior, not implementation
- Edge cases: empty input, null, boundary values, concurrent access
- Error paths: verify correct exception types and messages

## No-go
- No `console.log` in tests — use assertions
- No `sleep()` / `setTimeout()` — use fake timers or waitFor
- No tests that depend on execution order
- No skipped tests (`it.skip`) committed without a TODO issue reference
- No testing private methods directly — test through the public API
