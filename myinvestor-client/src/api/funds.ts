import { apiClient } from './client';
import type {
  FundsResponse,
  Fund,
  BuyRequest,
  SellRequest,
  SuccessResponse,
  SortDirection,
  SortField
} from './types';

export interface GetFundsParams {
  page?: number;
  limit?: number;
  sort?: `${SortField}:${SortDirection}`;
}

export const fundsApi = {
  async getFunds(params: GetFundsParams = {}): Promise<FundsResponse> {
    const { page = 1, limit = 10, sort } = params;
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (sort) {
      searchParams.append('sort', sort);
    }

    return apiClient.get<FundsResponse>(`/funds?${searchParams.toString()}`);
  },

  async getFund(id: string): Promise<Fund> {
    return apiClient.get<Fund>(`/funds/${id}`);
  },

  async buyFund(id: string, data: BuyRequest): Promise<SuccessResponse> {
    return apiClient.post<SuccessResponse>(`/funds/${id}/buy`, data);
  },

  async sellFund(id: string, data: SellRequest): Promise<SuccessResponse> {
    return apiClient.post<SuccessResponse>(`/funds/${id}/sell`, data);
  },
};
