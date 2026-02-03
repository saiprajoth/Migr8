# Task 0 — Project setup + CLI shell (SST)

## Spec (AC)
- Monorepo exists with packages: core, sdk, cli, test-harness, plugins folder.
- Global scripts: lint/typecheck/test/build.
- GitHub Actions CI runs those scripts and blocks merge on failure.
- CLI shell exists: `migr8 --help` works.

## Green commands
- pnpm lint
- pnpm typecheck
- pnpm test
- pnpm build
- pnpm -C packages/cli migr8 --help
