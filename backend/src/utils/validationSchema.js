import { z } from 'zod';

const signupSchema = z.object({
  username: z.string().min(3).max(20),
  firstName: z.string().min(3).max(30),
  lastName: z.string().min(3).max(30),
  password: z.string().min(4).max(10),
});

const signInSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(4).max(10),
})
const updateUserSchema = z.object({
  firstName: z.string().min(3).max(30),
  lastName: z.string().min(3).max(30),
  password: z.string().min(4).max(10),
})
export {
  signupSchema,
  signInSchema,
  updateUserSchema
};
