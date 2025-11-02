// src/pages/TransactionsPage/components/TransactionModal.tsx
import {
  Modal,
  Button,
  Stack,
  TextInput,
  NumberInput,
  SegmentedControl,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useCreateTransaction,
  NewTransactionPayload,
} from '../hooks/useTransactions';

// --- FIX: Use `z.instanceof(Date)` for robust, type-safe validation ---
const transactionSchema = z.object({
  ticker: z.string().min(1, 'Ticker symbol is required'),
  type: z.enum(['BUY', 'SELL']),
  quantity: z.number().positive('Quantity must be greater than zero'),
  price: z.number().positive('Price must be greater than zero'),
  date: z.instanceof(Date, { message: 'Transaction date is required' }),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionModalProps {
  opened: boolean;
  onClose: () => void;
}

export function TransactionModal({ opened, onClose }: TransactionModalProps) {
  const { mutate: addTransaction, isPending } = useCreateTransaction();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'BUY',
      date: new Date(),
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: TransactionFormValues) => {
    const payload: NewTransactionPayload = {
      ...data,
      date: data.date.toISOString(),
    };
    addTransaction(payload, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Add New Transaction"
      centered
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput
            required
            label="Ticker Symbol"
            placeholder="e.g., AAPL, BTC-USD"
            disabled={isPending}
            error={errors.ticker?.message}
            {...register('ticker')}
          />
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <SegmentedControl
                fullWidth
                data={[
                  { label: 'Buy', value: 'BUY' },
                  { label: 'Sell', value: 'SELL' },
                ]}
                disabled={isPending}
                {...field}
              />
            )}
          />
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                required
                label="Quantity"
                placeholder="e.g., 10.5"
                min={0}
                decimalScale={8}
                disabled={isPending}
                error={errors.quantity?.message}
              />
            )}
          />
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                required
                label="Price per Unit (USD)"
                placeholder="e.g., 150.25"
                prefix="$"
                min={0}
                decimalScale={2}
                disabled={isPending}
                error={errors.price?.message}
              />
            )}
          />
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                {...field}
                required
                label="Transaction Date and Time"
                placeholder="Pick date and time"
                disabled={isPending}
                error={errors.date?.message}
                value={field.value ? new Date(field.value) : null}
              />
            )}
          />
          <Button type="submit" loading={isPending} mt="md">
            Save Transaction
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
