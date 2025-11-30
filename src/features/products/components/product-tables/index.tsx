'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { Column } from '@/features/products/components/product-tables/columns'; // your new column type
import { PageTableFilterData, PageTableOnEvent } from '@/types/data-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useSearchParams, useRouter } from 'next/navigation';

interface ProductTableParams<TData> {
  data: TData[];
  totalItems: number;
  pageData: PageTableFilterData;
  columns: Column<TData>[];
}

export function ProductTable<TData>({
  data,
  totalItems,
  pageData,
  columns
}: ProductTableParams<TData>) {
  const [pageSize] = useQueryState('pageSize', parseAsInteger.withDefault(10));
  const router = useRouter();
  const params = useSearchParams();

  function onPageChange(newPage: number) {
    const p = new URLSearchParams(params.toString());
    p.set('page', String(newPage));
    router.push(`?${p.toString()}`);
  }

  function onPageSizeChange(size: number) {
    const p = new URLSearchParams(params.toString());
    p.set('page', '1');
    p.set('pageSize', String(size));
    router.push(`?${p.toString()}`, { scroll: false });
  }
  const pageEvent: PageTableOnEvent = {
    onPageChange,
    onPageSizeChange
  };
  const pageCount = Math.ceil(totalItems / pageSize);

  return (
    <DataTable<TData>
      pageData={pageData}
      data={data}
      pageEvent={pageEvent}
      columns={columns}
    >
      <DataTableToolbar columns={columns} />
    </DataTable>
  );
}
