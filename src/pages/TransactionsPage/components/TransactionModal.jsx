
// src/pages/TransactionsPage/components/TransactionModal.jsx
import { Modal, TextInput, Select, NumberInput, Button, Group } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates'; // Requires npm install @mantine/dates
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../services/apiClient';

export function TransactionModal({ opened, onClose, onSave, portfolioId }) {
  const form = useForm({
    initialValues: {
      instrument_ticker: '',
      transaction_type: 'BUY',
      quantity: 0,
      price: 0,
      transaction_date: new Date(),
    },
    validate: {
      instrument_ticker: (value) => (value ? null : 'Ticker is required'),
      quantity: (value) => (value > 0 ? null : 'Quantity must be positive'),
      price: (value) => (value > 0 ? null : 'Price must be positive'),
    },
  });

  const handleSubmit = async (values) => {
    try {
      await apiClient.post('/transactions', { ...values, portfolio_id: portfolioId });
      notifications.show({
        title: 'Success',
        message: 'Transaction saved successfully.',
        color: 'green',
      });
      onSave();
    } catch (error) {
      notifications.show({
        title: 'Error saving transaction',
        message: error.response?.data?.detail || 'An unknown error occurred.',
        color: 'red',
      });
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="New Transaction">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Ticker" {...form.getInputProps('instrument_ticker')} withAsterisk />
        <Select
          label="Type"
          data={['BUY', 'SELL']}
          {...form.getInputProps('transaction_type')}
          withAsterisk
        />
        <NumberInput label="Quantity" {...form.getInputProps('quantity')} min={0} decimalScale={8} withAsterisk />
        <NumberInput label="Price" {...form.getInputProps('price')} min={0} decimalScale={8} withAsterisk />
        <DatePickerInput label="Transaction Date" {...form.getInputProps('transaction_date')} withAsterisk />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </Group>
      </form>
    </Modal>
  );
}