import { buildSecureMcpBaseline, installSecureMcpBaseline } from '../../installer/mcp-presets.js';

export function mcpBaselineCommand(options: {
  workspace: string;
  github?: boolean;
  dryRun?: boolean;
}): void {
  const baseline = buildSecureMcpBaseline({
    workspace: options.workspace,
    includeGitHub: options.github,
  });

  if (options.dryRun) {
    console.log(JSON.stringify(baseline, null, 2));
    return;
  }

  const result = installSecureMcpBaseline({
    workspace: options.workspace,
    includeGitHub: options.github,
  });
  console.log(`MCP baseline synced: ${result.serverNames.join(', ')}`);
  console.log(`Registry: ${result.registryPath}`);
  console.log('Run `omc doctor conflicts` and inspect all tool descriptions before first use.');
  if (options.github) {
    console.log('Set GITHUB_PERSONAL_ACCESS_TOKEN in the launch environment; no token was written to disk.');
  }
}
