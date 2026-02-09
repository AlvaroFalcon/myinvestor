import { useState, useEffect } from 'react';
import { fundsApi } from '../../api/funds';
import type { Fund } from '../../api/types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export function FundList() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFunds();
  }, []);

  const loadFunds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fundsApi.getFunds({ page: 1, limit: 10 });
      setFunds(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading funds');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Símbolo
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              YTD
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              1 Año
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {funds.map((fund) => (
            <tr key={fund.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {fund.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {fund.symbol}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {formatCurrency(fund.value, fund.currency)}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                fund.profitability.YTD >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercentage(fund.profitability.YTD)}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                fund.profitability.oneYear >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercentage(fund.profitability.oneYear)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Comprar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
