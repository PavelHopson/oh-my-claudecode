---
name: backend-api
description: Rules for API routes, controllers, and request handling
globs: ["src/routes/**", "src/controllers/**", "app/Http/Controllers/**", "routes/**", "backend/src/routes/**"]
---

# Backend API Rules

## Request Handling
- Validate all user input at the boundary — never trust raw request data
- Use schema validation (Zod, Joi, Laravel FormRequest) not manual checks
- Return consistent response shape: `{ ok: boolean, data: ..., message?: string }`
- HTTP status codes must match semantics (201 for create, 404 for not found, 422 for validation)

## Authentication & Authorization
- Auth middleware on every protected route — no exceptions
- Check resource ownership before update/delete operations
- Never expose internal IDs in error messages
- Rate limiting on auth endpoints (login, register, reset)

## Error Handling
- Catch and wrap all errors — never leak stack traces to clients
- Log the full error server-side, return sanitized message to client
- Use domain-specific error classes (NotFoundError, ValidationError, ForbiddenError)

## Performance
- Paginate all list endpoints — no unbounded SELECT
- Eager load relationships to avoid N+1 (with(), include, JOIN)
- Cache frequently-read, rarely-changed data (Redis, in-memory)
- Set reasonable request body size limits

## No-go
- No raw SQL string interpolation — use parameterized queries or ORM
- No business logic in controllers — delegate to services
- No hardcoded secrets — environment variables only
- No synchronous heavy operations in request handlers — queue them
