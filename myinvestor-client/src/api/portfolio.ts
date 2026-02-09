import { apiClient } from './client';
import {
  portfolioResponseSchema,
  successResponseSchema,
  type PortfolioResponse,
  type TransferRequest,
  type SuccessResponse
} from './types';

export const portfolioApi = {
  async getPortfolio(): Promise<PortfolioResponse> {
    return apiClient.get('/portfolio', portfolioResponseSchema);
  },

  async transferFunds(data: TransferRequest): Promise<SuccessResponse> {
    return apiClient.post('/funds/transfer', successResponseSchema, data);
  },
};
