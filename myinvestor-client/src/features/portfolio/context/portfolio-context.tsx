import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { portfolioApi } from '../api/portfolio';
import { fundsApi } from '../../funds/api/funds';
import type { EnrichedPortfolioItem } from '../../../api/types';

interface PortfolioContextValue {
  portfolio: EnrichedPortfolioItem[];
  loading: boolean;
  error: string | null;
  refreshPortfolio: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolio] = useState<EnrichedPortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshPortfolio = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await portfolioApi.getPortfolio();

      const enrichedPortfolio = await Promise.all(
        response.data.map(async (item) => {
          const fund = await fundsApi.getFund(item.id);
          return {
            id: item.id,
            quantity: item.quantity,
            totalValue: item.totalValue,
            fund,
          };
        })
      );

      setPortfolio(enrichedPortfolio);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading portfolio');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <PortfolioContext.Provider value={{ portfolio, loading, error, refreshPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return context;
}
