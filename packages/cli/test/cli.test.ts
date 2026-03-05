import { describe, expect, it, vi } from 'vitest';
import { createCli } from '../src/createCli';

function optionLongs(cmdName: string) {
  const program = createCli();
  const cmd = program.commands.find((c) => c.name() === cmdName);
  if (!cmd) throw new Error(`missing cmd: ${cmdName}`);
  return cmd.options.map((o) => o.long);
}

describe('cli task2', () => {
  it('migrate has --dry-run', () => {
    const flags = optionLongs('migrate');
    expect(flags).toContain('--dry-run');
  });

  it('migrate --dry-run prints a plan and does not call notImplemented', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});

    const program = createCli();
    program.exitOverride(); // prevent process.exit in tests

    await program.parseAsync(['migrate', '.', '--dry-run', '--to', 'fastapi'], { from: 'user' });

    expect(log).toHaveBeenCalled(); // plan JSON
    expect(err).not.toHaveBeenCalledWith(expect.stringContaining('not implemented'));

    log.mockRestore();
    err.mockRestore();
  });
});
