export type FundCategory = 'GLOBAL' | 'TECH' | 'HEALTH' | 'MONEY_MARKET';
export type Currency = 'USD' | 'EUR';

export interface Fund {
  id: string;
  name: string;
  currency: Currency;
  symbol: string;
  value: number;
  category: FundCategory;
  profitability: {
    YTD: number;
    oneYear: number;
    threeYears: number;
    fiveYears: number;
  };
}

export interface FundsResponse {
  data: Fund[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PortfolioItem {
  id: string;
  quantity: number;
  fund: Fund;
  totalValue: number;
}

export interface PortfolioResponse {
  data: PortfolioItem[];
}

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

export interface ApiError {
  error: string;
}

export interface SuccessResponse<T = unknown> {
  message?: string;
  data?: T;
}

export type SortDirection = 'asc' | 'desc';
export type SortField = 'name' | 'value' | 'profitability.YTD' | 'profitability.oneYear' | 'profitability.threeYears' | 'profitability.fiveYears';
