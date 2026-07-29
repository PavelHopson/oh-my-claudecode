import { statSync } from 'fs';
import { resolve } from 'path';
import {
  mergeUnifiedMcpRegistryEntries,
  type UnifiedMcpRegistry,
  type UnifiedMcpRegistrySyncResult,
} from './mcp-registry.js';

const FILESYSTEM_PACKAGE = '@modelcontextprotocol/server-filesystem@2026.7.10';
const CONTEXT7_PACKAGE = '@upstash/context7-mcp@3.2.5';
const GITHUB_IMAGE = 'ghcr.io/github/github-mcp-server:0.31.0';

function npxEntry(packageName: string, args: string[] = []) {
  return process.platform === 'win32'
    ? { command: 'cmd', args: ['/c', 'npx', '-y', packageName, ...args] }
    : { command: 'npx', args: ['-y', packageName, ...args] };
}

export function buildSecureMcpBaseline(options: {
  workspace: string;
  includeGitHub?: boolean;
}): UnifiedMcpRegistry {
  const workspace = resolve(options.workspace);
  if (!statSync(workspace, { throwIfNoEntry: false })?.isDirectory()) {
    throw new Error(`Workspace is not an existing directory: ${workspace}`);
  }

  const registry: UnifiedMcpRegistry = {
    context7: npxEntry(CONTEXT7_PACKAGE),
    filesystem: npxEntry(FILESYSTEM_PACKAGE, [workspace]),
  };

  if (options.includeGitHub) {
    registry['github-readonly'] = {
      command: 'docker',
      args: [
        'run', '-i', '--rm',
        '-e', 'GITHUB_PERSONAL_ACCESS_TOKEN',
        '-e', 'GITHUB_READ_ONLY=1',
        '-e', 'GITHUB_LOCKDOWN_MODE=1',
        '-e', 'GITHUB_TOOLSETS=context,repos,pull_requests',
        GITHUB_IMAGE,
      ],
    };
  }

  return registry;
}

export function installSecureMcpBaseline(options: {
  workspace: string;
  includeGitHub?: boolean;
}): UnifiedMcpRegistrySyncResult {
  return mergeUnifiedMcpRegistryEntries(buildSecureMcpBaseline(options));
}
