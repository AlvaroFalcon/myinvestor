import { z } from 'zod';
import { MAX_PURCHASE_AMOUNT } from './constants';

export const buySchema = z.object({
  quantity: z
    .number({
      required_error: 'La cantidad es obligatoria',
      invalid_type_error: 'Debe ser un número',
    })
    .positive('La cantidad debe ser positiva')
    .max(MAX_PURCHASE_AMOUNT, `La compra máxima es de €${MAX_PURCHASE_AMOUNT.toLocaleString('es-ES')}`),
});

export const createSellSchema = (maxQuantity: number) => {
  return z.object({
    quantity: z
      .number({
        required_error: 'La cantidad es obligatoria',
        invalid_type_error: 'Debe ser un número',
      })
      .positive('La cantidad debe ser positiva')
      .max(maxQuantity, `No puedes vender más de ${maxQuantity.toLocaleString('es-ES')} unidades`),
  });
};

export const createTransferSchema = (maxQuantity: number) => {
  return z.object({
    toFundId: z
      .string({
        required_error: 'Debes seleccionar un fondo de destino',
      })
      .min(1, 'Debes seleccionar un fondo de destino'),
    quantity: z
      .number({
        required_error: 'La cantidad es obligatoria',
        invalid_type_error: 'Debe ser un número',
      })
      .positive('La cantidad debe ser positiva')
      .max(maxQuantity, `No puedes traspasar más de ${maxQuantity.toLocaleString('es-ES')} unidades`),
  });
};

export type BuyFormData = z.infer<typeof buySchema>;
export type SellFormData = { quantity: number };
export type TransferFormData = { toFundId: string; quantity: number };
