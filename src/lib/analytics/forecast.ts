import { Transaction } from '../types';

export interface ForecastPoint {
  date: string;
  revenue: number;
  isForecast: boolean;
}

export function calculateRevenueForecast(
  dailyTrends: { date: string; revenue: number }[],
  daysToForecast = 7
): ForecastPoint[] {
  if (dailyTrends.length === 0) return [];

  // 1. Sort historical daily trends
  const sortedTrends = [...dailyTrends].sort((a, b) => a.date.localeCompare(b.date));
  const n = sortedTrends.length;

  // 2. Compute Linear Regression (y = mx + c)
  // x = index of day (0 to n-1), y = revenue
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += sortedTrends[i].revenue;
    sumXY += i * sortedTrends[i].revenue;
    sumXX += i * i;
  }

  const denominator = (n * sumXX - sumX * sumX);
  const m = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;
  const c = n > 0 ? (sumY - m * sumX) / n : 0;

  // 3. Compute day-of-week seasonality multiplier
  // Group historical revenue by day of week
  const weekdaySum: { [day: number]: number } = {};
  const weekdayCount: { [day: number]: number } = {};
  for (let i = 0; i < 7; i++) {
    weekdaySum[i] = 0;
    weekdayCount[i] = 0;
  }

  sortedTrends.forEach(d => {
    const day = new Date(d.date).getUTCDay();
    weekdaySum[day] += d.revenue;
    weekdayCount[day] += 1;
  });

  const averageDaily = sumY / n;
  const weekdayMultiplier: { [day: number]: number } = {};
  for (let i = 0; i < 7; i++) {
    const avgForDay = weekdayCount[i] > 0 ? weekdaySum[i] / weekdayCount[i] : averageDaily;
    weekdayMultiplier[i] = averageDaily > 0 ? avgForDay / averageDaily : 1.0;
  }

  // 4. Generate forecast points starting from the day after the last historical date
  const lastDate = new Date(sortedTrends[n - 1].date);
  const forecast: ForecastPoint[] = [];

  for (let i = 1; i <= daysToForecast; i++) {
    const nextDate = new Date(lastDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = nextDate.toISOString().substring(0, 10);
    const dayOfWeek = nextDate.getUTCDay();

    // Baseline linear prediction
    const basePrediction = m * (n - 1 + i) + c;
    // Apply weekday seasonality multiplier
    let forecastedRevenue = basePrediction * (weekdayMultiplier[dayOfWeek] || 1.0);

    // Make sure we don't predict negative revenue
    forecastedRevenue = Math.max(0, forecastedRevenue);

    forecast.push({
      date: dateStr,
      revenue: Number(forecastedRevenue.toFixed(2)),
      isForecast: true,
    });
  }

  return forecast;
}
