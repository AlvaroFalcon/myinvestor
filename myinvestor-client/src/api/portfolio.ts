import { apiClient } from './client';
import type { PortfolioResponse, TransferRequest, SuccessResponse } from './types';

export const portfolioApi = {
  async getPortfolio(): Promise<PortfolioResponse> {
    return apiClient.get<PortfolioResponse>('/portfolio');
  },

  async transferFunds(data: TransferRequest): Promise<SuccessResponse> {
    return apiClient.post<SuccessResponse>('/funds/transfer', data);
  },
};
