const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');

// Load and cache JSON files
const _cache = {};
function load(filename) {
  if (!_cache[filename]) {
    _cache[filename] = require(path.join(DATA_DIR, filename));
  }
  return _cache[filename];
}

function getTransactions(merchantId) {
  const all = load('transactions.json');
  return merchantId ? all.filter(t => t.merchantId === merchantId) : all;
}

function getSettlements(merchantId) {
  const all = load('settlements.json');
  return merchantId ? all.filter(s => s.merchantId === merchantId) : all;
}

function getMerchantById(merchantId) {
  return load('merchants.json').find(m => m.merchantId === merchantId) || null;
}

// Extract YYYY-MM-DD from ISO timestamp
function toDate(ts) {
  return ts.substring(0, 10);
}

// Extract month YYYY-MM from ISO timestamp
function toMonth(ts) {
  return ts.substring(0, 7);
}

// Extract local hour (IST = UTC+5:30) from ISO timestamp
function toHour(ts) {
  const d = new Date(ts);
  return ((d.getUTCHours() * 60 + d.getUTCMinutes() + 330) % 1440) / 60 | 0;
}

// Only count SUCCESS transactions for revenue analytics
function successTxns(txns) {
  return txns.filter(t => t.status === 'SUCCESS');
}

// ── Tool helpers ──────────────────────────────────────────────────────────────

function getRevenueTrend(merchantId, { startDate, endDate, month } = {}) {
  let txns = successTxns(getTransactions(merchantId));

  if (month) txns = txns.filter(t => toMonth(t.timestamp) === month);
  if (startDate) txns = txns.filter(t => toDate(t.timestamp) >= startDate);
  if (endDate) txns = txns.filter(t => toDate(t.timestamp) <= endDate);

  const map = {};
  for (const t of txns) {
    const d = toDate(t.timestamp);
    if (!map[d]) map[d] = { date: d, revenue: 0, orders: 0 };
    map[d].revenue += t.amount;
    map[d].orders += 1;
  }
  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
}

function getPeakHours(merchantId, { month } = {}) {
  let txns = successTxns(getTransactions(merchantId));
  if (month) txns = txns.filter(t => toMonth(t.timestamp) === month);

  const hours = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: 0, revenue: 0 }));
  for (const t of txns) {
    const h = toHour(t.timestamp);
    hours[h].count += 1;
    hours[h].revenue += t.amount;
  }
  return hours;
}

function getCustomerSegments(merchantId, { month } = {}) {
  let txns = successTxns(getTransactions(merchantId));
  if (month) txns = txns.filter(t => toMonth(t.timestamp) === month);

  const customers = {};
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

function getPaymentBreakdown(merchantId, { month } = {}) {
  let txns = successTxns(getTransactions(merchantId));
  if (month) txns = txns.filter(t => toMonth(t.timestamp) === month);

  const map = {};
  for (const t of txns) {
    if (!map[t.paymentMode]) map[t.paymentMode] = { mode: t.paymentMode, count: 0, revenue: 0 };
    map[t.paymentMode].count += 1;
    map[t.paymentMode].revenue += t.amount;
  }
  return Object.values(map).sort((a, b) => b.revenue - a.revenue);
}

function getSettlementSummary(merchantId) {
  const setts = getSettlements(merchantId);

  const summary = { SETTLED: 0, PENDING: 0, DELAYED: 0, FAILED: 0 };
  const counts = { SETTLED: 0, PENDING: 0, DELAYED: 0, FAILED: 0 };
  for (const s of setts) {
    if (summary[s.status] !== undefined) {
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

function getRecap(merchantId, period = 'daily') {
  const allTxns = successTxns(getTransactions(merchantId));
  const latestDate = allTxns.reduce((max, t) => (t.timestamp > max ? t.timestamp : max), '').substring(0, 10);
  const latestMonth = latestDate.substring(0, 7);

  const txns = period === 'daily'
    ? allTxns.filter(t => toDate(t.timestamp) === latestDate)
    : allTxns.filter(t => toMonth(t.timestamp) === latestMonth);

  const totalRevenue = txns.reduce((s, t) => s + t.amount, 0);
  const totalOrders = txns.length;
  const uniqueCustomers = new Set(txns.map(t => t.customerId)).size;
  const newCustomers = txns.filter(t => {
    // A customer is "new" on this date if their first-ever txn is on this date
    const firstTxn = allTxns.filter(x => x.customerId === t.customerId)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp))[0];
    return firstTxn && toDate(firstTxn.timestamp) === latestDate;
  }).length;

  const result = { period, date: latestDate, totalRevenue, totalOrders, uniqueCustomers };

  if (period === 'monthly') {
    const byDate = getRevenueTrend(merchantId, { month: latestMonth });
    const bestDay = byDate.reduce((a, b) => (b.revenue > a.revenue ? b : a), byDate[0]);
    result.bestDay = bestDay?.date || 'N/A';
    result.month = latestMonth;
  }

  const merchant = getMerchantById(merchantId);
  if (merchant) result.merchantName = merchant.name;

  return result;
}

module.exports = {
  getRevenueTrend,
  getPeakHours,
  getCustomerSegments,
  getPaymentBreakdown,
  getSettlementSummary,
  getRecap,
  getMerchantById,
  getTransactions,
  successTxns,
};
