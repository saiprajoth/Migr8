import { loadMigr8Config } from './load.js';
import { parseMigr8Config } from './parse.js';
import type { Migr8Config, Scope } from './schema.js';

export type CliOverrides = Partial<Pick<Migr8Config, 'scope' | 'include' | 'exclude' | 'targets' | 'outDir'>>;

function overrideArray(override: string[] | undefined, base: string[]): string[] {
  return override && override.length > 0 ? override : base;
}

export async function resolveMigr8Config(opts: {
  cwd?: string;
  configPath?: string | null;
  overrides?: CliOverrides;
}): Promise<{
  config: Migr8Config;
  meta: { configFile: string | null; overridesApplied: (keyof CliOverrides)[] };
}> {
  const { config, pathUsed } = await loadMigr8Config({ cwd: opts.cwd, configPath: opts.configPath });

  const o = opts.overrides ?? {};
  const overridesApplied: (keyof CliOverrides)[] = [];

  const merged: Migr8Config = {
    ...config,
    scope: (o.scope ?? config.scope) as Scope,
    include: overrideArray(o.include, config.include),
    exclude: overrideArray(o.exclude, config.exclude),
    targets: overrideArray(o.targets, config.targets),
    outDir: (o.outDir ?? config.outDir) as string,
    version: 1,
  };

  (['scope', 'include', 'exclude', 'targets', 'outDir'] as const).forEach((k) => {
    if (o[k] !== undefined && (Array.isArray(o[k]) ? (o[k] as string[]).length > 0 : true)) {
      overridesApplied.push(k);
    }
  });

  // Validate merged output again (guarantees resolved config is valid)
  const validated = parseMigr8Config(merged);

  return { config: validated, meta: { configFile: pathUsed, overridesApplied } };
}
