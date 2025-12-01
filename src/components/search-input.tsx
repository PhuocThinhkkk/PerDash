'use client';
import { useKBar } from 'kbar';
import { IconSearch } from '@tabler/icons-react';
import { Button } from './ui/button';

export default function SearchInput() {
  const { query } = useKBar();
  return (
    <div className='flex w-full space-y-2'>
      <Button
        variant='outline'
        className='bg-background text-muted-foreground relative ml-auto h-9 w-full justify-start rounded-[0.5rem] text-sm font-normal shadow-none hover:cursor-pointer sm:pr-12 md:w-80 lg:w-150'
        onClick={query.toggle}
      >
        <IconSearch className='mr-2 h-4 w-4' />
        Search...
        <kbd className='bg-muted pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-6 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      </Button>
    </div>
  );
}
