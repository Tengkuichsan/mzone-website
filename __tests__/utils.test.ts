import { describe, it, expect } from 'vitest';
import { swipePower, formatRupiah } from '../src/lib/utils';

describe('Utility Functions', () => {
  describe('swipePower', () => {
    it('should calculate power correctly based on offset and velocity', () => {
      expect(swipePower(100, 2)).toBe(200);
      expect(swipePower(-100, 5)).toBe(500);
      expect(swipePower(0, 10)).toBe(0);
    });
  });

  describe('formatRupiah', () => {
    it('should format numbers to Indonesian Rupiah', () => {
      // NOTE: Node.js Intl might use non-breaking spaces
      const formatted = formatRupiah(50000);
      expect(formatted).toMatch(/Rp\s*50\.000/);
    });
  });
});
