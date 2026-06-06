import * as fs from 'fs';
import * as path from 'path';
import { Transaction, Settlement, Merchant } from '@/lib/types';

// ── Data loading ──────────────────────────────────────────────────────────────

let _transactions: Transaction[] | null = null;
let _settlements: Settlement[] | null = null;
let _merchants: Merchant[] | null = null;

function loadJSON<T>(filename: string): T[] {
  const filePath = path.join(process.cwd(), 'data', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T[];
}

function getTransactions(merchantId?: string | null): Transaction[] {
  if (!_transactions) _transactions = loadJSON<Transaction>('transactions.json');
  return merchantId ? _transactions.filter(t => t.merchantId === merchantId) : _transactions;
}

function getSettlements(merchantId?: string | null): Settlement[] {
  if (!_settlements) _settlements = loadJSON<Settlement>('settlements.json');
  return merchantId ? _settlements.filter(s => s.merchantId === merchantId) : _settlements;
}

function getMerchantById(merchantId: string): Merchant | null {
  if (!_merchants) _merchants = loadJSON<Merchant>('merchants.json');
  return _merchants.find(m => m.merchantId === merchantId) ?? null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDate(ts: string) { return ts.substring(0, 10); }
function toMonth(ts: string) { return ts.substring(0, 7); }

// Convert UTC timestamp to IST hour (UTC+5:30)
function toHour(ts: string): number {
  const d = new Date(ts);
  return Math.floor(((d.getUTCHours() * 60 + d.getUTCMinutes() + 330) % 1440) / 60);
}

function successTxns(txns: Transaction[]): Transaction[] {
  return txns.filter(t => t.status === 'SUCCESS');
}

// ── Tool functions ────────────────────────────────────────────────────────────

export interface DateFilters {
  startDate?: string;
  endDate?: string;
  month?: string;
}

export function getRevenueTrend(merchantId: string | null, filters: DateFilters = {}) {
  let txns = successTxns(getTransactions(merchantId));
  if (filters.month) txns = txns.filter(t => toMonth(t.timestamp) === filters.month);
  if (filters.startDate) txns = txns.filter(t => toDate(t.timestamp) >= filters.startDate!);
  if (filters.endDate) txns = txns.filter(t => toDate(t.timestamp) <= filters.endDate!);

  const map: Record<string, { date: string; revenue: number; orders: number }> = {};
  for (const t of txns) {
    const d = toDate(t.timestamp);
    if (!map[d]) map[d] = { date: d, revenue: 0, orders: 0 };
    map[d].revenue += t.amount;
    map[d].orders += 1;
  }
  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
}

export function getPeakHours(merchantId: string | null, filters: { month?: string } = {}) {
  let txns = successTxns(getTransactions(merchantId));
  if (filters.month) txns = txns.filter(t => toMonth(t.timestamp) === filters.month);

  const hours = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: 0, revenue: 0 }));
  for (const t of txns) {
    const h = toHour(t.timestamp);
    hours[h].count += 1;
    hours[h].revenue += t.amount;
  }
  return hours;
}

export function getCustomerSegments(merchantId: string | null, filters: { month?: string } = {}) {
  let txns = successTxns(getTransactions(merchantId));
  if (filters.month) txns = txns.filter(t => toMonth(t.timestamp) === filters.month);

  const customers: Record<string, { visits: number; totalSpend: number }> = {};
  for (const t of txns) {
    if (!customers[t.customerId]) customers[t.customerId] = { visits: 0, totalSpend: 0 };
    customers[t.customerId].visits += 1;
    customers[t.customerId].totalSpend += t.amount;
  }
  const vals = Object.values(customers);
  const avgSpend = vals.length ? vals.reduce((s, c) => s + c.totalSpend, 0) / vals.length : 0;

  return {
    uniqueCustomers: vals.length,
    newCustomers: vals.filter(c => c.visits === 1).length,
    returning: vals.filter(c => c.visits >= 2 && c.visits <= 4).length,
    frequent: vals.filter(c => c.visits >= 5).length,
    highValue: vals.filter(c => c.totalSpend > avgSpend * 1.5).length,
  };
}

export function getPaymentBreakdown(merchantId: string | null, filters: { month?: string } = {}) {
  let txns = successTxns(getTransactions(merchantId));
  if (filters.month) txns = txns.filter(t => toMonth(t.timestamp) === filters.month);

  const map: Record<string, { mode: string; count: number; revenue: number }> = {};
  for (const t of txns) {
    if (!map[t.paymentMode]) map[t.paymentMode] = { mode: t.paymentMode, count: 0, revenue: 0 };
    map[t.paymentMode].count += 1;
    map[t.paymentMode].revenue += t.amount;
  }
  return Object.values(map).sort((a, b) => b.revenue - a.revenue);
}

export function getSettlementSummary(merchantId: string | null) {
  const setts = getSettlements(merchantId);
  const summary: Record<string, number> = { SETTLED: 0, PENDING: 0, DELAYED: 0, FAILED: 0 };
  const counts: Record<string, number> = { SETTLED: 0, PENDING: 0, DELAYED: 0, FAILED: 0 };
  for (const s of setts) {
    if (s.status in summary) {
      summary[s.status] += s.amount;
      counts[s.status] += 1;
    }
  }
  return {
    settled: { amount: summary.SETTLED, count: counts.SETTLED },
    pending: { amount: summary.PENDING, count: counts.PENDING },
    delayed: { amount: summary.DELAYED, count: counts.DELAYED },
    failed: { amount: summary.FAILED, count: counts.FAILED },
    total: Object.values(summary).reduce((a, b) => a + b, 0),
  };
}

export function getRecap(merchantId: string | null, period: 'daily' | 'monthly' = 'daily') {
  const allTxns = successTxns(getTransactions(merchantId));
  const latestTs = allTxns.reduce((max, t) => (t.timestamp > max ? t.timestamp : max), '');
  const latestDate = latestTs.substring(0, 10);
  const latestMonth = latestDate.substring(0, 7);

  const txns = period === 'daily'
    ? allTxns.filter(t => toDate(t.timestamp) === latestDate)
    : allTxns.filter(t => toMonth(t.timestamp) === latestMonth);

  const totalRevenue = txns.reduce((s, t) => s + t.amount, 0);
  const totalOrders = txns.length;
  const uniqueCustomers = new Set(txns.map(t => t.customerId)).size;

  const result: Record<string, unknown> = { period, date: latestDate, totalRevenue, totalOrders, uniqueCustomers };

  if (period === 'monthly') {
    const byDate = getRevenueTrend(merchantId, { month: latestMonth });
    const bestDay = byDate.reduce((a, b) => (b.revenue > a.revenue ? b : a), byDate[0]);
    result.bestDay = bestDay?.date ?? 'N/A';
    result.month = latestMonth;
  }

  const merchant = getMerchantById(merchantId ?? '');
  if (merchant) result.merchantName = merchant.name;

  return result;
}
