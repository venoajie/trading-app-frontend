
// src/pages/TransactionsPage/components/TransactionsTable.jsx
import { Table, Text } from '@mantine/core';

export function TransactionsTable({ transactions }) {
  const rows = transactions.map((tx) => (
    <Table.Tr key={tx.id}>
      <Table.Td>{tx.instrument_ticker}</Table.Td>
      <Table.Td>{new Date(tx.transaction_date).toLocaleDateString()}</Table.Td>
      <Table.Td style={{ color: tx.transaction_type === 'BUY' ? 'green' : 'red' }}>
        {tx.transaction_type}
      </Table.Td>
      <Table.Td>{parseFloat(tx.quantity).toFixed(4)}</Table.Td>
      <Table.Td>${parseFloat(tx.price).toFixed(2)}</Table.Td>
      <Table.Td>${(parseFloat(tx.quantity) * parseFloat(tx.price)).toFixed(2)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table striped withTableBorder withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Ticker</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th>Type</Table.Th>
          <Table.Th>Quantity</Table.Th>
          <Table.Th>Price</Table.Th>
          <Table.Th>Total Value</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows.length > 0 ? rows : (
        <Table.Tr>
            <Table.Td colSpan={6}><Text align="center">No transactions found.</Text></Table.Td>
        </Table.Tr>
      )}</Table.Tbody>
    </Table>
  );
}