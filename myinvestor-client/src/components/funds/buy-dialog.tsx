import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '../common/dialog';
import { CurrencyInput } from '../common/currency-input';
import { buySchema, type BuyFormData } from '../../utils/validators';
import type { Fund } from '../../api/types';

interface BuyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fund: Fund | null;
  onSuccess: () => void;
}

export function BuyDialog({ isOpen, onClose, fund, onSuccess }: BuyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    onClose();
  };

  const onSubmit = async (data: BuyFormData) => {
    if (!fund) return;

    setIsSubmitting(true);
    try {
      console.log('Buying fund:', fund.id, 'Quantity:', data.quantity);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error buying fund:', error);
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
