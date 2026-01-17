'use client';

import { useEffect, useState } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FormFileUpload } from '@/components/forms/form-file-upload';

type Props = {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  initialImageUrl?: string | null;
};

export function ProductImageField({
  form,
  name,
  label,
  initialImageUrl
}: Props) {
  // ✅ CORRECT way to read file value
  const files = useWatch({
    control: form.control,
    name
  }) as File[] | undefined;

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialImageUrl ?? null
  );

  const hasNewFile = !!files?.length;
  const hasOriginal = !!initialImageUrl;
  const isOriginalImage = !hasNewFile && hasOriginal;

  useEffect(() => {
    if (!files?.length) {
      setPreviewUrl(initialImageUrl ?? null);
      return;
    }

    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [files, initialImageUrl]);

  function removeImage() {
    // ✅ correct way to clear file input owned by FormFileUpload
    form.resetField(name);
    setPreviewUrl(initialImageUrl ?? null);
  }

  return (
    <div className='space-y-4'>
      {/* PREVIEW */}
      {previewUrl && (
        <div className='group relative h-48 w-full'>
          <Image
            src={previewUrl}
            alt='Product image'
            fill
            className='rounded-md border object-cover'
          />

          <div className='absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 transition group-hover:opacity-100'>
            {/* 🔥 THIS OPENS FormFileUpload’s input */}
            <label>
              <Button type='button' size='sm'>
                Change
              </Button>
              <div className='hidden'>
                <FormFileUpload
                  control={form.control}
                  name={name}
                  label={label}
                />
              </div>
            </label>

            {!isOriginalImage && (
              <Button
                type='button'
                size='sm'
                variant='destructive'
                onClick={removeImage}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      )}

      {/* INITIAL UPLOAD */}
      {!previewUrl && (
        <FormFileUpload control={form.control} name={name} label={label} />
      )}
    </div>
  );
}
