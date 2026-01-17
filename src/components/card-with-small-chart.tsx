'use client';
import { MetricResponse } from '@/types/response';
interface MetricProps {
  data: MetricResponse;
}

export function MetricCard({ data }: MetricProps) {
  const {
    title,
    value,
    change,
    changeType = 'up',
    peakDay,
    sparklineData
  } = data;
  // Normalize data to 0-100 range for visual display
  const maxValue = Math.max(...sparklineData);
  const normalizedData = sparklineData.map((v) => (v / maxValue) * 100);

  const peakMsg = peakDay ? 'Peak: ' + peakDay : 'There was no peak day.';

  return (
    <div className='bg-card border-border flex w-full flex-col rounded-lg border p-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-foreground text-lg font-medium'>{title}</h3>

        <span className='bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs'>
          Last 7 days
        </span>
      </div>

      <div className='flex flex-1 items-end justify-between'>
        <div>
          <div className='text-foreground mb-2 text-4xl font-bold'>{value}</div>
          <div className='bg-secondary text-secondary-foreground inline-block rounded px-2 py-1 text-xs font-medium'>
            {peakMsg}
          </div>
        </div>

        <div className='flex flex-col items-end gap-2'>
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

          <div className='text-right'>
            <div className='text-muted-foreground mb-1 text-xs'>
              vs last period
            </div>
            <div
              className={`text-sm font-semibold ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}
            >
              {changeType === 'up' ? '+' : '-'}
              {change}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
