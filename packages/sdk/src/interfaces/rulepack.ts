// export type IRDocument = unknown;
import { IRDocument } from "./adapters";


export type RuleContext = {
  cwd: string;
};

export interface RulePack {
  /**
   * Apply deterministic transformations on IR.
   * Must be repeatable: same input => same output.
   */
  apply(ctx: RuleContext, ir: IRDocument): Promise<IRDocument>;
}