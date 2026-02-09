import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '../../../common/components/dialog';
import { CurrencyInput } from '../../../common/components/currency-input';
import { createSellSchema, type SellFormData } from '../../../common/utils/validators';
import { fundsApi } from '../../funds/api/funds';
import type { PortfolioItem } from '../../../api/types';

interface SellDialogProps {
  isOpen: boolean;
  onClose: () => void;
  holding: PortfolioItem | null;
  onSuccess: () => void;
}

export function SellDialog({ isOpen, onClose, holding, onSuccess }: SellDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const sellSchema = holding ? createSellSchema(holding.quantity) : createSellSchema(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SellFormData>({
    resolver: zodResolver(sellSchema),
    defaultValues: {
      quantity: 0,
    },
  });

  const handleClose = () => {
    reset();
    setApiError(null);
    onClose();
  };

  const onSubmit = async (data: SellFormData) => {
    if (!holding) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      await fundsApi.sellFund(holding.fund.id, { quantity: data.quantity });
      onSuccess();
      handleClose();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Error al vender el fondo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!holding) return null;

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title={`Vender ${holding.fund.name}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Valor actual: <span className="font-semibold">{holding.fund.value} {holding.fund.currency}</span>
          </p>
          <p className="text-sm text-gray-600">
            Unidades disponibles: <span className="font-semibold">{holding.quantity.toLocaleString('es-ES', { maximumFractionDigits: 2 })}</span>
          </p>
        </div>

        <Controller
          name="quantity"
          control={control}
          render={({ field }) => (
            <CurrencyInput
              label="Cantidad a vender"
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
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Vendiendo...' : 'Vender'}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
