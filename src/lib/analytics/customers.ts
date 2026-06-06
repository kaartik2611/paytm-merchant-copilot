import { Transaction } from '../types';

export interface CustomerProfile {
  customerId: string;
  totalSpend: number;
  transactionCount: number;
  lastTxnDate: string;
  segment: 'Single Visit' | 'Occasional' | 'Frequent' | 'Churn Risk';
}

export interface CustomerAnalytics {
  uniqueCustomers: number;
  repeatCustomers: number;
  repeatCustomerRate: number; // Percentage
  segmentDistribution: { segment: string; count: number; totalSpend: number }[];
  visitFrequencyShare: { name: string; value: number }[]; // Pie chart data
}

export function calculateCustomerAnalytics(
  transactions: Transaction[],
  referenceDateStr = '2026-06-06'
): CustomerAnalytics {
  const successTxns = transactions.filter(t => t.status === 'SUCCESS');
  if (successTxns.length === 0) {
    return {
      uniqueCustomers: 0,
      repeatCustomers: 0,
      repeatCustomerRate: 0,
      segmentDistribution: [],
      visitFrequencyShare: [],
    };
  }

  const referenceDate = new Date(`${referenceDateStr}T23:59:59Z`).getTime();
  const msInDay = 24 * 60 * 60 * 1000;

  // Group transactions by customer
  const customerMap: { [id: string]: { totalSpend: number; count: number; last: string } } = {};
  
  successTxns.forEach(t => {
    const time = new Date(t.timestamp).toISOString();
    if (!customerMap[t.customerId]) {
      customerMap[t.customerId] = {
        totalSpend: 0,
        count: 0,
        last: time,
      };
    }
    const profile = customerMap[t.customerId];
    profile.totalSpend += t.amount;
    profile.count += 1;
    if (time > profile.last) profile.last = time;
  });

  const customerProfiles: CustomerProfile[] = Object.entries(customerMap).map(([customerId, data]) => {
    const lastActiveTime = new Date(data.last).getTime();
    const daysSinceLastActive = (referenceDate - lastActiveTime) / msInDay;

    let segment: CustomerProfile['segment'] = 'Occasional';
    if (daysSinceLastActive > 15) {
      segment = 'Churn Risk';
    } else if (data.count === 1) {
      segment = 'Single Visit';
    } else if (data.count > 4) {
      segment = 'Frequent';
    } else {
      segment = 'Occasional';
    }

    return {
      customerId,
      totalSpend: Number(data.totalSpend.toFixed(2)),
      transactionCount: data.count,
      lastTxnDate: data.last,
      segment,
    };
  });

  const uniqueCustomers = customerProfiles.length;
  const repeatCustomers = customerProfiles.filter(p => p.transactionCount >= 2).length;
  const repeatCustomerRate = uniqueCustomers > 0 ? (repeatCustomers / uniqueCustomers) * 100 : 0;

  // Calculate segment distributions
  const segments: { [name: string]: { count: number; spend: number } } = {
    'Single Visit': { count: 0, spend: 0 },
    'Occasional': { count: 0, spend: 0 },
    'Frequent': { count: 0, spend: 0 },
    'Churn Risk': { count: 0, spend: 0 },
  };

  customerProfiles.forEach(p => {
    if (segments[p.segment]) {
      segments[p.segment].count += 1;
      segments[p.segment].spend += p.totalSpend;
    }
  });

  const segmentDistribution = Object.entries(segments).map(([segment, data]) => ({
    segment,
    count: data.count,
    totalSpend: Number(data.spend.toFixed(2)),
  }));

  const visitFrequencyShare = segmentDistribution.map(s => ({
    name: s.segment,
    value: s.count,
  }));

  return {
    uniqueCustomers,
    repeatCustomers,
    repeatCustomerRate: Number(repeatCustomerRate.toFixed(2)),
    segmentDistribution,
    visitFrequencyShare,
  };
}
