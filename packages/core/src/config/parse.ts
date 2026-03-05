import { Migr8ConfigSchema, type Migr8Config } from './schema.js';
import { ConfigError } from './errors.js';

export function parseMigr8Config(raw: unknown): Migr8Config {
  const result = Migr8ConfigSchema.safeParse(raw ?? {});
  if (!result.success) {
    const msg = result.error.issues
      .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new ConfigError('CONFIG_INVALID', `Invalid migr8 config:\n${msg}`);
  }
  return result.data;
}
