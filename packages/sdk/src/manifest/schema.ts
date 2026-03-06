import { z } from 'zod';

export const PluginKindSchema = z.enum(['source', 'target', 'rulepack', 'validator']);
export const PluginScopeSchema = z.enum(['backend', 'frontend', 'full']);

export const PluginCapabilitySchema = z.enum([
  'routes',
  'middleware',
  'handlers',
  'models',
  'openapi',
  'validation',
  'codegen',
  'reporting',
]);

export const IntegritySchema = z.object({
  algorithm: z.literal('sha256'),
  digest: z.string().min(1),
});

export const PluginManifestSchemaV1 = z
  .object({
    manifestVersion: z.literal(1),

    id: z.string().min(1),
    version: z.string().min(1),
    kind: PluginKindSchema,

    displayName: z.string().min(1),
    description: z.string().min(1),

    produces: z.array(z.string().min(1)).optional(),
    consumes: z.array(z.string().min(1)).optional(),

    scopes: z.array(PluginScopeSchema).min(1),
    capabilities: z.array(PluginCapabilitySchema).default([]),

    homepage: z.string().url().optional(),
    repository: z.string().min(1).optional(),

    integrity: IntegritySchema.optional(),
  })
  .strict()
  .superRefine((m, ctx) => {
    // Small safety rules (Phase 1): enforce directionality by kind
    if (m.kind === 'source' && (!m.produces || m.produces.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Source plugins must declare at least one "produces" IR type.',
        path: ['produces'],
      });
    }
    if (m.kind === 'target' && (!m.consumes || m.consumes.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Target plugins must declare at least one "consumes" IR type.',
        path: ['consumes'],
      });
    }
  });

export type PluginManifest = z.infer<typeof PluginManifestSchemaV1>;

export function parsePluginManifest(raw: unknown): PluginManifest {
  const result = PluginManifestSchemaV1.safeParse(raw);
  if (!result.success) {
    const msg = result.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`).join('\n');
    throw new Error(`Invalid plugin manifest:\n${msg}`);
  }
  return result.data;
}