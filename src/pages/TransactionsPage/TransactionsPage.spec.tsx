// src/pages/TransactionsPage/TransactionsPage.spec.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { TransactionsPage } from './TransactionsPage';
import { useTransactions, Transaction } from '../../hooks/useTransactions';

// Mock the custom hook
vi.mock('../../hooks/useTransactions');

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2023-10-26T10:00:00Z',
    ticker: 'AAPL',
    type: 'BUY',
    quantity: 10,
    price: 170.0,
    currency: 'USD',
    status: 'COMPLETED',
  },
  {
    id: '2',
    date: '2023-10-25T14:30:00Z',
    ticker: 'GOOGL',
    type: 'SELL',
    quantity: 5,
    price: 135.5,
    currency: 'USD',
    status: 'PENDING',
  },
];

describe('TransactionsPage', () => {
  it('displays a skeleton loader while transactions are loading', () => {
    (useTransactions as any).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(
      <MemoryRouter>
        <TransactionsPage />
      </MemoryRouter>
    );

    // Skeleton does not have a role, so we test for its presence indirectly
    // by checking that the table content is NOT there.
    expect(screen.queryByText('AAPL')).not.toBeInTheDocument();
    expect(screen.queryByText('GOOGL')).not.toBeInTheDocument();
  });

  it('displays an error message when fetching fails', () => {
    (useTransactions as any).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Network Error'),
    });

    render(
      <MemoryRouter>
        <TransactionsPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Failed to load transactions/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
  });

  it('displays the transactions table with data on successful fetch', () => {
    (useTransactions as any).mockReturnValue({
      data: mockTransactions,
      isLoading: false,
      isError: false,
    });

    render(
      <MemoryRouter>
        <TransactionsPage />
      </MemoryRouter>
    );

    // Check for key data points from the mock transactions
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('GOOGL')).toBeInTheDocument();
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
    expect(screen.getByText('$1,700.00')).toBeInTheDocument(); // Total value of AAPL
  });
});
