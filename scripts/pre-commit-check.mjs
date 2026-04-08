#!/usr/bin/env node

/**
 * PreToolUse Hook: Quality gate before git commit
 * Checks staged files for: hardcoded secrets, console.log, TODO/FIXME markers
 * Non-blocking (returns continue:true) — prints warnings only
 * Windows-compatible via Node.js (no sh required)
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { readStdin } from './lib/stdin.mjs';

// Review mode: skip in 'solo' mode
const reviewModePath = join(process.cwd(), '.claude', 'review-mode.txt');
const reviewMode = existsSync(reviewModePath) ? readFileSync(reviewModePath, 'utf-8').trim() : 'full';
if (reviewMode === 'solo') {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

const SECRET_PATTERNS = [
  /api[_-]?key\s*=\s*["'][^"']{8,}/i,
  /secret\s*=\s*["'][^"']{8,}/i,
  /password\s*=\s*["'][^"']{6,}/i,
  /token\s*=\s*["'][^"']{8,}/i,
  /-----BEGIN\s+(RSA\s+)?PRIVATE KEY/,
  /sk-[a-zA-Z0-9]{20,}/,
];

const CONSOLE_LOG_RE = /(?<!\/\/\s*)console\.log\s*\(/;

async function main() {
  const raw = await readStdin();
  if (!raw.trim()) return console.log(JSON.stringify({ continue: true }));

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return console.log(JSON.stringify({ continue: true }));
  }

  const toolName = payload.tool_name ?? payload.tool ?? '';
  if (toolName !== 'Bash') return console.log(JSON.stringify({ continue: true }));

  const command = payload.tool_input?.command ?? '';
  if (!command.includes('git commit')) return console.log(JSON.stringify({ continue: true }));

  let stagedDiff = '';
  try {
    stagedDiff = execSync('git diff --cached', { stdio: 'pipe', timeout: 10000 }).toString();
  } catch {
    return console.log(JSON.stringify({ continue: true }));
  }

  const warnings = [];

  // Check secrets
  const diffLines = stagedDiff.split('\n').filter(l => l.startsWith('+') && !l.startsWith('+++'));
  for (const line of diffLines) {
    for (const pat of SECRET_PATTERNS) {
      if (pat.test(line)) {
        warnings.push(`  [SECRET] Possible hardcoded secret: ${line.slice(1, 100).trim()}`);
        break;
      }
    }
  }

  // Check console.log in staged TS/JS lines
  const consoleLogs = diffLines.filter(l => CONSOLE_LOG_RE.test(l));
  if (consoleLogs.length > 0) {
    warnings.push(`  [DEBUG] ${consoleLogs.length} console.log() found in staged changes`);
  }

  if (warnings.length > 0) {
    console.error('\n⚠ Pre-commit warnings:\n' + warnings.join('\n') + '\n');
  }

  // Never block the commit — always continue
  console.log(JSON.stringify({ continue: true }));
}

main().catch(() => console.log(JSON.stringify({ continue: true })));
