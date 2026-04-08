#!/usr/bin/env node

/**
 * PostToolUse Hook: Warn when console.log is present in edited JS/TS files
 * Non-blocking — only prints a reminder, never prevents execution
 * Windows-compatible via Node.js (no sh required)
 */

import { existsSync, readFileSync } from 'fs';
import { extname, join } from 'path';
import { readStdin } from './lib/stdin.mjs';

// Review mode: skip in 'solo' mode
const reviewModePath = join(process.cwd(), '.claude', 'review-mode.txt');
const reviewMode = existsSync(reviewModePath) ? readFileSync(reviewModePath, 'utf-8').trim() : 'full';
if (reviewMode === 'solo') process.exit(0);

const JS_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);

// Matches console.log(...) but not // console.log (commented out)
const CONSOLE_LOG_RE = /(?<!\/\/\s*)console\.log\s*\(/;

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
  if (!JS_EXTENSIONS.has(extname(filePath).toLowerCase())) return;
  if (!existsSync(filePath)) return;

  let content;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch {
    return;
  }

  const lines = content.split('\n');
  const hits = [];

  for (let i = 0; i < lines.length; i++) {
    if (CONSOLE_LOG_RE.test(lines[i])) {
      hits.push(`  line ${i + 1}: ${lines[i].trim()}`);
      if (hits.length >= 5) { hits.push('  ...'); break; }
    }
  }

  if (hits.length > 0) {
    console.log(
      `\n[console-log-warn] console.log found in ${filePath.split(/[\\/]/).pop()}:\n` +
      hits.join('\n') +
      '\nConsider removing debug logs before committing.\n'
    );
  }
}

main().catch(() => {});
