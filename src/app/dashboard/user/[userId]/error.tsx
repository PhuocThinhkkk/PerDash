'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IconAlertCircle } from '@tabler/icons-react';

export default function OverviewError({ error }: { error: Error }) {
  return (
    <Alert className='m-4' variant='destructive'>
      <IconAlertCircle className='h-4 w-4' />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Failed to load: {error.message}</AlertDescription>
    </Alert>
  );
}
