import { useEffect, useState, useMemo } from 'react';
import { usePortfolio } from '../context/portfolio-context';
import { SwipeableItem } from '../../../common/components/swipeable-item';
import { SellDialog } from './sell-dialog';
import { TransferDialog } from './transfer-dialog';
import { OrderHistory } from './order-history';
import { formatCurrency, formatPercentage } from '../../../common/utils/formatters';
import { CATEGORY_LABELS } from '../../../common/utils/constants';
import type { FundCategory, EnrichedPortfolioItem } from '../../../api/types';

type Tab = 'holdings' | 'orders';

export function Portfolio() {
  const { portfolio, loading, error, refreshPortfolio } = usePortfolio();
  const [activeTab, setActiveTab] = useState<Tab>('holdings');
  const [selectedHolding, setSelectedHolding] = useState<EnrichedPortfolioItem | null>(null);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);

  useEffect(() => {
    refreshPortfolio();
  }, [refreshPortfolio]);

  const handleSellClick = (holding: EnrichedPortfolioItem) => {
    setSelectedHolding(holding);
    setIsSellDialogOpen(true);
  };

  const handleSellSuccess = () => {
    refreshPortfolio();
  };

  const handleTransferClick = (holding: EnrichedPortfolioItem) => {
    setSelectedHolding(holding);
    setIsTransferDialogOpen(true);
  };

  const handleTransferSuccess = () => {
    refreshPortfolio();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" role="status" aria-label="Cargando cartera"></div>
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

  const { groupedHoldings, sortedCategories } = useMemo(() => {
    const grouped = portfolio.reduce((acc, item) => {
      const category = item.fund.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<FundCategory, typeof portfolio>);

    const sorted = Object.keys(grouped).sort() as FundCategory[];

    sorted.forEach(category => {
      grouped[category].sort((a, b) =>
        a.fund.name.localeCompare(b.fund.name, 'es')
      );
    });

    return { groupedHoldings: grouped, sortedCategories: sorted };
  }, [portfolio]);

  return (
    <div>
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('holdings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'holdings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Posiciones
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Órdenes
          </button>
        </div>
      </div>

      {activeTab === 'holdings' && (
        <>
          {portfolio.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <p className="text-gray-500">No tienes fondos en tu cartera</p>
              <p className="text-sm text-gray-400 mt-2">Comienza comprando fondos desde la lista</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedCategories.map(category => (
                <div key={category} className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase">
                      {CATEGORY_LABELS[category]}
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {groupedHoldings[category].map(item => (
                      <div key={item.id} className="md:hidden">
                        <SwipeableItem
                          actions={
                            <>
                              <button
                                onClick={() => handleSellClick(item)}
                                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md"
                              >
                                Vender
                              </button>
                              <button
                                onClick={() => handleTransferClick(item)}
                                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md"
                              >
                                Traspasar
                              </button>
                            </>
                          }
                        >
                          <div className="px-6 py-4 bg-white">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-900">{item.fund.name}</h4>
                                <p className="text-xs text-gray-500 mt-1">{item.fund.symbol}</p>
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-sm font-semibold text-gray-900">
                                  {formatCurrency(item.totalValue, item.fund.currency)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {item.quantity.toLocaleString('es-ES', { maximumFractionDigits: 2 })} unidades
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-500">YTD</p>
                                <p className={`text-sm font-semibold ${
                                  item.fund.profitability.YTD >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {formatPercentage(item.fund.profitability.YTD)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">1 Año</p>
                                <p className={`text-sm font-semibold ${
                                  item.fund.profitability.oneYear >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {formatPercentage(item.fund.profitability.oneYear)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </SwipeableItem>
                      </div>
                    ))}
                    {groupedHoldings[category].map(item => (
                      <div key={`desktop-${item.id}`} className="hidden md:block px-6 py-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900">{item.fund.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{item.fund.symbol}</p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-sm font-semibold text-gray-900">
                              {formatCurrency(item.totalValue, item.fund.currency)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.quantity.toLocaleString('es-ES', { maximumFractionDigits: 2 })} unidades
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">YTD</p>
                            <p className={`text-sm font-semibold ${
                              item.fund.profitability.YTD >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatPercentage(item.fund.profitability.YTD)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">1 Año</p>
                            <p className={`text-sm font-semibold ${
                              item.fund.profitability.oneYear >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatPercentage(item.fund.profitability.oneYear)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => handleSellClick(item)}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Vender
                          </button>
                          <button
                            onClick={() => handleTransferClick(item)}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Traspasar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'orders' && <OrderHistory />}

      <SellDialog
        isOpen={isSellDialogOpen}
        onClose={() => setIsSellDialogOpen(false)}
        holding={selectedHolding}
        onSuccess={handleSellSuccess}
      />

      <TransferDialog
        isOpen={isTransferDialogOpen}
        onClose={() => setIsTransferDialogOpen(false)}
        holding={selectedHolding}
        availableHoldings={portfolio}
        onSuccess={handleTransferSuccess}
      />
    </div>
  );
}
