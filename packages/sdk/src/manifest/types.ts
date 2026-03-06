export type PluginKind = 'source' | 'target' | 'rulepack' | 'validator';

export type IRTypeId = string; // ex: "api-ir@1", "ui-ir@1" (Phase 1 uses strings; later can be structured)

export type PluginScope = 'backend' | 'frontend' | 'full';

export type PluginCapability =
  | 'routes'
  | 'middleware'
  | 'handlers'
  | 'models'
  | 'openapi'
  | 'validation'
  | 'codegen'
  | 'reporting';

export type PluginManifestV1 = {
  manifestVersion: 1;

  id: string; // unique plugin id, e.g. "source-express"
  version: string; // semver string, e.g. "0.1.0"
  kind: PluginKind;

  displayName: string;
  description: string;

  // Compatibility surface
  produces?: IRTypeId[]; // for source/rulepack: what it outputs
  consumes?: IRTypeId[]; // for target/rulepack/validator: what it expects

  // What parts it can operate on
  scopes: PluginScope[]; // allowed scopes: backend/frontend/full

  // Capability flags (planner/UX can reason about what's supported)
  capabilities: PluginCapability[];

  // Optional metadata
  homepage?: string;
  repository?: string;

  // Supply-chain fields (Task 5+ will enforce)
  integrity?: {
    algorithm: 'sha256';
    digest: string;
  };
};