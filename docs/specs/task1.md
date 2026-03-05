# Task 1 — CLI inputs + migr8.config v1 (SST)

## Spec / AC
- CLI supports: --config, --scope, --include, --exclude (and for migrate: --to, --out)
- migr8.config v1 is supported:
  - auto-discover: migr8.config.json|yaml|yml
  - explicit: --config <path>
- Config is validated via schema; invalid config fails with readable error
- CLI overrides merge predictably over config
- --print-config prints resolved config + metadata and exits 0

## Green commands
- pnpm lint
- pnpm typecheck
- pnpm test
- pnpm build
- pnpm -C packages/cli migr8 scan --help
- pnpm -C packages/cli migr8 scan --print-config
