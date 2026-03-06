import { describe, expect, it } from 'vitest';
import { parsePluginManifest } from '../src/manifest/schema';

describe('PluginManifestSchemaV1', () => {
  it('accepts a valid source manifest', () => {
    const m = parsePluginManifest({
      manifestVersion: 1,
      id: 'source-express',
      version: '0.1.0',
      kind: 'source',
      displayName: 'Express Source',
      description: 'Extracts routes from Express',
      produces: ['api-ir@1'],
      scopes: ['backend'],
      capabilities: ['routes', 'middleware'],
    });

    expect(m.kind).toBe('source');
    expect(m.produces).toContain('api-ir@1');
  });

  it('rejects a source manifest without produces', () => {
    expect(() =>
      parsePluginManifest({
        manifestVersion: 1,
        id: 'source-bad',
        version: '0.1.0',
        kind: 'source',
        displayName: 'Bad Source',
        description: 'Missing produces',
        scopes: ['backend'],
        capabilities: [],
      }),
    ).toThrow(/Source plugins must declare/);
  });

  it('rejects a target manifest without consumes', () => {
    expect(() =>
      parsePluginManifest({
        manifestVersion: 1,
        id: 'target-bad',
        version: '0.1.0',
        kind: 'target',
        displayName: 'Bad Target',
        description: 'Missing consumes',
        scopes: ['backend'],
        capabilities: ['codegen'],
      }),
    ).toThrow(/Target plugins must declare/);
  });
});