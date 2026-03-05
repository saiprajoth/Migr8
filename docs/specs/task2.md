# Task 2 — Migration Planner v1 + --dry-run (SST)

## Spec / AC
- `createMigrationPlan()` exists in @migr8/core and is deterministic.
- `migr8 migrate --dry-run` prints a JSON plan and exits 0.
- Plan classifies:
  - No targets -> BLOCKED (NO_TARGETS)
  - Unknown targets -> BLOCKED (UNKNOWN_TARGET + MISSING_TARGET item)
  - Incompatible scope -> BLOCKED (INCOMPATIBLE_SCOPE)
  - Otherwise -> READY
- Uses repo argument as cwd for config auto-discovery.

## Green commands
- pnpm lint
- pnpm typecheck
- pnpm test
- pnpm build
- pnpm -C packages/cli migr8 migrate . --dry-run --to fastapi
