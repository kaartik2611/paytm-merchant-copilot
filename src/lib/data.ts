import * as fs from 'fs';
import * as path from 'path';
import { Merchant, Transaction, Settlement } from './types';
import { calculateRevenueAnalytics, RevenueStats } from './analytics/revenue';
import { calculatePeakHours, PeakHoursStats } from './analytics/peakHours';
import { calculateCustomerAnalytics, CustomerAnalytics } from './analytics/customers';
import { calculateSettlementAnalytics, SettlementStats } from './analytics/settlements';
import { calculateRevenueForecast, ForecastPoint } from './analytics/forecast';
import { generateDailyRecap, generateMonthlyReview, DailyRecap, MonthlyReview } from './analytics/recaps';

let cachedMerchants: Merchant[] | null = null;
let cachedTransactions: Transaction[] | null = null;
let cachedSettlements: Settlement[] | null = null;

function loadJSON<T>(filename: string): T[] {
  const filePath = path.join(process.cwd(), 'data', filename);
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T[];
  } catch (error) {
    console.error(`Error loading data from ${filePath}:`, error);
    return [];
  }
}

export function getMerchants(): Merchant[] {
  if (!cachedMerchants) {
    cachedMerchants = loadJSON<Merchant>('merchants.json');
  }
  return cachedMerchants;
}

export function getTransactions(merchantId?: string): Transaction[] {
  if (!cachedTransactions) {
    cachedTransactions = loadJSON<Transaction>('transactions.json');
  }
  if (merchantId) {
    return cachedTransactions.filter(t => t.merchantId === merchantId);
  }
  return cachedTransactions;
}

export function getSettlements(merchantId?: string): Settlement[] {
  if (!cachedSettlements) {
    cachedSettlements = loadJSON<Settlement>('settlements.json');
  }
  if (merchantId) {
    return cachedSettlements.filter(s => s.merchantId === merchantId);
  }
  return cachedSettlements;
}

export function getMerchantById(merchantId: string): Merchant | undefined {
  const merchants = getMerchants();
  return merchants.find(m => m.merchantId === merchantId);
}

export interface MerchantDashboardData {
  merchant: Merchant;
  revenue: RevenueStats;
  peakHours: PeakHoursStats;
  customers: CustomerAnalytics;
  settlements: SettlementStats;
  forecast: ForecastPoint[];
  monthlyReview: MonthlyReview;
  latestDailyRecap: DailyRecap;
}

export function getMerchantDashboardData(merchantId: string): MerchantDashboardData | null {
  const merchant = getMerchantById(merchantId);
  if (!merchant) return null;

  const txns = getTransactions(merchantId);
  const setts = getSettlements(merchantId);

  // Get latest date from transaction timestamps to generate a realistic recap
  const sortedTxns = [...txns].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const latestDateStr = sortedTxns.length > 0 ? sortedTxns[0].timestamp.substring(0, 10) : '2026-06-06';

  const peakHours = calculatePeakHours(txns);
  const customers = calculateCustomerAnalytics(txns, latestDateStr);
  const settlements = calculateSettlementAnalytics(setts, txns, latestDateStr);
  
  // Calculate revenue stats (requires settlements and customer repeat rate for Health Score)
  const revenue = calculateRevenueAnalytics(txns, setts, customers.repeatCustomerRate);
  
  // Calculate 7-day revenue forecast
  const forecast = calculateRevenueForecast(revenue.dailyTrends, 7);

  const monthlyReview = generateMonthlyReview(txns, setts);
  const latestDailyRecap = generateDailyRecap(txns, latestDateStr);

  return {
    merchant,
    revenue,
    peakHours,
    customers,
    settlements,
    forecast,
    monthlyReview,
    latestDailyRecap,
  };
}
