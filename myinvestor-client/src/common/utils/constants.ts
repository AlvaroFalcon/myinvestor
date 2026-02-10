import type { FundCategory } from '../../api/types';

export const API_BASE_URL = 'http://localhost:3000';
export const MAX_PURCHASE_AMOUNT = 10000;
export const DEFAULT_PAGE_SIZE = 10;

export const CATEGORY_LABELS: Record<FundCategory, string> = {
  GLOBAL: 'Global',
  TECH: 'Tecnología',
  HEALTH: 'Salud',
  MONEY_MARKET: 'Mercado monetario',
};
