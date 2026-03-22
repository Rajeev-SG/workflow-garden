# Ship Loop

Workflow Garden ships from committed generated data plus a production Vercel deploy.

## Operator loop

1. Confirm auth surfaces:

   ```bash
   gh auth status
   vercel whoami
   ```

2. Refresh the archive data:

   ```bash
   source ~/.config/claude-openrouter/env.sh
   pnpm activity:refresh
   ```

3. Decide whether to publish from tracked generated-output diffs, not from the refresh-gate log line:

   - `src/data/activity-feed.generated.json`
   - `src/generated/content-index.ts`
   - `src/generated/search-documents.json`

4. If any of those files changed, run:

   ```bash
   pnpm lint
   pnpm test
   pnpm build
   vercel deploy --prod --yes
   vercel inspect workflow-garden.vercel.app --wait
   PROOF_BASE_URL=https://workflow-garden.vercel.app pnpm proof
   ```

5. Only after deploy and proof both pass should the change be committed and moved through the issue branch and PR workflow.

## Monitoring and verification

- Primary production alias: `https://workflow-garden.vercel.app`
- Production deployment summary:

  ```bash
  vercel inspect workflow-garden.vercel.app
  ```

- Deployment history:

  ```bash
  vercel ls workflow-garden --yes
  ```

- Proof artifacts:
  - `output/acceptance/acceptance-proof.md`
  - `output/acceptance/design-proof.md`
  - `output/acceptance/proof-artifacts.json`

## Rollback

If the latest production deploy is bad, pick the prior ready production deployment from `vercel ls workflow-garden --yes` and roll back to it:

```bash
vercel rollback <deployment-url-or-id> --yes
```
