import { describe, it, expect } from 'vitest';
import { buySchema, createSellSchema, createTransferSchema } from './validators';

describe('validators', () => {
  describe('buySchema', () => {
    it('should accept valid quantity', () => {
      const result = buySchema.safeParse({ quantity: 5000 });
      expect(result.success).toBe(true);
    });

    it('should reject quantity over 10000', () => {
      const result = buySchema.safeParse({ quantity: 10001 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
        expect(result.error.issues[0].message).toContain('10');
      }
    });

    it('should reject negative quantity', () => {
      const result = buySchema.safeParse({ quantity: -100 });
      expect(result.success).toBe(false);
    });

    it('should reject zero', () => {
      const result = buySchema.safeParse({ quantity: 0 });
      expect(result.success).toBe(false);
    });
  });

  describe('createSellSchema', () => {
    it('should accept quantity within max', () => {
      const schema = createSellSchema(100);
      const result = schema.safeParse({ quantity: 50 });
      expect(result.success).toBe(true);
    });

    it('should reject quantity over max', () => {
      const schema = createSellSchema(100);
      const result = schema.safeParse({ quantity: 150 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
        expect(result.error.issues[0].message).toContain('100');
      }
    });

    it('should reject negative quantity', () => {
      const schema = createSellSchema(100);
      const result = schema.safeParse({ quantity: -10 });
      expect(result.success).toBe(false);
    });
  });

  describe('createTransferSchema', () => {
    it('should accept valid transfer', () => {
      const schema = createTransferSchema(100);
      const result = schema.safeParse({
        toFundId: 'fund-2',
        quantity: 50,
      });
      expect(result.success).toBe(true);
    });

    it('should reject quantity over max', () => {
      const schema = createTransferSchema(100);
      const result = schema.safeParse({
        toFundId: 'fund-2',
        quantity: 150,
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty toFundId', () => {
      const schema = createTransferSchema(100);
      const result = schema.safeParse({
        toFundId: '',
        quantity: 50,
      });
      expect(result.success).toBe(false);
    });

    it('should reject negative quantity', () => {
      const schema = createTransferSchema(100);
      const result = schema.safeParse({
        toFundId: 'fund-2',
        quantity: -10,
      });
      expect(result.success).toBe(false);
    });
  });
});
