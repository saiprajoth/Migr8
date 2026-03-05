import path from 'node:path';
import type { Migr8Config } from '../config/schema.js';
import { TARGET_REGISTRY } from './registry.js';
import type { MigrationPlan, PlanBlocker, PlanItem } from './types.js';

function scopeNeeds(scope: Migr8Config['scope']): { backend: boolean; frontend: boolean } {
  if (scope === 'backend') return { backend: true, frontend: false };
  if (scope === 'frontend') return { backend: false, frontend: true };
  return { backend: true, frontend: true }; // full
}

function isScopeCompatible(config: Migr8Config, supports: { backend: boolean; frontend: boolean }) {
  const needs = scopeNeeds(config.scope);
  if (needs.backend && !supports.backend) return false;
  if (needs.frontend && !supports.frontend) return false;
  return true;
}

export function createMigrationPlan(opts: {
  repoPath: string;
  config: Migr8Config;
  configMeta: { configFile: string | null; overridesApplied: string[] };
}): MigrationPlan {
  const repoAbs = path.resolve(opts.repoPath);
  const createdAt = new Date().toISOString();

  const blockers: PlanBlocker[] = [];
  const items: PlanItem[] = [];

  const targets = opts.config.targets ?? [];
  if (targets.length === 0) {
    blockers.push({
      code: 'NO_TARGETS',
      message: 'No targets specified.',
      suggestedFixes: [
        'Pass at least one target via CLI: migr8 migrate --to <target>',
        'Or set targets in migr8.config.json/yaml (version: 1).',
        'Example: targets: ["fastapi"]',
      ],
    });
  }

  for (const targetId of targets) {
    const info = TARGET_REGISTRY[targetId];

    if (!info) {
      items.push({
        targetId,
        status: 'MISSING_TARGET',
        reasons: [`Target "${targetId}" is unknown (no registry entry / plugin not installed).`],
        suggestedFixes: [
          `Use a known target (phase 1): ${Object.keys(TARGET_REGISTRY).join(', ')}`,
          `Later: install a plugin providing target "${targetId}" (Task 4).`,
        ],
      });

      blockers.push({
        code: 'UNKNOWN_TARGET',
        targetId,
        message: `Unknown target "${targetId}".`,
        suggestedFixes: [
          `Use one of: ${Object.keys(TARGET_REGISTRY).join(', ')}`,
          'Later: install a plugin that provides this target.',
        ],
      });

      continue;
    }

    if (!isScopeCompatible(opts.config, info.supports)) {
      items.push({
        targetId,
        status: 'INCOMPATIBLE_SCOPE',
        reasons: [
          `Target "${targetId}" does not support scope "${opts.config.scope}".`,
          `Supports: backend=${info.supports.backend}, frontend=${info.supports.frontend}`,
        ],
        suggestedFixes: [
          `Change scope to a compatible value. For "${targetId}": try "--scope backend".`,
          'Or choose a target that supports your desired scope.',
        ],
      });

      blockers.push({
        code: 'INCOMPATIBLE_SCOPE',
        targetId,
        message: `Target "${targetId}" incompatible with scope "${opts.config.scope}".`,
        suggestedFixes: [`Try: migr8 migrate --to ${targetId} --scope backend --dry-run`],
      });

      continue;
    }

    items.push({
      targetId,
      status: 'READY',
      reasons: [`Target "${targetId}" is compatible with scope "${opts.config.scope}".`],
      suggestedFixes: [],
    });
  }

  const targetsReady = items.filter((i) => i.status === 'READY').length;

  const status: MigrationPlan['status'] = blockers.length === 0 ? 'READY' : 'BLOCKED';

  const nextSteps: string[] =
    status === 'READY'
      ? [
          'Proceed to execution (Task 8+): scan → IR → transforms → generate output.',
          'For now Phase 1 still stops before writing files.',
        ]
      : [
          'Fix blockers above and rerun: migr8 migrate --dry-run',
          'If targets are unknown, use a known target (fastapi/go-gin) for Phase 1.',
        ];

  return {
    version: 1,
    createdAt,
    repoPath: repoAbs,
    config: opts.config,
    configMeta: {
      configFile: opts.configMeta.configFile,
      overridesApplied: opts.configMeta.overridesApplied,
    },
    status,
    items,
    blockers,
    summary: {
      targetsRequested: targets.length,
      targetsReady,
      blockers: blockers.length,
    },
    nextSteps,
  };
}
