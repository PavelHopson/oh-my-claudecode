---
name: backend-services
description: Rules for business logic services, jobs, and domain code
globs: ["src/services/**", "app/Services/**", "app/Jobs/**", "backend/src/services/**"]
---

# Backend Services Rules

## Structure
- One service = one domain responsibility (UserService, OrderService, not UtilityService)
- Services are stateless — inject dependencies, don't hold state between calls
- Public methods return typed results, not raw DB models when crossing boundaries
- Constructor injection for dependencies — no global singletons or static calls

## Business Logic
- All business rules live in services — not in controllers, models, or middleware
- Validate business invariants (not just input format) before state changes
- Use transactions for multi-step writes that must be atomic
- Throw domain exceptions (InsufficientBalance, DuplicateEntry) not generic errors

## Jobs & Queues
- Jobs must be idempotent — safe to retry on failure
- Set explicit timeout and retry limits
- Log job start, completion, and failure with identifiable context
- No direct HTTP responses from jobs — update state, let the caller poll or use events

## Testing
- Services are the primary unit test target
- Mock external dependencies (APIs, DB), not the service itself
- Test both happy path and error/edge cases
- Test that domain exceptions are thrown for invalid states

## No-go
- No direct DB queries in services — use repositories or model methods
- No circular dependencies between services
- No side effects in constructors
- No catch-and-swallow — always log or re-throw
