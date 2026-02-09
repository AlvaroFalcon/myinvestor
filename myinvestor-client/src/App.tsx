import { useState } from 'react';
import { FundList } from './features/funds/components/fund-list';
import { Portfolio } from './features/portfolio/components/portfolio';
import { PortfolioProvider } from './features/portfolio/context/portfolio-context';
import { OrdersProvider } from './features/portfolio/context/orders-context';

type Tab = 'funds' | 'portfolio';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('funds');

  return (
    <OrdersProvider>
      <PortfolioProvider>
        <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 py-6">MyInvestor</h1>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('funds')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'funds'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Fondos
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'portfolio'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cartera
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'funds' && <FundList />}
        {activeTab === 'portfolio' && <Portfolio />}
      </main>
    </div>
      </PortfolioProvider>
    </OrdersProvider>
  );
}

export default App;
