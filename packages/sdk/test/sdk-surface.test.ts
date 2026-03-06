import { describe, expect, it } from 'vitest';
import {
  PluginManifestSchemaV1,
  PluginKindSchema,
  PluginScopeSchema,
  PluginCapabilitySchema,
  parsePluginManifest,
} from '../src/index';

describe('SDK surface exports', () => {
  it('exports manifest schemas', () => {
    expect(PluginManifestSchemaV1).toBeTruthy();
    expect(PluginKindSchema).toBeTruthy();
    expect(PluginScopeSchema).toBeTruthy();
    expect(PluginCapabilitySchema).toBeTruthy();
  });

  it('exports parsePluginManifest', () => {
    const m = parsePluginManifest({
      manifestVersion: 1,
      id: 'target-fastapi',
      version: '0.1.0',
      kind: 'target',
      displayName: 'FastAPI Target',
      description: 'Generates FastAPI scaffold',
      consumes: ['api-ir@1'],
      scopes: ['backend'],
      capabilities: ['codegen', 'validation'],
    });
    expect(m.id).toBe('target-fastapi');
  });
});