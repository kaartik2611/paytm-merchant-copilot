import { Transaction, Settlement } from '../types';

export interface RevenueStats {
  totalRevenue: number;
  successTxnCount: number;
  failedTxnCount: number;
  pendingTxnCount: number;
  averageOrderValue: number;
  growthPercentage: number;
  dailyTrends: { date: string; revenue: number; count: number }[];
  weeklyTrends: { week: string; revenue: number; count: number }[];
  paymentModeShare: { mode: string; revenue: number; count: number }[];
  healthScore: number;
  healthLevel: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'CRITICAL';
}

export function calculateRevenueAnalytics(
  transactions: Transaction[],
  settlements: Settlement[],
  repeatCustomerRate = 40
): RevenueStats {
  const successTxns = transactions.filter(t => t.status === 'SUCCESS');
  const totalRevenue = successTxns.reduce((sum, t) => sum + t.amount, 0);
  const successTxnCount = successTxns.length;
  const failedTxnCount = transactions.filter(t => t.status === 'FAILED').length;
  const pendingTxnCount = transactions.filter(t => t.status === 'PENDING').length;
  
  const averageOrderValue = successTxnCount > 0 ? totalRevenue / successTxnCount : 0;

  // Growth calculation (compare second 15 days vs first 15 days of the 30-day range)
  const sortedTxns = [...successTxns].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  let growthPercentage = 0;
  if (sortedTxns.length > 0) {
    const minTime = new Date(sortedTxns[0].timestamp).getTime();
    const maxTime = new Date(sortedTxns[sortedTxns.length - 1].timestamp).getTime();
    const midTime = minTime + (maxTime - minTime) / 2;

    const firstHalfRevenue = sortedTxns
      .filter(t => new Date(t.timestamp).getTime() <= midTime)
      .reduce((sum, t) => sum + t.amount, 0);

    const secondHalfRevenue = sortedTxns
      .filter(t => new Date(t.timestamp).getTime() > midTime)
      .reduce((sum, t) => sum + t.amount, 0);

    if (firstHalfRevenue > 0) {
      growthPercentage = ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100;
    } else if (secondHalfRevenue > 0) {
      growthPercentage = 100;
    }
  }

  // Daily Trends
  const dailyMap: { [date: string]: { revenue: number; count: number } } = {};
  successTxns.forEach(t => {
    const dateStr = t.timestamp.substring(0, 10);
    if (!dailyMap[dateStr]) {
      dailyMap[dateStr] = { revenue: 0, count: 0 };
    }
    dailyMap[dateStr].revenue += t.amount;
    dailyMap[dateStr].count += 1;
  });

  const dailyTrends = Object.entries(dailyMap)
    .map(([date, data]) => ({
      date,
      revenue: Number(data.revenue.toFixed(2)),
      count: data.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Weekly Trends
  const weeklyMap: { [weekStart: string]: { revenue: number; count: number } } = {};
  successTxns.forEach(t => {
    const date = new Date(t.timestamp);
    const day = date.getUTCDay();
    const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    const weekStr = monday.toISOString().substring(0, 10);

    if (!weeklyMap[weekStr]) {
      weeklyMap[weekStr] = { revenue: 0, count: 0 };
    }
    weeklyMap[weekStr].revenue += t.amount;
    weeklyMap[weekStr].count += 1;
  });

  const weeklyTrends = Object.entries(weeklyMap)
    .map(([week, data]) => ({
      week,
      revenue: Number(data.revenue.toFixed(2)),
      count: data.count,
    }))
    .sort((a, b) => a.week.localeCompare(b.week));

  // Payment Mode Share
  const paymentMap: { [mode: string]: { revenue: number; count: number } } = {};
  successTxns.forEach(t => {
    if (!paymentMap[t.paymentMode]) {
      paymentMap[t.paymentMode] = { revenue: 0, count: 0 };
    }
    paymentMap[t.paymentMode].revenue += t.amount;
    paymentMap[t.paymentMode].count += 1;
  });

  const paymentModeShare = Object.entries(paymentMap).map(([mode, data]) => ({
    mode,
    revenue: Number(data.revenue.toFixed(2)),
    count: data.count,
  }));

  // MERCHANT HEALTH SCORE CALCULATION
  // Formula: 40% Txn Success Rate + 30% Settlement Success Rate + 20% Repeat Rate + 10% Growth Factor
  const totalAttempts = successTxnCount + failedTxnCount;
  const txnSuccessRate = totalAttempts > 0 ? (successTxnCount / totalAttempts) * 100 : 95;

  const totalSettlements = settlements.filter(s => s.status !== 'PENDING');
  const failedSettlements = totalSettlements.filter(s => s.status === 'FAILED').length;
  const settlementSuccessRate = totalSettlements.length > 0
    ? ((totalSettlements.length - failedSettlements) / totalSettlements.length) * 100
    : 100;

  // Growth factor mapping
  let growthFactor = 50;
  if (growthPercentage > 10) growthFactor = 100;
  else if (growthPercentage >= 0) growthFactor = 70 + (growthPercentage / 10 * 30);
  else growthFactor = Math.max(0, 70 + (growthPercentage / 100 * 70));

  const healthScore = Math.round(
    0.4 * txnSuccessRate +
    0.3 * settlementSuccessRate +
    0.2 * repeatCustomerRate +
    0.1 * growthFactor
  );

  let healthLevel: RevenueStats['healthLevel'] = 'GOOD';
  if (healthScore >= 88) healthLevel = 'EXCELLENT';
  else if (healthScore >= 70) healthLevel = 'GOOD';
  else if (healthScore >= 50) healthLevel = 'NEEDS_ATTENTION';
  else healthLevel = 'CRITICAL';

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    successTxnCount,
    failedTxnCount,
    pendingTxnCount,
    averageOrderValue: Number(averageOrderValue.toFixed(2)),
    growthPercentage: Number(growthPercentage.toFixed(2)),
    dailyTrends,
    weeklyTrends,
    paymentModeShare,
    healthScore,
    healthLevel,
  };
}
