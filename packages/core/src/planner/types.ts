import type { Migr8Config } from '../config/schema.js';

export type PlanItemStatus = 'READY' | 'MISSING_TARGET' | 'INCOMPATIBLE_SCOPE';

export type PlanBlockerCode = 'NO_TARGETS' | 'UNKNOWN_TARGET' | 'INCOMPATIBLE_SCOPE';

export type PlanBlocker = {
  code: PlanBlockerCode;
  message: string;
  targetId?: string;
  suggestedFixes: string[];
};

export type PlanItem = {
  targetId: string;
  status: PlanItemStatus;
  reasons: string[];
  suggestedFixes: string[];
};

export type MigrationPlan = {
  version: 1;
  createdAt: string;
  repoPath: string;

  config: Migr8Config;
  configMeta: {
    configFile: string | null;
    overridesApplied: string[];
  };

  status: 'READY' | 'BLOCKED';
  items: PlanItem[];
  blockers: PlanBlocker[];

  summary: {
    targetsRequested: number;
    targetsReady: number;
    blockers: number;
  };

  nextSteps: string[];
};
