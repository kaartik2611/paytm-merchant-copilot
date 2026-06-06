import { Transaction, Settlement } from '../types';
import { calculateRevenueAnalytics } from './revenue';
import { calculatePeakHours } from './peakHours';
import { calculateCustomerAnalytics } from './customers';

export interface DailyRecap {
  date: string;
  revenue: number;
  transactionsCount: number;
  averageTicketSize: number;
  bestHour: number;
  bestHourRevenue: number;
  dominantPaymentMode: string;
  dominantPaymentModeCount: number;
  insights: string[];
}

export interface MonthlyReview {
  monthName: string;
  totalRevenue: number;
  growthPercentage: number;
  transactionsCount: number;
  averageTicketSize: number;
  peakHourDescription: string;
  dominantPaymentModeDescription: string;
  customerRetentionRate: number;
  insights: string[];
  recommendations: string[];
}

export function generateDailyRecap(
  transactions: Transaction[],
  targetDateStr: string
): DailyRecap {
  const merchantTxns = transactions;
  
  // Filter for target date
  const dayTxns = merchantTxns.filter(
    t => t.timestamp.substring(0, 10) === targetDateStr
  );
  const successDayTxns = dayTxns.filter(t => t.status === 'SUCCESS');

  const revenue = successDayTxns.reduce((sum, t) => sum + t.amount, 0);
  const transactionsCount = successDayTxns.length;
  const averageTicketSize = transactionsCount > 0 ? revenue / transactionsCount : 0;

  // Best Hour for the day
  const hourlyMap: { [hour: number]: number } = {};
  successDayTxns.forEach(t => {
    const hour = new Date(t.timestamp).getUTCHours();
    hourlyMap[hour] = (hourlyMap[hour] || 0) + t.amount;
  });

  let bestHour = -1;
  let bestHourRevenue = 0;
  Object.entries(hourlyMap).forEach(([hourStr, rev]) => {
    if (rev > bestHourRevenue) {
      bestHourRevenue = rev;
      bestHour = Number(hourStr);
    }
  });

  // Dominant Payment Mode for the day
  const paymentMap: { [mode: string]: number } = {};
  successDayTxns.forEach(t => {
    paymentMap[t.paymentMode] = (paymentMap[t.paymentMode] || 0) + 1;
  });

  let dominantPaymentMode = 'None';
  let dominantPaymentModeCount = 0;
  Object.entries(paymentMap).forEach(([mode, count]) => {
    if (count > dominantPaymentModeCount) {
      dominantPaymentModeCount = count;
      dominantPaymentMode = mode;
    }
  });

  // Baseline Comparison
  const historicalSuccessTxns = merchantTxns.filter(
    t => t.status === 'SUCCESS' && t.timestamp.substring(0, 10) !== targetDateStr
  );

  const historyDailyMap: { [date: string]: number } = {};
  historicalSuccessTxns.forEach(t => {
    const dStr = t.timestamp.substring(0, 10);
    historyDailyMap[dStr] = (historyDailyMap[dStr] || 0) + t.amount;
  });

  const historyDailyRevenues = Object.values(historyDailyMap);
  const averageDailyRevenue =
    historyDailyRevenues.length > 0
      ? historyDailyRevenues.reduce((a, b) => a + b, 0) / historyDailyRevenues.length
      : 0;

  const insights: string[] = [];
  if (revenue === 0) {
    insights.push("No successful transactions recorded for today.");
  } else {
    if (averageDailyRevenue > 0) {
      const diffPercent = ((revenue - averageDailyRevenue) / averageDailyRevenue) * 100;
      if (diffPercent > 10) {
        insights.push(
          `Excellent day! Revenue was ${diffPercent.toFixed(1)}% higher than your daily average of ₹${averageDailyRevenue.toFixed(0)}.`
        );
      } else if (diffPercent < -10) {
        insights.push(
          `Slow day. Revenue was ${Math.abs(diffPercent).toFixed(1)}% below your daily average of ₹${averageDailyRevenue.toFixed(0)}.`
        );
      } else {
        insights.push(`Steady performance. Revenue matched your typical daily average.`);
      }
    }

    if (bestHour !== -1) {
      const bestHourShare = revenue > 0 ? (bestHourRevenue / revenue) * 100 : 0;
      const hourLabel = bestHour === 0 ? "12 AM" : bestHour === 12 ? "12 PM" : bestHour > 12 ? `${bestHour - 12} PM` : `${bestHour} AM`;
      insights.push(
        `Your peak hour was ${hourLabel}, accounting for ${bestHourShare.toFixed(0)}% (₹${bestHourRevenue.toFixed(0)}) of today's volume.`
      );
    }

    if (dominantPaymentMode !== 'None') {
      const modeShare = transactionsCount > 0 ? (dominantPaymentModeCount / transactionsCount) * 100 : 0;
      insights.push(
        `Customers preferred using ${dominantPaymentMode} for checkout, making up ${modeShare.toFixed(0)}% of transactions.`
      );
    }

    const failedCount = dayTxns.filter(t => t.status === 'FAILED').length;
    if (failedCount > 3) {
      insights.push(
        `Warning: There were ${failedCount} failed transaction attempts today. Check your QR code display placement or terminal connectivity.`
      );
    }
  }

  return {
    date: targetDateStr,
    revenue: Number(revenue.toFixed(2)),
    transactionsCount,
    averageTicketSize: Number(averageTicketSize.toFixed(2)),
    bestHour,
    bestHourRevenue: Number(bestHourRevenue.toFixed(2)),
    dominantPaymentMode,
    dominantPaymentModeCount,
    insights,
  };
}

export function generateMonthlyReview(
  transactions: Transaction[],
  settlements: Settlement[]
): MonthlyReview {
  const cust = calculateCustomerAnalytics(transactions);
  const rev = calculateRevenueAnalytics(transactions, settlements, cust.repeatCustomerRate);
  const peak = calculatePeakHours(transactions);

  // Peak Hour desc
  const topHour = peak.peakHours[0];
  const topHourLabel = topHour === 0 ? "12 AM" : topHour === 12 ? "12 PM" : topHour > 12 ? `${topHour - 12} PM` : `${topHour} AM`;
  const peakHourDescription = `Your highest transaction volume occurs around ${topHourLabel} (${peak.peakPeriodName}).`;

  // Dominant Mode desc
  const sortedModes = [...rev.paymentModeShare].sort((a, b) => b.count - a.count);
  const primaryMode = sortedModes[0];
  const dominantPaymentModeDescription = primaryMode
    ? `"${primaryMode.mode}" is your most popular checkout route, representing ${primaryMode.count} successful payments.`
    : 'No transactions recorded.';

  const repeatRate = cust.repeatCustomerRate;

  // Insights list
  const insights: string[] = [];
  insights.push(`Total revenue reached ₹${rev.totalRevenue.toLocaleString()} with a ${rev.growthPercentage}% growth rate compared to the prior half of the month.`);
  insights.push(`An average transaction size of ₹${rev.averageOrderValue.toFixed(0)} was recorded across ${rev.successTxnCount} payments.`);
  
  if (repeatRate > 40) {
    insights.push(`Strong customer loyalty! Your repeat customer visit rate is at ${repeatRate}%.`);
  } else {
    insights.push(`Your repeat customer rate is ${repeatRate}%. Most checkouts are by one-time shoppers.`);
  }

  const failedTxnPercent = (rev.failedTxnCount / (rev.successTxnCount + rev.failedTxnCount)) * 100;
  if (failedTxnPercent > 4) {
    insights.push(`Alert: Transaction failure rate is high at ${failedTxnPercent.toFixed(1)}%. This drags down your merchant health score.`);
  }

  // Recommendations
  const recommendations: string[] = [];
  
  // 1. Peak hour recommendation
  if (topHour >= 19 && topHour <= 22) {
    recommendations.push(
      `Optimize checkout throughput: Encourage your staff to confirm payments using Paytm Soundbox alerts to speed up lines during the dinner rush.`
    );
  } else if (topHour >= 8 && topHour <= 11) {
    recommendations.push(
      `Since morning is your busiest hour, display a dedicated Paytm QR sticker at the checkout counter to divide queues.`
    );
  } else {
    recommendations.push(
      `Promote mid-day digital payment checkouts to offset cash-handling fees.`
    );
  }

  // 2. Customer retention recommendation
  if (repeatRate < 35) {
    recommendations.push(
      `Boost retention: Setup a 'Paytm Loyalty Scan' promotion in your merchant panel to reward customers on their 5th scan.`
    );
  } else {
    recommendations.push(
      `Your loyal customer base is stable. Keep checkouts smooth with high Paytm Soundbox volumes for verification.`
    );
  }

  // 3. Payment preference recommendation
  if (primaryMode && primaryMode.mode === 'UPI') {
    recommendations.push(
      `Since UPI drives your checkout flow, make sure you display the Paytm All-in-One QR Code so all banking apps can scan directly.`
    );
  }

  return {
    monthName: 'May - June 2026',
    totalRevenue: rev.totalRevenue,
    growthPercentage: rev.growthPercentage,
    transactionsCount: rev.successTxnCount,
    averageTicketSize: rev.averageOrderValue,
    peakHourDescription,
    dominantPaymentModeDescription,
    customerRetentionRate: repeatRate,
    insights,
    recommendations,
  };
}
