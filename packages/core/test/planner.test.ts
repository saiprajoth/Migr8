import { describe, expect, it } from 'vitest';
import { createMigrationPlan } from '../src/index';

describe('migration planner', () => {
  it('blocks when no targets are provided', () => {
    const plan = createMigrationPlan({
      repoPath: '.',
      configMeta: { configFile: null, overridesApplied: [] },
      config: {
        version: 1,
        scope: 'backend',
        include: [],
        exclude: [],
        targets: [],
        outDir: 'migr8-out',
      },
    });

    expect(plan.status).toBe('BLOCKED');
    expect(plan.blockers.some((b) => b.code === 'NO_TARGETS')).toBe(true);
  });

  it('marks unknown target as blocked', () => {
    const plan = createMigrationPlan({
      repoPath: '.',
      configMeta: { configFile: null, overridesApplied: [] },
      config: {
        version: 1,
        scope: 'backend',
        include: [],
        exclude: [],
        targets: ['unknown-target'],
        outDir: 'migr8-out',
      },
    });

    expect(plan.status).toBe('BLOCKED');
    expect(plan.items[0].status).toBe('MISSING_TARGET');
  });

  it('blocks incompatible scope', () => {
    const plan = createMigrationPlan({
      repoPath: '.',
      configMeta: { configFile: null, overridesApplied: [] },
      config: {
        version: 1,
        scope: 'frontend',
        include: [],
        exclude: [],
        targets: ['fastapi'],
        outDir: 'migr8-out',
      },
    });

    expect(plan.status).toBe('BLOCKED');
    expect(plan.items[0].status).toBe('INCOMPATIBLE_SCOPE');
  });
});
