import { Settlement, Transaction } from '../types';

export interface SettlementStats {
  totalSettledAmount: number;
  totalPendingAmount: number;
  totalDelayedAmount: number;
  totalFailedAmount: number;
  settledCount: number;
  pendingCount: number;
  delayedCount: number;
  failedCount: number;
  delayRate: number;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recentSettlements: Settlement[];
  delayPredictions: { settlementId: string; amount: number; pendingHours: number; riskStatus: 'NORMAL' | 'HIGH_RISK_OF_DELAY' }[];
}

export function calculateSettlementAnalytics(
  settlements: Settlement[],
  transactions: Transaction[],
  referenceDateStr = '2026-06-06'
): SettlementStats {
  const merchantSettlements = settlements;
  const referenceDate = new Date(`${referenceDateStr}T23:59:59Z`).getTime();
  
  let totalSettledAmount = 0;
  let totalPendingAmount = 0;
  let totalDelayedAmount = 0;
  let totalFailedAmount = 0;

  let settledCount = 0;
  let pendingCount = 0;
  let delayedCount = 0;
  let failedCount = 0;

  merchantSettlements.forEach(s => {
    if (s.status === 'SETTLED') {
      totalSettledAmount += s.amount;
      settledCount += 1;
    } else if (s.status === 'PENDING') {
      totalPendingAmount += s.amount;
      pendingCount += 1;
    } else if (s.status === 'DELAYED') {
      totalDelayedAmount += s.amount;
      delayedCount += 1;
      totalSettledAmount += s.amount;
      settledCount += 1;
    } else if (s.status === 'FAILED') {
      totalFailedAmount += s.amount;
      failedCount += 1;
    }
  });

  const totalSettlementsCount = settledCount + delayedCount + failedCount;
  const delayRate = totalSettlementsCount > 0 ? (delayedCount / totalSettlementsCount) * 100 : 0;
  const failedRate = totalSettlementsCount > 0 ? (failedCount / totalSettlementsCount) * 100 : 0;

  // Transaction Failure Rate
  const totalTxns = transactions.length;
  const failedTxnsCount = transactions.filter(t => t.status === 'FAILED').length;
  const txnFailureRate = totalTxns > 0 ? (failedTxnsCount / totalTxns) * 100 : 0;

  // Rule-based Risk Score Calculation
  let riskScore = 0;

  // 1. Settlement Delay Rate (Max 35 points)
  if (delayRate > 15) riskScore += 35;
  else if (delayRate > 8) riskScore += 20;
  else if (delayRate > 3) riskScore += 10;
  else if (delayRate > 0) riskScore += 3;

  // 2. Settlement Failure Rate (Max 45 points)
  if (failedRate > 5) riskScore += 45;
  else if (failedRate > 2) riskScore += 30;
  else if (failedRate > 0.5) riskScore += 15;

  // 3. Transaction Failure Rate (Max 20 points)
  if (txnFailureRate > 8) riskScore += 20;
  else if (txnFailureRate > 4) riskScore += 12;
  else if (txnFailureRate > 1) riskScore += 5;

  riskScore = Math.min(100, riskScore);

  let riskLevel: SettlementStats['riskLevel'] = 'LOW';
  if (riskScore > 50) riskLevel = 'HIGH';
  else if (riskScore > 20) riskLevel = 'MEDIUM';

  // 4. Delay predictions for active PENDING settlements
  // Check if pending settlement initiatedTime is more than 24 hours ago compared to reference time
  const delayPredictions: SettlementStats['delayPredictions'] = [];
  merchantSettlements.forEach(s => {
    if (s.status === 'PENDING') {
      const initiated = new Date(s.initiatedTime).getTime();
      const diffMs = referenceDate - initiated;
      const pendingHours = Math.max(0, Math.round(diffMs / (60 * 60 * 1000)));
      
      const riskStatus = pendingHours > 24 ? 'HIGH_RISK_OF_DELAY' : 'NORMAL';
      
      delayPredictions.push({
        settlementId: s.settlementId,
        amount: s.amount,
        pendingHours,
        riskStatus
      });
    }
  });

  const recentSettlements = [...merchantSettlements].sort(
    (a, b) => new Date(b.initiatedTime).getTime() - new Date(a.initiatedTime).getTime()
  );

  return {
    totalSettledAmount: Number(totalSettledAmount.toFixed(2)),
    totalPendingAmount: Number(totalPendingAmount.toFixed(2)),
    totalDelayedAmount: Number(totalDelayedAmount.toFixed(2)),
    totalFailedAmount: Number(totalFailedAmount.toFixed(2)),
    settledCount,
    pendingCount,
    delayedCount,
    failedCount,
    delayRate: Number(delayRate.toFixed(2)),
    riskScore: Math.round(riskScore),
    riskLevel,
    recentSettlements,
    delayPredictions,
  };
}
