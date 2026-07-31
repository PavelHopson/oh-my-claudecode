import { spawnSync } from 'node:child_process';

function canRun(command: string, args: string[]): boolean {
  const probe = spawnSync(command, args, {
    stdio: 'ignore',
    timeout: 5000,
  });

  return probe.status === 0 && probe.error === undefined;
}

export function hasUsableBash(): boolean {
  return canRun('bash', ['--version']);
}

export function hasUsablePosixShell(): boolean {
  return canRun('/bin/sh', ['-c', 'exit 0']);
}
