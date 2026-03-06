export type ValidationResult = {
  ok: boolean;
  summary: string;
  details?: string[];
};

export interface Validator {
  /**
   * Validate a generated target project.
   * Example: gofmt + go test, or python compile/import checks.
   */
  validate(outDir: string): Promise<ValidationResult>;
}