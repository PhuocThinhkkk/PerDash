'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cross2Icon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Column } from '@/features/products/components/product-tables/columns';

interface DataTableToolbarProps<T> extends React.ComponentProps<'div'> {
  columns: Column<T>[];
  children?: React.ReactNode;
}

export function DataTableToolbar<T>({
  columns,
  children,
  className,
  ...props
}: DataTableToolbarProps<T>) {
  const filteredColumns = columns.filter((col) => col.filter);

  return (
    <div
      role='toolbar'
      aria-orientation='horizontal'
      className={cn(
        'flex w-full items-start justify-between gap-2 p-1',
        className
      )}
      {...props}
    >
      <div className='flex flex-1 flex-wrap items-center gap-2'>
        {filteredColumns.map((col) => (
          <Input
            key={String(col.key)}
            placeholder={
              col.filter?.placeholder ?? col.filter?.label ?? String(col.key)
            }
            className='h-8 w-40 lg:w-56'
          />
        ))}

        <Button
          aria-label='Reset filters'
          variant='outline'
          size='sm'
          className='border-dashed'
        >
          <Cross2Icon />
          Reset
        </Button>
      </div>

      <div className='flex items-center gap-2'>{children}</div>
    </div>
  );
}
