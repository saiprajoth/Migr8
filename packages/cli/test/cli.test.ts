import { describe, expect, it } from 'vitest';
import { createCli } from '../src/createCli';

describe('cli shell', () => {
  it('registers core commands', () => {
    const program = createCli();
    const names = program.commands.map((c) => c.name());
    expect(names).toEqual(['scan', 'migrate', 'validate', 'report']);
  });
});
