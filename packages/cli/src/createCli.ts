import path from 'node:path';
import { Command } from 'commander';
import { createMigrationPlan, resolveMigr8Config, type Scope } from '@migr8/core';

type CommonOpts = {
  config?: string;
  scope?: Scope;
  include?: string[];
  exclude?: string[];
  printConfig?: boolean;
};

type MigrateOpts = CommonOpts & {
  to?: string[];
  out?: string;
  dryRun?: boolean;
};

function collect(value: string, previous: string[]) {
  return previous.concat(value);
}

function addCommonOptions(cmd: Command) {
  return cmd
    .option('-c, --config <path>', 'Path to migr8 config (json/yaml). If omitted, auto-discovers.')
    .option('--scope <scope>', 'Scope to process: backend | frontend | full')
    .option('--include <glob>', 'Include glob (repeatable)', collect, [])
    .option('--exclude <glob>', 'Exclude glob (repeatable)', collect, [])
    .option('--print-config', 'Print resolved config and exit', false);
}

function getBaseCwd() {
  // When running via pnpm -C, process.cwd() becomes packages/cli.
  // INIT_CWD points to the original directory where pnpm was invoked (usually repo root).
  return process.env.INIT_CWD ?? process.cwd();
}

export function createCli() {
  const program = new Command();

  program
    .name('migr8')
    .description('Migr8: plugin-based code migration engine')
    .version('0.0.0')
    .showHelpAfterError()
    .showSuggestionAfterError();

  addCommonOptions(
    program
      .command('scan')
      .description('Scan a repo and produce IR (not implemented yet)')
      .argument('[repo]', 'Repo path (default: current directory)', '.'),
  ).action(async (repo: string, opts: CommonOpts) => {
    const baseCwd = getBaseCwd();
    const repoCwd = path.resolve(baseCwd, repo);

    const resolved = await resolveMigr8Config({
      cwd: repoCwd,
      configPath: opts.config ?? null,
      overrides: {
        scope: opts.scope,
        include: opts.include,
        exclude: opts.exclude,
      },
    });

    if (opts.printConfig) {
      console.log(JSON.stringify({ ...resolved.meta, config: resolved.config }, null, 2));
      return;
    }

    notImplemented('scan');
  });

  addCommonOptions(
    program
      .command('migrate')
      .description('Migrate a repo to a target stack (not implemented yet)')
      .argument('[repo]', 'Repo path (default: current directory)', '.')
      .option('-t, --to <target>', 'Target stack id (repeatable)', collect, [])
      .option('--out <dir>', 'Output directory override')
      .option('--dry-run', 'Print migration plan and exit (no files written)', false),
  ).action(async (repo: string, opts: MigrateOpts) => {
    const baseCwd = getBaseCwd();
    const repoCwd = path.resolve(baseCwd, repo);

    const resolved = await resolveMigr8Config({
      cwd: repoCwd,
      configPath: opts.config ?? null,
      overrides: {
        scope: opts.scope,
        include: opts.include,
        exclude: opts.exclude,
        targets: opts.to,
        outDir: opts.out,
      },
    });

    if (opts.printConfig) {
      console.log(JSON.stringify({ ...resolved.meta, config: resolved.config }, null, 2));
      return;
    }

    if (opts.dryRun) {
      const plan = createMigrationPlan({
        repoPath: repoCwd,
        config: resolved.config,
        configMeta: resolved.meta,
      });
      console.log(JSON.stringify(plan, null, 2));
      return;
    }

    notImplemented('migrate');
  });

  addCommonOptions(
    program
      .command('validate')
      .description('Validate a generated output project (not implemented yet)')
      .argument('[outDir]', 'Output dir (default: migr8-out)', 'migr8-out'),
  ).action((_outDir: string) => notImplemented('validate'));

  addCommonOptions(
    program
      .command('report')
      .description('Generate a migration report (not implemented yet)')
      .argument('[outDir]', 'Output dir (default: migr8-out)', 'migr8-out'),
  ).action((_outDir: string) => notImplemented('report'));

  return program;
}

function notImplemented(cmd: string): never {
  console.error(`[migr8] "${cmd}" is not implemented yet.`);
  process.exit(1);
}
