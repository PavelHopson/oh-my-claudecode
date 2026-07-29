import { describe, expect, it } from 'vitest';
import { buildSecureMcpBaseline } from '../mcp-presets.js';

describe('secure MCP baseline', () => {
  it('pins packages and scopes filesystem to the requested workspace', () => {
    const baseline = buildSecureMcpBaseline({ workspace: process.cwd() });
    expect(baseline.filesystem.args).toContain('@modelcontextprotocol/server-filesystem@2026.7.10');
    expect(baseline.filesystem.args?.at(-1)).toBe(process.cwd());
    expect(baseline.context7.args).toContain('@upstash/context7-mcp@3.2.5');
    expect(baseline['github-readonly']).toBeUndefined();
  });

  it('keeps the opt-in GitHub preset read-only and free of literal tokens', () => {
    const baseline = buildSecureMcpBaseline({ workspace: process.cwd(), includeGitHub: true });
    const github = baseline['github-readonly'];
    expect(github.args).toContain('ghcr.io/github/github-mcp-server:0.31.0');
    expect(github.args).toContain('GITHUB_READ_ONLY=1');
    expect(github.args).toContain('GITHUB_LOCKDOWN_MODE=1');
    expect(github.args).toContain('GITHUB_TOOLSETS=context,repos,pull_requests');
    expect(github.env).toBeUndefined();
    expect(JSON.stringify(github)).not.toMatch(/github_pat_|ghp_/);
  });

  it('fails closed for a missing workspace', () => {
    expect(() => buildSecureMcpBaseline({ workspace: '__missing_workspace__' })).toThrow(/not an existing directory/);
  });
});
