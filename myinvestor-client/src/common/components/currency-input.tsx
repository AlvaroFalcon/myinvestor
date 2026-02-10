import { forwardRef, type InputHTMLAttributes } from 'react';
import { formatCurrency } from '../utils/formatters';

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  error?: string;
  currency?: 'EUR' | 'USD';
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, label, error, currency = 'EUR', ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const cleanValue = inputValue.replace(/[^\d,.-]/g, '');
      const normalizedValue = cleanValue.replace(',', '.');
      const numericValue = parseFloat(normalizedValue);

      if (!isNaN(numericValue)) {
        onChange(numericValue);
      } else if (cleanValue === '' || cleanValue === '-') {
        onChange(0);
      }
    };

    const displayValue = value === 0 ? '' : value.toString().replace('.', ',');
    const errorId = error ? `${props.id || 'currency-input'}-error` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleChange}
            aria-describedby={errorId}
            aria-invalid={error ? 'true' : 'false'}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500'
            }`}
            {...props}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500 text-sm">{currency === 'EUR' ? '€' : '$'}</span>
          </div>
        </div>
        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {value > 0 && !error && (
          <p className="mt-1 text-sm text-gray-500">
            {formatCurrency(value, currency)}
          </p>
        )}
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
