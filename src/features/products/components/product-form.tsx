'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';

import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { FormTextarea } from '@/components/forms/form-textarea';
import { SkusForm } from '@/features/products/components/skus-form';

import {
  productFormSchema,
  type FormValues
} from '@/features/products/utils/validation-schema-product';
import Image from 'next/image';

export default function ProductForm({
  initialData,
  pageTitle
}: {
  initialData: any | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [preview, setPreview] = useState<string | null>(
    initialData?.photo_url ?? null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      categoryId: initialData?.categoryId ?? undefined,
      skus:
        initialData?.skus?.map((s: any) => ({
          color_attribute: s.color_attribute,
          size_attribute: s.size_attribute,
          price: s.price
        })) ?? []
    }
  });

  const skusFieldArray = useFieldArray({
    control: form.control,
    name: 'skus'
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/categories');
        setCategories(await res.json());
      } catch {
        toast.error('Failed to load categories');
      }
    })();
  }, []);

  function handleFileChange(file: File) {
    form.setValue('image', file, { shouldValidate: true });
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  function removeImage() {
    form.setValue('image', undefined);
    setPreview(initialData?.photo_url ?? null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function onSubmit(values: FormValues) {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description ?? '');
      formData.append('categoryId', String(values.categoryId));
      formData.append('skus', JSON.stringify(values.skus));

      if (values.image) {
        formData.append('image', values.image);
      }

      await new Promise((res) => setTimeout(res, 1000));

      toast.success('Product saved');
      router.push('/dashboard/product');
    } catch {
      toast.error('Save failed');
    }
  }
  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>{pageTitle}</CardTitle>
      </CardHeader>

      <CardContent>
        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8'
        >
          <div className='space-y-2'>
            <label className='font-medium'>Product Image</label>

            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className='hover:bg-muted mx-auto flex h-110 w-300 cursor-pointer items-center justify-center rounded-lg border border-dashed'
            >
              {preview ? (
                <Image
                  src={preview}
                  alt='place holder image'
                  className='h-full w-full rounded-lg object-contain'
                  width={500}
                  height={500}
                />
              ) : (
                <span className='text-muted-foreground'>
                  Click to upload image
                </span>
              )}
            </div>

            {form.formState.errors.image && (
              <p className='text-destructive text-sm'>
                {`${form.formState.errors.image.message}`}
              </p>
            )}

            {preview && preview !== initialData.photo_url && (
              <Button
                type='button'
                variant='destructive'
                size='sm'
                onClick={removeImage}
              >
                Remove image
              </Button>
            )}
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <FormInput
              control={form.control}
              name='name'
              label='Product Name'
              required
            />
            <FormSelect
              control={form.control}
              name='categoryId'
              label='Category'
              required
              options={categories.map((c) => ({
                label: c.name,
                value: String(c.id)
              }))}
            />
          </div>

          <FormTextarea
            control={form.control}
            name='description'
            label='Description'
          />

          <SkusForm form={form} fieldArray={skusFieldArray} />

          <Button type='submit'>Save Product</Button>
        </Form>
      </CardContent>
    </Card>
  );
}
