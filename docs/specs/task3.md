# Task 3 — Plugin SDK v1 + Plugin Manifest v1 (SST)

## Spec / AC
- @migr8/sdk exports:
  - plugin manifest schema + parser
  - interfaces: SourceAdapter, TargetAdapter, RulePack, Validator
- Manifest v1 validates:
  - source requires `produces`
  - target requires `consumes`
  - scopes/capabilities are enums
- Unit tests cover valid/invalid manifests.

## Green commands
- pnpm lint
- pnpm typecheck
- pnpm test
- pnpm build
- pnpm -C packages/sdk test