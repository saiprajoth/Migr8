import { describe, expect, it } from 'vitest';
import { CORE_PACKAGE } from '../src/index';

describe('core package', () => {
  it('exports a package marker', () => {
    expect(CORE_PACKAGE).toBe('@migr8/core');
  });
});
