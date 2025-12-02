import db from '@/lib/db';
import { MetricResponse } from '@/types/response';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export async function getOrdersOverview() {
  const now = new Date();

  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);

  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const [totals, thisMonth, lastMonth] = await Promise.all([
    db.orderDetails.groupBy({
      by: ['status'],
      _count: true
    }),

    db.orderDetails.count({
      where: {
        status: 'COMPLETED',
        created_at: { gte: thisMonthStart, lte: thisMonthEnd }
      }
    }),

    db.orderDetails.count({
      where: {
        status: 'COMPLETED',
        created_at: { gte: lastMonthStart, lte: lastMonthEnd }
      }
    })
  ]);

  const parseStatus = (status: string) =>
    totals.find((t) => t.status === status)?._count || 0;

  const percentChange =
    lastMonth === 0 ? 100 : ((thisMonth - lastMonth) / lastMonth) * 100;

  return {
    totalOrders: totals.reduce((acc, x) => acc + x._count, 0),
    completed: parseStatus('COMPLETED'),
    cancelled: parseStatus('CANCELLED'),
    pending: parseStatus('PENDING'),
    thisMonthCompleted: thisMonth,
    lastMonthCompleted: lastMonth,
    percentChange,
    trend: percentChange >= 0 ? 'up' : 'down'
  };
}

import { subDays, format } from 'date-fns';
export async function getOrderMetrics(): Promise<MetricResponse> {
  const today = new Date();
  const lastPeriodStart = subDays(today, 30);
  const prevPeriodStart = subDays(today, 60);

  // Current revenue
  const currentRevenue = await db.orderDetails.aggregate({
    _sum: { total_amount: true },
    where: { created_at: { gte: lastPeriodStart } }
  });

  // Previous revenue
  const previousRevenue = await db.orderDetails.aggregate({
    _sum: { total_amount: true },
    where: {
      created_at: {
        gte: prevPeriodStart,
        lt: lastPeriodStart
      }
    }
  });

  const current = currentRevenue._sum.total_amount ?? 0;
  const previous = previousRevenue._sum.total_amount ?? 0;

  const change = previous === 0 ? 100 : ((current - previous) / previous) * 100;

  const changeType = change >= 0 ? 'up' : 'down';

  // Sparkline revenue last 7 days
  const dailyRevenue = await Promise.all(
    Array.from({ length: 7 }).map(async (_, i) => {
      const start = subDays(today, 6 - i);
      const end = subDays(today, 5 - i);

      const result = await db.orderDetails.aggregate({
        _sum: { total_amount: true },
        where: {
          created_at: { gte: start, lt: end }
        }
      });

      return result._sum.total_amount ?? 0;
    })
  );

  // Peak day
  const peakValue = Math.max(...dailyRevenue);
  const peakIndex = dailyRevenue.indexOf(peakValue);
  const peakDay = format(subDays(today, 6 - peakIndex), 'MMM dd');

  return {
    title: 'Revenue',
    value: `$${current.toLocaleString()}`,
    change: `${Math.abs(change).toFixed(1)}%`,
    changeType,
    peakDay,
    sparklineData: dailyRevenue
  };
}

export async function getOrderCountMetrics(): Promise<MetricResponse> {
  const today = new Date();
  const lastPeriodStart = subDays(today, 30);
  const prevPeriodStart = subDays(today, 60);

  const currentOrders = await db.orderDetails.count({
    where: { created_at: { gte: lastPeriodStart } }
  });

  const previousOrders = await db.orderDetails.count({
    where: {
      created_at: {
        gte: prevPeriodStart,
        lt: lastPeriodStart
      }
    }
  });

  const change =
    previousOrders === 0
      ? 100
      : ((currentOrders - previousOrders) / previousOrders) * 100;

  const changeType = change >= 0 ? 'up' : 'down';

  const dailyOrders = await Promise.all(
    Array.from({ length: 7 }).map(async (_, i) => {
      const start = subDays(today, 6 - i);
      const end = subDays(today, 5 - i);

      return db.orderDetails.count({
        where: {
          created_at: { gte: start, lt: end }
        }
      });
    })
  );

  const peakValue = Math.max(...dailyOrders);
  const peakIndex = dailyOrders.indexOf(peakValue);
  const peakDay = format(subDays(today, 6 - peakIndex), 'MMM dd');

  return {
    title: 'Orders',
    value: currentOrders,
    change: `${Math.abs(change).toFixed(1)}%`,
    changeType,
    peakDay,
    sparklineData: dailyOrders
  };
}
