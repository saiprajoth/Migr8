import { describe, expect, it } from 'vitest';
import { TEST_HARNESS_PACKAGE } from '../src/index';

describe('test-harness package', () => {
  it('exports a package marker', () => {
    expect(TEST_HARNESS_PACKAGE).toBe('@migr8/test-harness');
  });
});
