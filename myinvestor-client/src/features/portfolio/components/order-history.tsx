import { useOrders, type OrderType } from '../context/orders-context';

const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  buy: 'Compra',
  sell: 'Venta',
  transfer: 'Traspaso',
};

const ORDER_TYPE_COLORS: Record<OrderType, string> = {
  buy: 'text-green-600',
  sell: 'text-red-600',
  transfer: 'text-blue-600',
};

export function OrderHistory() {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <p className="text-gray-500">No hay órdenes registradas</p>
        <p className="text-sm text-gray-400 mt-2">Tus transacciones aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha/Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fondo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acción
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(order.timestamp).toLocaleString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.type === 'transfer' ? (
                    <>
                      <div>{order.fromFundName}</div>
                      <div className="text-xs text-gray-500">→ {order.toFundName}</div>
                    </>
                  ) : (
                    order.fundName
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`font-semibold ${ORDER_TYPE_COLORS[order.type]}`}>
                    {ORDER_TYPE_LABELS[order.type]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {order.quantity.toLocaleString('es-ES', { maximumFractionDigits: 2 })} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-gray-200">
        {orders.map((order) => (
          <div key={order.id} className="px-4 py-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className={`text-sm font-semibold ${ORDER_TYPE_COLORS[order.type]}`}>
                  {ORDER_TYPE_LABELS[order.type]}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(order.timestamp).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {order.quantity.toLocaleString('es-ES', { maximumFractionDigits: 2 })} €
              </p>
            </div>
            <div className="text-sm text-gray-900">
              {order.type === 'transfer' ? (
                <>
                  <div>{order.fromFundName}</div>
                  <div className="text-xs text-gray-500">→ {order.toFundName}</div>
                </>
              ) : (
                order.fundName
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
