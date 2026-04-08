# Claude Code Channels + OMC: Remote Agent Control

Official Anthropic MCP plugins that bridge Telegram/Discord to Claude Code. Combined with OMC, you get full agent orchestration from your phone.

## Setup

### Telegram

```bash
# 1. Create bot via @BotFather in Telegram → get token
# 2. In Claude Code session:
/plugin install telegram@claude-plugins-official
/reload-plugins
/telegram:configure 123456789:AAHfiqksKZ8...

# 3. Restart with channels flag:
claude --channels plugin:telegram@claude-plugins-official

# 4. DM your bot in Telegram → get pairing code
/telegram:access pair <code>

# 5. Lock down access
/telegram:access policy allowlist
```

### Discord

```bash
# 1. Create app at discord.com/developers/applications
#    Enable Message Content Intent, invite bot with proper permissions
# 2. In Claude Code session:
/plugin install discord@claude-plugins-official
/reload-plugins
/discord:configure <TOKEN>

# 3. Restart:
claude --channels plugin:discord@claude-plugins-official

# 4. DM bot → pair
/discord:access pair <code>
/discord:access policy allowlist
```

## Using OMC via Channels

Once channels are active, you can invoke OMC commands by messaging the bot:

| Message to bot | What happens |
|----------------|-------------|
| `run autopilot: refactor the auth module` | OMC `/autopilot` — full autonomous task |
| `team 2:executor build the login page` | OMC `/team` — parallel agents |
| `review the latest PR` | OMC `code-reviewer` agent |
| `check security of src/auth/` | OMC `security-reviewer` agent |
| `plan the new feature: notifications` | OMC `planner` + `architect` agents |

Claude interprets your natural language message and delegates to the appropriate OMC agent, just as if you typed in the terminal.

## Tools Available to Claude

### Telegram
| Tool | Purpose |
|------|---------|
| `reply` | Send message + files (up to 50MB) |
| `react` | Add emoji reaction |
| `edit_message` | Update "working..." → result |

### Discord (extra features)
| Tool | Purpose |
|------|---------|
| `reply` | Send message + files, supports threading |
| `react` | Unicode + custom emoji |
| `edit_message` | Update previous messages |
| `fetch_messages` | Read last 100 messages (context) |
| `download_attachment` | Save shared files to inbox |

## Practical Workflows

### Morning Check from Phone
```
You (Telegram): what's the git status and any failing tests?
Claude: [runs git status, npm test, reports back]
```

### Deploy from Anywhere
```
You (Telegram): deploy to staging, run smoke tests, report results
Claude: [OMC executor → git push, runs tests, reports via Telegram]
```

### Code Review on the Go
```
You (Discord): review PR #42 and leave comments
Claude: [OMC code-reviewer → analyzes diff, posts findings]
```

### Long-Running Task Monitoring
```
You (Telegram): start database migration and notify me when done
Claude: [runs migration, sends Telegram message on completion]
```

## Tips

- **Telegram** has no message history — Claude only sees messages as they arrive in real-time
- **Discord** can fetch last 100 messages — better for context-heavy conversations
- Use `edit_message` for progress updates instead of flooding chat
- Set `allowlist` policy immediately after pairing to prevent unauthorized access
- For multiple bots, use `TELEGRAM_STATE_DIR` / `DISCORD_STATE_DIR` env vars

## Comparison

| Feature | Telegram | Discord |
|---------|----------|---------|
| Message history | No (Bot API limit) | Yes (100 messages) |
| File size limit | 50MB | 25MB (10 files) |
| Threading | No | Yes (reply_to) |
| Custom emoji | No (fixed whitelist) | Yes |
| Group/channel support | Via access.json | Via guild config |
| Best for | Quick commands from phone | Team collaboration |
