import { z } from 'zod';
export const quoteSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(100),
  phone: z.string().trim().min(7, 'Please enter a valid phone number.').max(30).regex(/^[+\d\s().-]+$/, 'Please enter a valid phone number.'),
  email: z.union([z.string().trim().email().max(255), z.literal('')]),
  service: z.enum(['Home repairs', 'Property maintenance', 'Home improvements', 'Something else']),
  message: z.string().trim().max(2000),
  website: z.string().max(0),
});