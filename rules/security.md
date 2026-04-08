---
name: security
description: Rules for security-sensitive code — auth, crypto, secrets, input handling
globs: ["src/auth/**", "src/middleware/**", "app/Http/Middleware/**", "src/security/**"]
---

# Security Rules

## Authentication
- Passwords hashed with bcrypt (cost ≥ 12) or Argon2id — never MD5/SHA
- Session tokens: cryptographically random, ≥ 32 bytes
- JWT: short-lived access tokens (15 min), long-lived refresh tokens with rotation
- Multi-factor: TOTP (RFC 6238) as second factor when available

## Authorization
- Check permissions on EVERY protected endpoint — never rely on UI hiding
- Validate resource ownership: `WHERE user_id = ?` not just `WHERE id = ?`
- Deny by default — explicitly grant access, not explicitly deny
- Log authorization failures with user context for audit

## Input Handling
- Validate and sanitize ALL user input at system boundaries
- HTML output: escape by default (framework auto-escaping enabled)
- File uploads: validate MIME type, enforce size limits, randomize stored filename
- URLs: validate scheme (https only), prevent SSRF with allowlists

## Secrets
- Environment variables for ALL secrets — no hardcoded keys, tokens, or passwords
- Rotate secrets on suspected exposure — within 1 hour
- Never log secrets, tokens, or password hashes
- `.env` files in `.gitignore` — always

## Headers & Transport
- HTTPS only — redirect HTTP to HTTPS
- Set security headers: CSP, X-Frame-Options, X-Content-Type-Options
- CORS: explicit allowed origins, not wildcard `*` in production
- Cookie flags: HttpOnly, Secure, SameSite=Strict for auth cookies

## No-go
- No `eval()`, `new Function()`, or `innerHTML` with user data
- No SQL string interpolation
- No secrets in git history — if committed, rotate immediately
- No disabling SSL verification in production code
- No storing plaintext passwords, ever
