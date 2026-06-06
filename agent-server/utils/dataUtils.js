function groupByDate(transactions) {
  const map = {};
  for (const t of transactions) {
    if (!map[t.date]) map[t.date] = { date: t.date, revenue: 0, orders: 0 };
    map[t.date].revenue += t.amount;
    map[t.date].orders += 1;
  }
  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
}

function topProducts(transactions, n = 5) {
  const map = {};
  for (const t of transactions) {
    if (!map[t.product_name]) map[t.product_name] = { name: t.product_name, revenue: 0, units: 0 };
    map[t.product_name].revenue += t.amount;
    map[t.product_name].units += t.quantity;
  }
  return Object.values(map)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, n);
}

function peakHours(transactions) {
  const counts = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: 0 }));
  for (const t of transactions) {
    counts[t.hour].count += 1;
  }
  return counts;
}

function customerSegments(transactions) {
  const customers = {};
  for (const t of transactions) {
    if (!customers[t.customer_id]) {
      customers[t.customer_id] = { visits: 0, totalSpend: 0, isNew: t.is_new_customer };
    }
    customers[t.customer_id].visits += 1;
    customers[t.customer_id].totalSpend += t.amount;
  }

  let newCount = 0, returning = 0, highValue = 0, occasional = 0;
  for (const c of Object.values(customers)) {
    if (c.isNew) newCount++;
    else returning++;
    if (c.totalSpend > 500) highValue++;
    if (c.visits <= 2) occasional++;
  }

  return { new: newCount, returning, highValue, occasional };
}

function filterTransactions(transactions, filters = {}) {
  return transactions.filter((t) => {
    if (filters.date && t.date !== filters.date) return false;
    if (filters.month && t.month !== filters.month) return false;
    if (filters.startDate && t.date < filters.startDate) return false;
    if (filters.endDate && t.date > filters.endDate) return false;
    if (filters.productId && t.product_id !== filters.productId) return false;
    if (filters.customerId && t.customer_id !== filters.customerId) return false;
    return true;
  });
}

function getInventoryStatus(inventory) {
  return inventory.map((item) => ({
    ...item,
    low: item.stock < item.reorder_level,
  }));
}

function buildSnapshot(transactions, inventory) {
  const juneTransactions = transactions.filter((t) => t.month === "2024-06");
  const totalRevenue = juneTransactions.reduce((s, t) => s + t.amount, 0);
  const top = topProducts(juneTransactions, 1);
  const hours = peakHours(juneTransactions);
  const peakHour = hours.reduce((a, b) => (b.count > a.count ? b : a));
  const segments = customerSegments(juneTransactions);
  const lowStock = inventory.filter((i) => i.stock < i.reorder_level);

  const byDate = groupByDate(juneTransactions);
  const bestDay = byDate.reduce((a, b) => (b.revenue > a.revenue ? b : a), byDate[0]);

  return {
    totalRevenue,
    topProduct: top[0]?.name || "N/A",
    peakHour: peakHour.hour,
    newCustomers: segments.new,
    returningCustomers: segments.returning,
    lowStockItems: lowStock.map((i) => i.product_name).join(", ") || "None",
    bestDay: bestDay?.date || "N/A",
  };
}

module.exports = {
  groupByDate,
  topProducts,
  peakHours,
  customerSegments,
  filterTransactions,
  getInventoryStatus,
  buildSnapshot,
};
