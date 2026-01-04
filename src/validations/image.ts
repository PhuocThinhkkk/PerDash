import { z } from 'zod';

export const imageMetaSchema = z.object({
  type: z.string().startsWith('image/'),
  size: z
    .number()
    .int()
    .min(1)
    .max(5 * 1024 * 1024) // 5MB
});
