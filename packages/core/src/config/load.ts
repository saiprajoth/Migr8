import fs from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { parseMigr8Config } from './parse.js';
import { ConfigError } from './errors.js';
import type { Migr8Config } from './schema.js';

const DEFAULT_CANDIDATES = ['migr8.config.json', 'migr8.config.yaml', 'migr8.config.yml'];

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function parseByExt(filePath: string, contents: string): unknown {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.yaml' || ext === '.yml') return parseYaml(contents);
  // default JSON
  return JSON.parse(contents);
}

export async function loadMigr8Config(opts: {
  cwd?: string;
  configPath?: string | null;
}): Promise<{ config: Migr8Config; pathUsed: string | null }> {
  const cwd = opts.cwd ?? process.cwd();
  const configPath = opts.configPath ?? null;

  // If user explicitly set a path, it must exist
  if (configPath) {
    const abs = path.isAbsolute(configPath) ? configPath : path.join(cwd, configPath);
    if (!(await exists(abs))) {
      throw new ConfigError('CONFIG_NOT_FOUND', `Config file not found: ${abs}`);
    }
    const contents = await fs.readFile(abs, 'utf8');
    let raw: unknown;
    try {
      raw = parseByExt(abs, contents);
    } catch (e) {
      throw new ConfigError(
        'CONFIG_PARSE_ERROR',
        `Failed to parse config file: ${abs}\n${String(e)}`,
      );
    }
    return { config: parseMigr8Config(raw), pathUsed: abs };
  }

  // Auto-discover
  for (const candidate of DEFAULT_CANDIDATES) {
    const abs = path.join(cwd, candidate);
    if (await exists(abs)) {
      const contents = await fs.readFile(abs, 'utf8');
      let raw: unknown;
      try {
        raw = parseByExt(abs, contents);
      } catch (e) {
        throw new ConfigError(
          'CONFIG_PARSE_ERROR',
          `Failed to parse config file: ${abs}\n${String(e)}`,
        );
      }
      return { config: parseMigr8Config(raw), pathUsed: abs };
    }
  }

  // No config present => defaults
  return { config: parseMigr8Config({}), pathUsed: null };
}
