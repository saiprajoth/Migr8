export type TargetSupport = {
  backend: boolean;
  frontend: boolean;
};

export type TargetInfo = {
  id: string;
  description: string;
  supports: TargetSupport;
};

/**
 * Phase 1/2: temporary in-core registry.
 * Later (Task 4+) this will be provided by plugins + manifests.
 */
export const TARGET_REGISTRY: Record<string, TargetInfo> = {
  fastapi: {
    id: 'fastapi',
    description: 'Python FastAPI backend scaffold',
    supports: { backend: true, frontend: false },
  },
  'go-gin': {
    id: 'go-gin',
    description: 'Go Gin backend scaffold',
    supports: { backend: true, frontend: false },
  },
};
