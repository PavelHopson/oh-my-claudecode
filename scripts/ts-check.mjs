#!/usr/bin/env node

/**
 * PostToolUse Hook: TypeScript type check after editing .ts/.tsx files
 * Runs `tsc --noEmit` in the nearest project root containing tsconfig.json
 * Windows-compatible via Node.js (no sh required)
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { dirname, extname, join } from 'path';
import { readStdin } from './lib/stdin.mjs';

// Review mode: skip in 'solo' mode
const reviewModePath = join(process.cwd(), '.claude', 'review-mode.txt');
const reviewMode = existsSync(reviewModePath) ? readFileSync(reviewModePath, 'utf-8').trim() : 'full';
if (reviewMode === 'solo') process.exit(0);

const TS_EXTENSIONS = new Set(['.ts', '.tsx']);

function findTsconfigRoot(filePath) {
  let dir = dirname(filePath);
  for (let i = 0; i < 8; i++) {
    if (existsSync(join(dir, 'tsconfig.json'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

async function main() {
  const raw = await readStdin();
  if (!raw.trim()) return;

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return;
  }

  const toolName = payload.tool_name ?? payload.tool ?? '';
  if (!['Edit', 'Write', 'MultiEdit'].includes(toolName)) return;

  const filePath = payload.tool_input?.file_path ?? payload.tool_input?.path ?? '';
  if (!filePath) return;
  if (!TS_EXTENSIONS.has(extname(filePath).toLowerCase())) return;

  const root = findTsconfigRoot(filePath);
  if (!root) return;

  // Check if tsc is available
  try {
    execSync('npx tsc --version', { cwd: root, stdio: 'pipe', timeout: 5000 });
  } catch {
    return; // tsc not available — skip silently
  }

  try {
    execSync('npx tsc --noEmit --pretty false', {
      cwd: root,
      stdio: 'pipe',
      timeout: 30000,
    });
  } catch (err) {
    const output = (err.stdout?.toString() ?? '') + (err.stderr?.toString() ?? '');
    const lines = output.trim().split('\n').filter(Boolean).slice(0, 20);
    if (lines.length > 0) {
      console.log('\n[ts-check] TypeScript errors detected:\n' + lines.join('\n') + '\n');
    }
  }
}

main().catch(() => {});
