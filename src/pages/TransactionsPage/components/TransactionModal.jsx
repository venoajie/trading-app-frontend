// src/pages/TransactionsPage/components/TransactionModal.jsx
import React from 'react';
import { Modal, Button, Stack, TextInput, NumberInput, SegmentedControl } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import  useAuthStore from '../../../store/authStore';
import apiClient from '../../services/apiClient';

export function TransactionModal({ opened, onClose, onSave }) {
  const [loading, setLoading] = React.useState(false);
  const { portfolioId } = useAuthStore(); // Get the portfolioId from our global store

  const form = useForm({
    initialValues: {
      instrument_ticker: '',
      transaction_type: 'BUY',
      quantity: 0,
      price: 0,
      transaction_date: new Date(),
    },
    validate: {
      instrument_ticker: (value) => (value.trim().length > 0 ? null : 'Ticker is required'),
      quantity: (value) => (value > 0 ? null : 'Quantity must be greater than zero'),
      price: (value) => (value > 0 ? null : 'Price must be greater than zero'),
      transaction_date: (value) => (value ? null : 'Transaction date is required'),
    },
  });

  const handleSubmit = async (values) => {
    if (!portfolioId) {
      notifications.show({
        title: 'Error',
        message: 'No portfolio found for your account. Cannot create transaction.',
        color: 'red',
      });
      return;
    }

    setLoading(true);

    // Construct the payload exactly as the API expects it
    const payload = {
      ...values,
      portfolio_id: portfolioId,
      quantity: String(values.quantity), // API expects a string
      price: String(values.price),       // API expects a string
      transaction_date: values.transaction_date.toISOString(), // API expects ISO 8601 format
    };

    try {
      await apiClient.post('/transactions/', payload);
      notifications.show({
        title: 'Success',
        message: 'Transaction recorded successfully!',
        color: 'green',
      });
      onSave(); // This calls the parent's onSave, which closes the modal and refreshes data
      form.reset(); // Reset form for the next time it opens
    } catch (error) {
      notifications.show({
        title: 'Failed to create transaction',
        message: error.response?.data?.detail || 'An unexpected error occurred.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add New Transaction" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label="Ticker Symbol"
            placeholder="e.g., AAPL, BTC-USD"
            {...form.getInputProps('instrument_ticker')}
          />
          <SegmentedControl
            fullWidth
            data={[
              { label: 'Buy', value: 'BUY' },
              { label: 'Sell', value: 'SELL' },
            ]}
            {...form.getInputProps('transaction_type')}
          />
          <NumberInput
            required
            label="Quantity"
            placeholder="e.g., 10.5"
            min={0}
            decimalScale={8}
            {...form.getInputProps('quantity')}
          />
          <NumberInput
            required
            label="Price per Unit (USD)"
            placeholder="e.g., 150.25"
            prefix="$"
            min={0}
            decimalScale={2}
            {...form.getInputProps('price')}
          />
          <DateTimePicker
            required
            label="Transaction Date and Time"
            placeholder="Pick date and time"
            {...form.getInputProps('transaction_date')}
          />
          <Button type="submit" loading={loading} mt="md">
            Save Transaction
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}