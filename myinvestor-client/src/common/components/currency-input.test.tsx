import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CurrencyInput } from './currency-input';

describe('CurrencyInput', () => {
  it('should render with label', () => {
    const onChange = vi.fn();
    render(<CurrencyInput value={0} onChange={onChange} label="Amount" />);

    expect(screen.getByText('Amount')).toBeInTheDocument();
  });

  it('should display currency symbol', () => {
    const onChange = vi.fn();
    render(<CurrencyInput value={100} onChange={onChange} currency="EUR" />);

    expect(screen.getByText('€')).toBeInTheDocument();
  });

  it('should display formatted value', () => {
    const onChange = vi.fn();
    render(<CurrencyInput value={100} onChange={onChange} />);

    expect(screen.getByText(/100,00 €/)).toBeInTheDocument();
  });

  it('should show error message', () => {
    const onChange = vi.fn();
    render(
      <CurrencyInput
        value={0}
        onChange={onChange}
        error="This field is required"
      />
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should call onChange when input changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<CurrencyInput value={0} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, '100');

    expect(onChange).toHaveBeenCalled();
  });

  it('should handle comma as decimal separator', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<CurrencyInput value={0} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, '10,55');

    expect(onChange).toHaveBeenCalledWith(expect.any(Number));
  });
});
