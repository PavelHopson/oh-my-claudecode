#!/usr/bin/env node

/**
 * PostToolUse Hook: Auto-format JS/TS files with Prettier after editing
 * Only runs if prettier is present in the project (respects .prettierrc config)
 * Windows-compatible via Node.js (no sh required)
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { dirname, extname, join } from 'path';
import { readStdin } from './lib/stdin.mjs';

const PRETTIER_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

function findProjectRoot(filePath) {
  let dir = dirname(filePath);
  for (let i = 0; i < 8; i++) {
    if (
      existsSync(join(dir, 'package.json')) ||
      existsSync(join(dir, '.prettierrc')) ||
      existsSync(join(dir, '.prettierrc.json')) ||
      existsSync(join(dir, 'prettier.config.js'))
    ) {
      return dir;
    }
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
  if (!PRETTIER_EXTENSIONS.has(extname(filePath).toLowerCase())) return;
  if (!existsSync(filePath)) return;

  const root = findProjectRoot(filePath);
  if (!root) return;

  // Only format if prettier is installed in the project
  const prettierBin = join(root, 'node_modules', '.bin', 'prettier');
  const prettierBinWin = join(root, 'node_modules', '.bin', 'prettier.cmd');
  if (!existsSync(prettierBin) && !existsSync(prettierBinWin)) return;

  try {
    execSync(`npx prettier --write "${filePath.replace(/\\/g, '/')}"`, {
      cwd: root,
      stdio: 'pipe',
      timeout: 10000,
    });
  } catch {
    // Prettier failed — skip silently (file might have syntax errors)
  }
}

main().catch(() => {});
