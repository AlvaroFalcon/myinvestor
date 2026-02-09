import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { portfolioApi } from '../api/portfolio';
import type { PortfolioItem } from '../../../api/types';

interface PortfolioContextValue {
  portfolio: PortfolioItem[];
  loading: boolean;
  error: string | null;
  refreshPortfolio: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshPortfolio = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await portfolioApi.getPortfolio();
      setPortfolio(response.data);
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
