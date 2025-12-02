import db from '@/lib/db';
import { MetricResponse } from '@/types/response';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export async function getUserOverview() {
  const now = new Date();

  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);

  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const [total, thisMonth, lastMonth, withOrders] = await Promise.all([
    db.user.count(),

    db.user.count({
      where: { created_at: { gte: thisMonthStart, lte: thisMonthEnd } }
    }),

    db.user.count({
      where: { created_at: { gte: lastMonthStart, lte: lastMonthEnd } }
    }),

    db.user.count({
      where: { orders: { some: {} } }
    })
  ]);

  const percentChange =
    lastMonth === 0 ? 100 : ((thisMonth - lastMonth) / lastMonth) * 100;

  return {
    totalUsers: total,
    newUsersThisMonth: thisMonth,
    newUsersLastMonth: lastMonth,
    usersWithOrders: withOrders,
    percentChange,
    trend: percentChange >= 0 ? 'up' : 'down'
  };
}

import { subDays, startOfDay } from 'date-fns';

export async function getDailyNewUsers(days = 90) {
  const startDate = startOfDay(subDays(new Date(), days));

  const result = await db.$queryRaw<{ date: Date; count: bigint }[]>`
    SELECT
      date_trunc('day', "create_at") AS date,
      COUNT(*) AS count
    FROM "User"
    WHERE "create_at" >= ${startDate}
    GROUP BY date
    ORDER BY date ASC
  `;

  return result.map((row) => ({
    date: row.date.toISOString().split('T')[0],
    count: Number(row.count)
  }));
}

import { format } from 'date-fns';

export async function getUserMetrics(): Promise<MetricResponse> {
  const today = new Date();
  const lastPeriodStart = subDays(today, 30);
  const prevPeriodStart = subDays(today, 60);

  // Total users
  const totalUsers = await db.user.count();

  // Users last 30 days
  const currentUsers = await db.user.count({
    where: { created_at: { gte: lastPeriodStart } }
  });

  // Users previous 30 days
  const previousUsers = await db.user.count({
    where: {
      created_at: {
        gte: prevPeriodStart,
        lt: lastPeriodStart
      }
    }
  });

  // % Change
  const change =
    previousUsers === 0
      ? 100
      : ((currentUsers - previousUsers) / previousUsers) * 100;

  const changeType = change >= 0 ? 'up' : 'down';

  // Sparkline (daily users for last 7 days)
  const dailyUsers = await Promise.all(
    Array.from({ length: 7 }).map(async (_, i) => {
      const start = subDays(today, 6 - i);
      const end = subDays(today, 5 - i);

      return db.user.count({
        where: {
          created_at: {
            gte: start,
            lt: end
          }
        }
      });
    })
  );

  // Peak day
  const peakValue = Math.max(...dailyUsers);
  const peakIndex = dailyUsers.indexOf(peakValue);
  const peakDay = format(subDays(today, 6 - peakIndex), 'MMM dd');

  return {
    title: 'Users',
    value: totalUsers,
    change: `${Math.abs(change).toFixed(1)}%`,
    changeType,
    peakDay,
    sparklineData: dailyUsers
  };
}

export async function getUserRecentPayment(limit: number = 5) {
  const payments = await db.paymentDetails.findMany({
    take: limit,
    orderBy: { created_at: 'desc' },
    include: {
      user: true
    }
  });

  return payments.map((payment) => ({
    name: payment.user.name ?? 'Unknown',
    email: payment.user.email,
    avatar: payment.user.avatar_url ?? undefined,
    fallback: payment.user.name
      ? payment.user.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      : 'U',
    amount: `+$${payment.amount.toFixed(2)}`
  }));
}
