import * as React from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { PageTableFilterData, PageTableOnEvent } from '@/types/data-table';

interface DataTablePaginationProps extends React.ComponentProps<'div'> {
  pageData: PageTableFilterData;
  pageEvent: PageTableOnEvent;
  pageSizeOptions?: number[];
}

export function DataTablePagination({
  pageData,
  pageEvent,
  pageSizeOptions = [10, 20, 30, 40, 50],
  className,
  ...props
}: DataTablePaginationProps) {
  const { page, pageSize, total } = pageData;
  const pageCount = Math.ceil(total / pageSize);
  const canPrevious = page > 1;
  const canNext = page < pageCount;

  return (
    <div
      className={cn(
        'flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8',
        className
      )}
      {...props}
    >
      <div className='text-muted-foreground flex-1 text-sm whitespace-nowrap'>
        {total} row(s) total.
      </div>

      <div className='flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
        {/* Page Size */}
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium whitespace-nowrap'>Rows per page</p>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => pageEvent.onPageSizeChange(Number(value))}
          >
            <SelectTrigger className='h-8 w-[4.5rem]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent side='top'>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page Info */}
        <div className='flex items-center justify-center text-sm font-medium'>
          Page {page} of {pageCount}
        </div>

        {/* Navigation */}
        <div className='flex items-center space-x-2'>
          <Button
            aria-label='Go to first page'
            variant='outline'
            size='icon'
            className='hidden size-8 lg:flex'
            onClick={() => pageEvent.onPageChange(1)}
            disabled={!canPrevious}
          >
            <ChevronsLeft />
          </Button>

          <Button
            aria-label='Go to previous page'
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => pageEvent.onPageChange(page - 1)}
            disabled={!canPrevious}
          >
            <ChevronLeftIcon />
          </Button>

          <Button
            aria-label='Go to next page'
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => pageEvent.onPageChange(page + 1)}
            disabled={!canNext}
          >
            <ChevronRightIcon />
          </Button>

          <Button
            aria-label='Go to last page'
            variant='outline'
            size='icon'
            className='hidden size-8 lg:flex'
            onClick={() => pageEvent.onPageChange(pageCount)}
            disabled={!canNext}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
