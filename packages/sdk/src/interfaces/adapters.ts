export type AdapterContext = {
  cwd: string; // repo root
  scope: 'backend' | 'frontend' | 'full';
  include: string[];
  exclude: string[];
};

export type IRDocument = unknown; // Phase 1: IR lives in core later; for SDK we keep it generic.

export interface SourceAdapter {
  /**
   * Convert a codebase into an IR document.
   * Must not execute repository code.
   */
  scan(ctx: AdapterContext): Promise<IRDocument>;
}

export interface TargetAdapter {
  /**
   * Generate a target codebase from IR.
   * Writes into outDir; should be deterministic and safe.
   */
  generate(ctx: AdapterContext & { outDir: string; ir: IRDocument }): Promise<void>;
}