# Security Tooling — oh-my-claudecode

> Additive-установка из батча eclipse-library 28.05–05.06.2026. OMC — это сам
> оркестрационный фреймворк (agents/ · skills/ · .claude-plugin/), который другие
> проекты импортируют. Поэтому проверка ЕГО агентных конфигов на prompt injection /
> excessive agency / tool poisoning особенно важна — он распространяется дальше.
> Всё работает **без API-ключа** в статическом режиме.

## 1. AgentShield — скан агентных конфигов (102 правила, без ключа)
```powershell
.\scripts\agent-security-scan.ps1            # static (agents/ skills/ .claude-plugin/)
.\scripts\agent-security-scan.ps1 -Opus      # + Opus 4.6 deep-scan (нужен $env:ANTHROPIC_API_KEY)
```
CI: `.github/workflows/agent-security.yml` — авто-скан на PR в `agents/**` · `skills/**` · `.claude-plugin/**` (report-only, не блокирует).
Репо: https://github.com/affaan-m/agentshield

## 2. SkillSpector (NVIDIA) — gate для новых скиллов/сабагентов
64 паттерна / 16 категорий. Прогонять перед добавлением скилла в каталог OMC.
```powershell
git clone https://github.com/NVIDIA/SkillSpector; cd SkillSpector; make install
skillspector scan ./skills --no-llm
```

## 3. Security Guidance (Anthropic) — глобально, для всех Claude Code сессий
```bash
/plugin marketplace add anthropics/claude-code
/plugin install security-guidance@anthropics
```

## Почему именно для OMC это критично
OMC ставится в десятки проектов (eclipse-ai-hub, eclipse-hopson-sentinel и др.).
Уязвимый/заражённый скилл здесь распространится во все downstream-проекты —
классический supply-chain вектор для агентных фреймворков. SkillSpector как
обязательный gate на новые скиллы закрывает этот риск.
