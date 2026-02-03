import { describe, expect, it } from 'vitest';
import { SDK_PACKAGE } from '../src/index';

describe('sdk package', () => {
  it('exports a package marker', () => {
    expect(SDK_PACKAGE).toBe('@migr8/sdk');
  });
});
