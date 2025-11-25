import db from '@/lib/db';
import { RevenueDailyData } from '@/types/revenue';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export async function getRevenueOverview() {
  const now = new Date();

  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);

  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const [totalRevenue, thisMonthRevenue, lastMonthRevenue] = await Promise.all([
    // total revenue
    db.paymentDetails.aggregate({
      _sum: { amount: true }
    }),

    // revenue for this month
    db.paymentDetails.aggregate({
      where: { created_at: { gte: thisMonthStart, lte: thisMonthEnd } },
      _sum: { amount: true }
    }),

    // revenue for last month
    db.paymentDetails.aggregate({
      where: { created_at: { gte: lastMonthStart, lte: lastMonthEnd } },
      _sum: { amount: true }
    })
  ]);

  const thisMonth = thisMonthRevenue._sum.amount || 0;
  const lastMonth = lastMonthRevenue._sum.amount || 0;

  const percentChange =
    lastMonth === 0 ? 100 : ((thisMonth - lastMonth) / lastMonth) * 100;

  return {
    totalRevenue: totalRevenue._sum.amount || 0,
    thisMonthRevenue: thisMonth,
    lastMonthRevenue: lastMonth,
    percentChange,
    trend: percentChange >= 0 ? 'up' : 'down'
  };
}

import { startOfDay, subDays, addDays, format } from 'date-fns';

export async function getDailyRevenue(days = 90): Promise<RevenueDailyData[]> {
  const startDate = startOfDay(subDays(new Date(), days));
  const endDate = startOfDay(new Date());

  // Raw SQL query for payments
  const result = await db.$queryRaw<{ date: Date; money: number }[]>`
    SELECT
      date_trunc('day', "created_at") AS date,
      SUM(amount) AS money
    FROM "PaymentDetails"
    WHERE "created_at" >= ${startDate}
    GROUP BY date
    ORDER BY date ASC
  `;

  const moneyMap = new Map(
    result.map((r) => [r.date.toISOString().split('T')[0], Number(r.money)])
  );

  const dailyRevenue: RevenueDailyData[] = [];
  for (let i = 0; i <= days; i++) {
    let randomData = Math.floor(Math.random() * 5000); // Remove this line in production
    const date = format(addDays(startDate, i), 'yyyy-MM-dd');
    dailyRevenue.push({
      date,
      money: moneyMap.get(date) ?? randomData // Use randomData for mock data; replace with 0 in production,
    });
  }

  return dailyRevenue;
}
