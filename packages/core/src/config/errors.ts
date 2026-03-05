export class ConfigError extends Error {
  public readonly code: 'CONFIG_NOT_FOUND' | 'CONFIG_PARSE_ERROR' | 'CONFIG_INVALID';

  constructor(code: ConfigError['code'], message: string) {
    super(message);
    this.code = code;
    this.name = 'ConfigError';
  }
}
