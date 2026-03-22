# Vendor Auth

Use native vendor CLIs for auth checks.

## GitHub

```bash
gh auth status
```

## Vercel

```bash
vercel whoami
```

## OpenRouter

Workflow Garden's diary pipeline uses OpenRouter for copy refinement during full archive refreshes.

- authoritative local env file on this machine: `~/.config/claude-openrouter/env.sh`
- expected secret: `OPENROUTER_API_KEY`
- optional model override: `WORKFLOW_GARDEN_DIARY_MODEL`

Quick local check:

```bash
source ~/.config/claude-openrouter/env.sh
node -e 'fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${process.env.OPENROUTER_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model:"z-ai/glm-5-turbo",response_format:{type:"json_object"},reasoning:{effort:"none",exclude:true},messages:[{role:"system",content:"Return JSON only."},{role:"user",content:"Return {\"status\":\"ok\"}."}]})}).then(async (r)=>{console.log(r.status); console.log(await r.text())})'
node -e 'fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${process.env.OPENROUTER_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model:"moonshotai/kimi-k2.5",response_format:{type:"json_object"},reasoning:{effort:"none",exclude:true},messages:[{role:"system",content:"Return JSON only."},{role:"user",content:"Return {\"status\":\"ok\"}."}]})}).then(async (r)=>{console.log(r.status); console.log(await r.text())})'
```

## Cloudflare

This repo does not currently target Cloudflare. If that changes, prefer project-local Wrangler commands.

## Google Cloud

```bash
gcloud auth list
```
