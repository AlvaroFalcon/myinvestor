import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercentage, parseCurrencyInput } from './formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format EUR currency correctly', () => {
      const result1 = formatCurrency(1000, 'EUR');
      const result2 = formatCurrency(10.55, 'EUR');
      expect(result1).toContain('1');
      expect(result1).toContain('000');
      expect(result1).toContain('€');
      expect(result2).toContain('10');
      expect(result2).toContain('55');
      expect(result2).toContain('€');
    });

    it('should format USD currency correctly', () => {
      expect(formatCurrency(1000, 'USD')).toContain('1');
      expect(formatCurrency(10.55, 'USD')).toContain('10');
    });

    it('should default to EUR', () => {
      expect(formatCurrency(100)).toContain('€');
    });
  });

  describe('formatPercentage', () => {
    it('should format positive percentages with plus sign', () => {
      const result = formatPercentage(5.5);
      expect(result).toContain('+');
      expect(result).toContain('5');
    });

    it('should format negative percentages with minus sign', () => {
      const result = formatPercentage(-3.2);
      expect(result).toContain('-');
      expect(result).toContain('3');
    });

    it('should format zero', () => {
      const result = formatPercentage(0);
      expect(result).toContain('0');
    });
  });

  describe('parseCurrencyInput', () => {
    it('should parse Spanish format with comma', () => {
      expect(parseCurrencyInput('10,55')).toBe(10.55);
      expect(parseCurrencyInput('1000,50')).toBe(1000.50);
    });

    it('should handle currency symbols', () => {
      expect(parseCurrencyInput('10,55 €')).toBe(10.55);
      expect(parseCurrencyInput('€ 10,55')).toBe(10.55);
    });

    it('should return 0 for empty or invalid input', () => {
      expect(parseCurrencyInput('')).toBe(0);
      expect(parseCurrencyInput('abc')).toBe(0);
    });
  });
});
