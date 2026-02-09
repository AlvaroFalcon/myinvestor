import { useState, useEffect } from 'react';
import { fundsApi } from '../../api/funds';
import type { Fund, SortField, SortDirection } from '../../api/types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { Pagination } from '../common/pagination';
import { BuyDialog } from './buy-dialog';
import { DEFAULT_PAGE_SIZE } from '../../utils/constants';

export function FundList() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);

  useEffect(() => {
    loadFunds();
  }, [currentPage, sortField, sortDirection]);

  const loadFunds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fundsApi.getFunds({
        page: currentPage,
        limit: DEFAULT_PAGE_SIZE,
        sort: sortField ? `${sortField}:${sortDirection}` : undefined,
      });
      setFunds(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading funds');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleBuyClick = (fund: Fund) => {
    setSelectedFund(fund);
    setIsBuyDialogOpen(true);
  };

  const handleBuySuccess = () => {
    loadFunds();
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    if (sortDirection === 'asc') {
      return (
        <svg className="w-4 h-4 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
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
    <div>
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button
                onClick={() => handleSort('name')}
                className="flex items-center hover:text-gray-700 transition-colors"
              >
                Nombre
                {renderSortIcon('name')}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Símbolo
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button
                onClick={() => handleSort('value')}
                className="flex items-center ml-auto hover:text-gray-700 transition-colors"
              >
                Valor
                {renderSortIcon('value')}
              </button>
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button
                onClick={() => handleSort('profitability.YTD')}
                className="flex items-center ml-auto hover:text-gray-700 transition-colors"
              >
                YTD
                {renderSortIcon('profitability.YTD')}
              </button>
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button
                onClick={() => handleSort('profitability.oneYear')}
                className="flex items-center ml-auto hover:text-gray-700 transition-colors"
              >
                1 Año
                {renderSortIcon('profitability.oneYear')}
              </button>
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
                  onClick={() => handleBuyClick(fund)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Comprar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>

    <div className="md:hidden space-y-4">
      {funds.map((fund) => (
        <div key={fund.id} className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{fund.name}</h3>
              <p className="text-sm text-gray-500">{fund.symbol}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(fund.value, fund.currency)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">YTD</p>
              <p className={`text-sm font-semibold ${
                fund.profitability.YTD >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercentage(fund.profitability.YTD)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">1 Año</p>
              <p className={`text-sm font-semibold ${
                fund.profitability.oneYear >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercentage(fund.profitability.oneYear)}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleBuyClick(fund)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Comprar
          </button>
        </div>
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>

    <BuyDialog
      isOpen={isBuyDialogOpen}
      onClose={() => setIsBuyDialogOpen(false)}
      fund={selectedFund}
      onSuccess={handleBuySuccess}
    />
  </div>
  );
}
