'use client';

import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string | number;
  changeType?: 'positive' | 'negative';
  peakDay?: string;
  sparklineData: number[];
}

export function MetricCard({
  title,
  value,
  change,
  changeType = 'positive',
  peakDay,
  sparklineData
}: MetricCardProps) {
  // Normalize data to 0-100 range for visual display
  const maxValue = Math.max(...sparklineData);
  const normalizedData = sparklineData.map((v) => (v / maxValue) * 100);

  return (
    <div className='bg-card border-border w-full max-w-md rounded-lg border p-6'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='text-foreground text-sm font-medium'>{title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='h-8 w-8'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Export</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content */}
      <div className='flex items-end justify-between'>
        {/* Left side - Value */}
        <div>
          <div className='text-foreground mb-2 text-4xl font-bold'>{value}</div>
          {peakDay && (
            <div className='bg-secondary text-secondary-foreground inline-block rounded px-2 py-1 text-xs font-medium'>
              Peak: {peakDay}
            </div>
          )}
        </div>

        {/* Right side - Sparkline and Change */}
        <div className='flex flex-col items-end gap-2'>
          {/* Sparkline Chart */}
          <div className='flex items-end gap-1'>
            {normalizedData.map((height, index) => (
              <div
                key={index}
                className='rounded-sm bg-green-400'
                style={{
                  width: '6px',
                  height: `${Math.max(height * 0.6, 4)}px`
                }}
              />
            ))}
          </div>

          {/* Change Text */}
          <div className='text-right'>
            <div className='text-muted-foreground mb-1 text-xs'>
              vs last period
            </div>
            <div
              className={`text-sm font-semibold ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}
            >
              {changeType === 'positive' ? '+' : '-'}
              {change}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
