import { z } from 'zod';

export const fundCategorySchema = z.enum(['GLOBAL', 'TECH', 'HEALTH', 'MONEY_MARKET']);
export const currencySchema = z.enum(['USD', 'EUR']);

export const fundSchema = z.object({
  id: z.string(),
  name: z.string(),
  currency: currencySchema,
  symbol: z.string(),
  value: z.number(),
  category: fundCategorySchema,
  profitability: z.object({
    YTD: z.number(),
    oneYear: z.number(),
    threeYears: z.number(),
    fiveYears: z.number(),
  }),
});

export const fundsResponseSchema = z.object({
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    totalFunds: z.number(),
    totalPages: z.number(),
  }),
  data: z.array(fundSchema),
});

export const portfolioItemSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  fund: fundSchema,
  totalValue: z.number(),
});

export const portfolioResponseSchema = z.object({
  data: z.array(portfolioItemSchema),
});

export const successResponseSchema = z.object({
  message: z.string().optional(),
  data: z.unknown().optional(),
});

export const apiErrorSchema = z.object({
  error: z.string(),
});

export type FundCategory = z.infer<typeof fundCategorySchema>;
export type Currency = z.infer<typeof currencySchema>;
export type Fund = z.infer<typeof fundSchema>;
export type FundsResponse = z.infer<typeof fundsResponseSchema>;
export type PortfolioItem = z.infer<typeof portfolioItemSchema>;
export type PortfolioResponse = z.infer<typeof portfolioResponseSchema>;
export type SuccessResponse<T = unknown> = {
  message?: string;
  data?: T;
};
export type ApiError = z.infer<typeof apiErrorSchema>;

export interface BuyRequest {
  quantity: number;
}

export interface SellRequest {
  quantity: number;
}

export interface TransferRequest {
  fromFundId: string;
  toFundId: string;
  quantity: number;
}

export type SortDirection = 'asc' | 'desc';
export type SortField = 'name' | 'value' | 'profitability.YTD' | 'profitability.oneYear' | 'profitability.threeYears' | 'profitability.fiveYears';
