import { Command } from 'commander';

export function createCli() {
  const program = new Command();

  program
    .name('migr8')
    .description('Migr8: plugin-based code migration engine')
    .version('0.0.0')
    .showHelpAfterError()
    .showSuggestionAfterError();

  // Phase 1: command shells (real implementations come in Task 3+)
  program.command('scan').description('Scan a repo and produce IR').action(() => notImplemented('scan'));
  program
    .command('migrate')
    .description('Migrate a repo to a target stack')
    .action(() => notImplemented('migrate'));
  program
    .command('validate')
    .description('Validate a generated output project')
    .action(() => notImplemented('validate'));
  program.command('report').description('Generate a migration report').action(() => notImplemented('report'));

  return program;
}

function notImplemented(cmd: string): never {
  // For Task 0: fail loudly (so CI doesn’t pretend it works)
  console.error(`[migr8] "${cmd}" is not implemented yet (Task 0 scaffold).`);
  process.exit(1);
}
