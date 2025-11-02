// src/pages/TransactionsPage/components/TransactionsTable.tsx
import { Table, Text, Badge } from '@mantine/core';
// --- FIX: Corrected import path for the co-located hook's types ---
import { Transaction } from '../hooks/useTransactions';

// l10n formatting helpers (Pillar 2)
const formatDate = (isoDate: string) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(isoDate));
};

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
};

const getStatusColor = (status: Transaction['status']) => {
  switch (status) {
    case 'COMPLETED':
      return 'green';
    case 'PENDING':
      return 'yellow';
    case 'FAILED':
      return 'red';
    default:
      return 'gray';
  }
};

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const rows = transactions.map((tx) => (
    <Table.Tr key={tx.id}>
      <Table.Td>{formatDate(tx.date)}</Table.Td>
      <Table.Td>
        <Text fw={500}>{tx.ticker}</Text>
      </Table.Td>
      <Table.Td>
        <Text c={tx.type === 'BUY' ? 'green' : 'red'} fw={500}>
          {tx.type}
        </Text>
      </Table.Td>
      <Table.Td>
        {tx.quantity.toLocaleString('en-US', { maximumFractionDigits: 8 })}
      </Table.Td>
      <Table.Td>{formatCurrency(tx.price, tx.currency)}</Table.Td>
      <Table.Td>{formatCurrency(tx.quantity * tx.price, tx.currency)}</Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(tx.status)} variant="light">
          {tx.status}
        </Badge>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table striped withTableBorder withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Date</Table.Th>
          <Table.Th>Ticker</Table.Th>
          <Table.Th>Type</Table.Th>
          <Table.Th>Quantity</Table.Th>
          <Table.Th>Price</Table.Th>
          <Table.Th>Total Value</Table.Th>
          <Table.Th>Status</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows.length > 0 ? (
          rows
        ) : (
          <Table.Tr>
            <Table.Td colSpan={7}>
              <Text ta="center" c="dimmed" py="lg">
                No transactions found.
              </Text>
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
}
