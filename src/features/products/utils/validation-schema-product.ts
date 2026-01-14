import z from 'zod';

export const skuSchema = z.object({
  color_attribute: z.string().min(1, 'Color is required'),
  size_attribute: z.string().min(1, 'Size is required'),
  price: z.number().min(0)
});

export const productFormSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  categoryId: z.number(),
  image: z.any().optional(),
  skus: z.array(skuSchema).min(1, 'At least one SKU is required')
});

export type FormValues = z.infer<typeof productFormSchema>;
