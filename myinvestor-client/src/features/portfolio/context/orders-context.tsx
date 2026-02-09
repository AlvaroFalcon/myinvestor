import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type OrderType = 'buy' | 'sell' | 'transfer';
export type OrderStatus = 'completed' | 'failed';

export interface Order {
  id: string;
  timestamp: number;
  type: OrderType;
  fundId: string;
  fundName: string;
  quantity: number;
  fromFundId?: string;
  fromFundName?: string;
  toFundId?: string;
  toFundName?: string;
  status: OrderStatus;
}

interface OrdersContextValue {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'timestamp' | 'status'>) => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

const STORAGE_KEY = 'myinvestor_orders';

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setOrders(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading orders from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = useCallback((orderData: Omit<Order, 'id' | 'timestamp' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      timestamp: Date.now(),
      status: 'completed',
    };

    setOrders(prev => [newOrder, ...prev]);
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider');
  }
  return context;
}
