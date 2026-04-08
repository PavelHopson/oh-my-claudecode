---
name: database
description: Rules for migrations, schema definitions, and database queries
globs: ["database/**", "prisma/**", "migrations/**", "src/models/**", "app/Models/**"]
---

# Database Rules

## Migrations
- Every migration must be reversible (down/rollback defined)
- Wrap DDL in transactions when the DB supports it (PostgreSQL yes, MySQL no for DDL)
- Add indexes in the same migration that adds the filtered column
- Never drop columns in production without a deprecation migration first
- Use `IF NOT EXISTS` / `IF EXISTS` guards for idempotency

## Schema
- Every table has a primary key (prefer UUID/CUID over auto-increment for distributed)
- Timestamps: `created_at` and `updated_at` on every table
- Foreign keys with explicit ON DELETE behavior (CASCADE, SET NULL, RESTRICT)
- Soft deletes only when business requires audit trail — not by default
- Column names: snake_case, singular (user_id not users_id)

## Queries
- Parameterized queries only — never interpolate user input into SQL
- SELECT only needed columns on large tables — no `SELECT *` in production code
- Paginate with cursor (WHERE id > ?) for stable pagination, OFFSET only for admin UIs
- Add LIMIT to every query that could return unbounded results

## Indexes
- Index every column used in WHERE, JOIN ON, ORDER BY on tables > 1K rows
- Composite index column order matches query filter order (most selective first)
- Partial indexes for common WHERE conditions (e.g., `WHERE deleted_at IS NULL`)
- Review EXPLAIN output for queries touching > 10K rows

## No-go
- No raw SQL string concatenation with user input
- No ALTER TABLE on large tables without testing lock duration
- No nullable boolean columns — use an enum or default value
- No storing JSON blobs as a substitute for proper relational modeling (unless truly schemaless)
