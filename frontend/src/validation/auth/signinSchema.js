import { z } from 'zod';

const signinSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username cannot be more than 20 characters'),
  password: z.string().min(4, 'Password must be at least 4 characters').max(10, 'Password cannot be more than 10 characters'),
})

export {
  signinSchema,
};
