import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '../../../common/components/dialog';
import { CurrencyInput } from '../../../common/components/currency-input';
import { buySchema, type BuyFormData } from '../../../common/utils/validators';
import { fundsApi } from '../api/funds';
import { useOrders } from '../../portfolio/context/orders-context';
import type { Fund } from '../../../api/types';

interface BuyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fund: Fund | null;
  onSuccess: () => void;
}

export function BuyDialog({ isOpen, onClose, fund, onSuccess }: BuyDialogProps) {
  const { addOrder } = useOrders();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BuyFormData>({
    resolver: zodResolver(buySchema),
    defaultValues: {
      quantity: 0,
    },
  });

  const handleClose = () => {
    reset();
    setApiError(null);
    onClose();
  };

  const onSubmit = async (data: BuyFormData) => {
    if (!fund) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      await fundsApi.buyFund(fund.id, { quantity: data.quantity });
      addOrder({
        type: 'buy',
        fundId: fund.id,
        fundName: fund.name,
        quantity: data.quantity,
      });
      onSuccess();
      handleClose();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Error al comprar el fondo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!fund) return null;

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title={`Comprar ${fund.name}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Valor actual: <span className="font-semibold">{fund.value} {fund.currency}</span>
          </p>
        </div>

        <Controller
          name="quantity"
          control={control}
          render={({ field }) => (
            <CurrencyInput
              label="Cantidad a invertir"
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
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Comprando...' : 'Comprar'}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
