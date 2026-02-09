import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Pagination } from './pagination';

describe('Pagination', () => {
  it('should render current page info', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={10} onPageChange={onPageChange} />);

    expect(screen.getByText(/Página/)).toBeInTheDocument();
    const page2Elements = screen.getAllByText('2');
    expect(page2Elements.length).toBeGreaterThan(0);
    const page10Elements = screen.getAllByText('10');
    expect(page10Elements.length).toBeGreaterThan(0);
  });

  it('should disable previous button on first page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    const prevButtons = screen.getAllByRole('button', { name: /anterior/i });
    prevButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('should disable next button on last page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={10} totalPages={10} onPageChange={onPageChange} />);

    const nextButtons = screen.getAllByRole('button', { name: /siguiente/i });
    nextButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('should call onPageChange when clicking page number', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    const page3Button = screen.getByRole('button', { name: '3' });
    await user.click(page3Button);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('should call onPageChange when clicking next', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    const nextButtons = screen.getAllByRole('button', { name: /siguiente/i });
    await user.click(nextButtons[0]);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should highlight current page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />);

    const page3Button = screen.getByRole('button', { name: '3' });
    expect(page3Button).toHaveClass('bg-blue-50');
  });
});
