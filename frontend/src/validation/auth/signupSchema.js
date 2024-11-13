import { z } from 'zod';

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username cannot be more than 20 characters'),
  firstName: z.string().min(3, 'First name must be at least 3 characters').max(30, 'First name cannot be more than 30 characters'),
  lastName: z.string().min(3, 'Last name must be at least 3 characters').max(30, 'Last name cannot be more than 30 characters'),
  password: z.string().min(4, 'Password must be at least 4 characters').max(10, 'Password cannot be more than 10 characters'),
});


export {
  signupSchema,
};
