import { apiClient } from './client';
import {
  fundsResponseSchema,
  fundSchema,
  successResponseSchema,
  type FundsResponse,
  type Fund,
  type BuyRequest,
  type SellRequest,
  type SuccessResponse,
  type SortDirection,
  type SortField
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

    return apiClient.get(`/funds?${searchParams.toString()}`, fundsResponseSchema);
  },

  async getFund(id: string): Promise<Fund> {
    return apiClient.get(`/funds/${id}`, fundSchema);
  },

  async buyFund(id: string, data: BuyRequest): Promise<SuccessResponse> {
    return apiClient.post(`/funds/${id}/buy`, successResponseSchema, data);
  },

  async sellFund(id: string, data: SellRequest): Promise<SuccessResponse> {
    return apiClient.post(`/funds/${id}/sell`, successResponseSchema, data);
  },
};
