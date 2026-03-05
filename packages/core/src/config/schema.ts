import { z } from 'zod';

export const ScopeSchema = z.enum(['backend', 'frontend', 'full']);
export type Scope = z.infer<typeof ScopeSchema>;

export const Migr8ConfigSchema = z
  .object({
    version: z.literal(1).default(1),

    // What to convert
    scope: ScopeSchema.default('backend'),

    // Where to look
    include: z.array(z.string().min(1)).default([]),
    exclude: z.array(z.string().min(1)).default([]),

    // What to generate
    targets: z.array(z.string().min(1)).default([]),

    // Where to write generated output (future tasks will use it)
    outDir: z.string().min(1).default('migr8-out'),
  })
  .strict();

export type Migr8Config = z.infer<typeof Migr8ConfigSchema>;
