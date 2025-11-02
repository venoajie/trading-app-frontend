// src/hooks/useTransactions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import { notifications } from '@mantine/notifications';

// The new data contract from the OCI-based API
export interface Transaction {
  id: string;
  date: string;
  ticker: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

// The payload for creating a new transaction
export type NewTransactionPayload = Omit<
  Transaction,
  'id' | 'status' | 'currency'
>;

// --- Query Hook for Fetching Transactions ---
const fetchTransactions = async (): Promise<Transaction[]> => {
  // NOTE: Using a placeholder endpoint as the final one is not specified.
  // This should be updated to `/api/v1/transactions/` when ready.
  const { data } = await apiClient.get<Transaction[]>('/transactions');
  return data;
};

export const useTransactions = () => {
  return useQuery<Transaction[], Error>({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });
};

// --- Mutation Hook for Creating a Transaction ---
const createTransaction = async (
  newTransaction: NewTransactionPayload
): Promise<Transaction> => {
  const { data } = await apiClient.post<Transaction>(
    '/transactions/',
    newTransaction
  );
  return data;
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      // Invalidate the cache to trigger a refetch of the transaction list
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      notifications.show({
        title: 'Success',
        message: 'Transaction recorded successfully!',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Failed to create transaction',
        message: error.message || 'An unexpected error occurred.',
        color: 'red',
      });
    },
  });
};
