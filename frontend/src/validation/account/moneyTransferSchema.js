import { z } from 'zod';

const moneyTransferSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least 1').max(100000, 'Amount cannot be more than 100000'),
})

export {
  moneyTransferSchema,
};
