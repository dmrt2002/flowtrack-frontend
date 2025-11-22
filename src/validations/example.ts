import { z } from 'zod';

export const exampleFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  category: z.enum(['feedback', 'support', 'sales'], {
    errorMap: () => ({ message: 'Please select a category' }),
  }),
  subscribe: z.boolean().default(false),
});

export type ExampleFormData = z.infer<typeof exampleFormSchema>;
