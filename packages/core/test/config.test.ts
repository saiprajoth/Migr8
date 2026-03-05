import { describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { loadMigr8Config, resolveMigr8Config } from '../src/config/index';

describe('migr8 config', () => {
  it('loads defaults when no config exists', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'migr8-'));
    const loaded = await loadMigr8Config({ cwd: tmp, configPath: null });
    expect(loaded.pathUsed).toBe(null);
    expect(loaded.config.scope).toBe('backend');
  });

  it('auto-discovers migr8.config.json and validates it', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'migr8-'));
    await fs.writeFile(
      path.join(tmp, 'migr8.config.json'),
      JSON.stringify({ version: 1, scope: 'full', include: ['backend/**'] }, null, 2),
      'utf8',
    );

    const loaded = await loadMigr8Config({ cwd: tmp, configPath: null });
    expect(loaded.pathUsed?.endsWith('migr8.config.json')).toBe(true);
    expect(loaded.config.scope).toBe('full');
    expect(loaded.config.include).toEqual(['backend/**']);
  });

  it('CLI overrides take precedence (arrays override only when provided)', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'migr8-'));
    await fs.writeFile(
      path.join(tmp, 'migr8.config.json'),
      JSON.stringify({ version: 1, scope: 'full', include: ['a/**'], targets: ['x'] }, null, 2),
      'utf8',
    );

    const resolved = await resolveMigr8Config({
      cwd: tmp,
      configPath: null,
      overrides: { scope: 'backend', include: ['b/**'], targets: ['fastapi'] },
    });

    expect(resolved.config.scope).toBe('backend');
    expect(resolved.config.include).toEqual(['b/**']);
    expect(resolved.config.targets).toEqual(['fastapi']);
    expect(resolved.meta.configFile?.endsWith('migr8.config.json')).toBe(true);
    expect(resolved.meta.overridesApplied).toContain('scope');
    expect(resolved.meta.overridesApplied).toContain('include');
    expect(resolved.meta.overridesApplied).toContain('targets');
  });
});
