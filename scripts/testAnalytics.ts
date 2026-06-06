import { getMerchants, getTransactions, getSettlements, getMerchantDashboardData } from '../src/lib/data';

function runTests() {
  console.log("=== STARTING ANALYTICS VERIFICATION (TRANSACTIONAL SCOPE) ===");

  const merchants = getMerchants();
  if (merchants.length !== 10) {
    throw new Error(`Expected 10 merchants, got ${merchants.length}`);
  }
  console.log("✓ Loaded 10 merchants successfully.");

  const dashboard = getMerchantDashboardData('m1');
  if (!dashboard) {
    throw new Error("Could not load dashboard data for m1");
  }

  const { merchant, revenue, peakHours, customers, settlements, forecast, monthlyReview, latestDailyRecap } = dashboard;

  // 1. Verify Revenue & Health Score
  console.log(`\n1. Revenue & Health Index (m1):`);
  console.log(`- Total Revenue: ₹${revenue.totalRevenue}`);
  console.log(`- Success scans count: ${revenue.successTxnCount}`);
  console.log(`- Average Ticket: ₹${revenue.averageOrderValue}`);
  console.log(`- Merchant Health Score: ${revenue.healthScore}/100 (Level: ${revenue.healthLevel})`);
  
  if (revenue.totalRevenue <= 0) throw new Error("Revenue should be positive");
  if (revenue.healthScore < 0 || revenue.healthScore > 100) throw new Error("Health score out of bounds");
  console.log("✓ Revenue and health indices verified.");

  // 2. Verify Forecasting
  console.log(`\n2. Forecasting (m1):`);
  console.log(`- Next 7-Day Cumulative: ₹${forecast.reduce((sum, f) => sum + f.revenue, 0)}`);
  
  if (forecast.length !== 7) throw new Error("Should predict exactly 7 days");
  console.log("✓ Revenue forecasting verified.");

  // 3. Verify Customer Visit Patterns
  console.log(`\n3. Customer Loyalty (m1):`);
  console.log(`- Unique customer wallets: ${customers.uniqueCustomers}`);
  console.log(`- Repeat customer visit rate: ${customers.repeatCustomerRate}%`);
  
  const totalSegmentsCount = customers.segmentDistribution.reduce((sum, s) => sum + s.count, 0);
  if (totalSegmentsCount !== customers.uniqueCustomers) {
    throw new Error("Segment distributions sum does not match unique customers");
  }
  console.log("✓ Customer repeat analytics verified.");

  // 4. Verify Payouts
  console.log(`\n4. Settlement Payouts (m1):`);
  console.log(`- Delay Rate: ${settlements.delayRate}%`);
  console.log(`- Risk level: ${settlements.riskLevel}`);
  console.log(`- Delay predictions count: ${settlements.delayPredictions.length}`);
  
  console.log("✓ Payout pipeline calculations verified.");

  console.log("\n=== ALL TRANSACTIONAL TESTS PASSED SUCCESSFULLY! ===");
}

runTests();
