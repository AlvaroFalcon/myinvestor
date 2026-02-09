import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '../../../common/components/dialog';
import { CurrencyInput } from '../../../common/components/currency-input';
import { createTransferSchema, type TransferFormData } from '../../../common/utils/validators';
import { portfolioApi } from '../api/portfolio';
import { useOrders } from '../context/orders-context';
import type { EnrichedPortfolioItem } from '../../../api/types';

interface TransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  holding: EnrichedPortfolioItem | null;
  availableHoldings: EnrichedPortfolioItem[];
  onSuccess: () => void;
}

export function TransferDialog({ isOpen, onClose, holding, availableHoldings, onSuccess }: TransferDialogProps) {
  const { addOrder } = useOrders();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const transferSchema = holding ? createTransferSchema(holding.quantity) : createTransferSchema(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      toFundId: '',
      quantity: 0,
    },
  });

  const selectedToFundId = watch('toFundId');

  const handleClose = () => {
    reset();
    setApiError(null);
    onClose();
  };

  const onSubmit = async (data: TransferFormData) => {
    if (!holding) return;

    if (data.toFundId === holding.fund.id) {
      setApiError('No puedes traspasar al mismo fondo');
      return;
    }

    const toFund = availableHoldings.find(h => h.fund.id === data.toFundId);
    if (!toFund) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      await portfolioApi.transferFunds({
        fromFundId: holding.fund.id,
        toFundId: data.toFundId,
        quantity: data.quantity,
      });
      addOrder({
        type: 'transfer',
        fundId: holding.fund.id,
        fundName: holding.fund.name,
        quantity: data.quantity,
        fromFundId: holding.fund.id,
        fromFundName: holding.fund.name,
        toFundId: toFund.fund.id,
        toFundName: toFund.fund.name,
      });
      onSuccess();
      handleClose();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Error al traspasar el fondo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!holding) return null;

  const otherHoldings = availableHoldings.filter(h => h.fund.id !== holding.fund.id);

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title={`Traspasar ${holding.fund.name}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Desde: <span className="font-semibold">{holding.fund.name}</span>
          </p>
          <p className="text-sm text-gray-600">
            Unidades disponibles: <span className="font-semibold">{holding.quantity.toLocaleString('es-ES', { maximumFractionDigits: 2 })}</span>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fondo de destino
          </label>
          <Controller
            name="toFundId"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.toFundId
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              >
                <option value="">Selecciona un fondo</option>
                {otherHoldings.map(h => (
                  <option key={h.fund.id} value={h.fund.id}>
                    {h.fund.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.toFundId && (
            <p className="mt-1 text-sm text-red-600">{errors.toFundId.message}</p>
          )}
        </div>

        <Controller
          name="quantity"
          control={control}
          render={({ field }) => (
            <CurrencyInput
              label="Cantidad a traspasar"
              value={field.value}
              onChange={field.onChange}
              error={errors.quantity?.message}
              placeholder="0,00"
              currency="EUR"
            />
          )}
        />

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {apiError}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !selectedToFundId}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Traspasando...' : 'Traspasar'}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
