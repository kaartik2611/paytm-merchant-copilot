import { Transaction } from '../types';

export interface HourlyStat {
  hour: number;
  revenue: number;
  count: number;
}

export interface PeakHoursStats {
  hourlyStats: HourlyStat[];
  peakHours: number[]; // Hours sorted descending by transaction volume
  peakPeriodName: string; // e.g. "Dinner Rush", "Morning Peak", "Midday Steady"
}

export function calculatePeakHours(transactions: Transaction[]): PeakHoursStats {
  const successTxns = transactions.filter(t => t.status === 'SUCCESS');
  
  // Initialize hourly stats for all 24 hours
  const hourlyMap: { [hour: number]: { revenue: number; count: number } } = {};
  for (let i = 0; i < 24; i++) {
    hourlyMap[i] = { revenue: 0, count: 0 };
  }

  successTxns.forEach(t => {
    // timestamp is ISO e.g. "2026-05-15T19:30:00Z"
    const date = new Date(t.timestamp);
    const hour = date.getUTCHours();
    if (hourlyMap[hour] !== undefined) {
      hourlyMap[hour].revenue += t.amount;
      hourlyMap[hour].count += 1;
    }
  });

  const hourlyStats: HourlyStat[] = Object.entries(hourlyMap).map(([hourStr, data]) => ({
    hour: Number(hourStr),
    revenue: Number(data.revenue.toFixed(2)),
    count: data.count,
  }));

  // Find peak hours sorted by transaction count (with revenue as tie breaker)
  const peakHours = [...hourlyStats]
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return b.revenue - a.revenue;
    })
    .map(stat => stat.hour);

  // Determine a peak period name for display and summaries
  let peakPeriodName = 'Steady Hours';
  if (peakHours.length > 0) {
    const primaryPeak = peakHours[0];
    if (primaryPeak >= 19 && primaryPeak <= 22) {
      peakPeriodName = 'Dinner Rush';
    } else if (primaryPeak >= 12 && primaryPeak <= 14) {
      peakPeriodName = 'Lunch Rush';
    } else if (primaryPeak >= 8 && primaryPeak <= 11) {
      peakPeriodName = 'Morning Peak';
    } else if (primaryPeak >= 15 && primaryPeak <= 18) {
      peakPeriodName = 'Afternoon Steady';
    } else if (primaryPeak >= 22 || primaryPeak <= 5) {
      peakPeriodName = 'Late Night Spike';
    }
  }

  return {
    hourlyStats,
    peakHours,
    peakPeriodName,
  };
}
