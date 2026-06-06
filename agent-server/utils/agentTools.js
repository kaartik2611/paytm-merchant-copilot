const {
  getRevenueTrend,
  getPeakHours,
  getCustomerSegments,
  getPaymentBreakdown,
  getSettlementSummary,
  getRecap,
  getMerchantById,
} = require('./dataUtils');

const toolDefinitions = [
  {
    type: 'function',
    function: {
      name: 'get_revenue_trend',
      description: 'Get daily revenue and order count for the merchant. Filter by month or date range.',
      parameters: {
        type: 'object',
        properties: {
          month: { type: 'string', description: 'Filter by month in YYYY-MM format, e.g. "2026-05"' },
          startDate: { type: 'string', description: 'Start date in YYYY-MM-DD format (inclusive)' },
          endDate: { type: 'string', description: 'End date in YYYY-MM-DD format (inclusive)' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_peak_hours',
      description: 'Get transaction count and revenue for each hour of the day (0–23 IST) to identify busiest hours.',
      parameters: {
        type: 'object',
        properties: {
          month: { type: 'string', description: 'Filter by month in YYYY-MM format' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_customer_segments',
      description: 'Get customer breakdown: unique customers, new (1 visit), returning (2–4 visits), frequent (5+ visits), high-value (spend 1.5× above average).',
      parameters: {
        type: 'object',
        properties: {
          month: { type: 'string', description: 'Filter by month in YYYY-MM format' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_payment_breakdown',
      description: 'Get revenue and transaction count split by payment mode (UPI, Credit Card, Debit Card, etc.).',
      parameters: {
        type: 'object',
        properties: {
          month: { type: 'string', description: 'Filter by month in YYYY-MM format' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_settlement_summary',
      description: 'Get settlement status summary: how much has been settled, is pending, delayed, or failed.',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_recap',
      description: 'Get a business recap for the latest day or current month — total revenue, orders, customers, and best day.',
      parameters: {
        type: 'object',
        properties: {
          period: {
            type: 'string',
            enum: ['daily', 'monthly'],
            description: '"daily" for today\'s stats, "monthly" for current month stats',
          },
        },
        required: ['period'],
      },
    },
  },
];

function executeTool(name, args = {}, context = {}) {
  const merchantId = context.merchantId || null;

  switch (name) {
    case 'get_revenue_trend':
      return getRevenueTrend(merchantId, {
        month: args.month,
        startDate: args.startDate,
        endDate: args.endDate,
      });

    case 'get_peak_hours':
      return getPeakHours(merchantId, { month: args.month });

    case 'get_customer_segments':
      return getCustomerSegments(merchantId, { month: args.month });

    case 'get_payment_breakdown':
      return getPaymentBreakdown(merchantId, { month: args.month });

    case 'get_settlement_summary':
      return getSettlementSummary(merchantId);

    case 'get_recap':
      return getRecap(merchantId, args.period || 'daily');

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

const SYSTEM_PROMPT = `You are the Paytm Merchant Intelligence Copilot, a senior business consultant and transactional analyst for small Indian merchants.

Your job is to help merchants understand their daily business operations, identify trends, and make data-driven decisions using their Paytm transaction and settlement data.

Guidelines:
1. ALWAYS call the appropriate tool before answering any question about numbers, data, or business metrics. Never guess or invent figures.
2. Speak directly to the merchant owner in a friendly, professional, and encouraging tone.
3. Use formatting (bold with **, bullet points with *, section headers with ###) to make insights readable.
4. Keep answers focused — a short bulleted list or 3-5 sentences. No padding.
5. After sharing data, always add one actionable recommendation.
6. The data covers UPI and card payment transactions. There is no product/inventory data — do not mention products or stock.
7. Tool routing guide:
   - Revenue or sales questions → get_revenue_trend
   - Busy hours or peak time → get_peak_hours
   - Customer retention or loyalty → get_customer_segments
   - Payment modes (UPI vs card) → get_payment_breakdown
   - Settlements, payouts, delays → get_settlement_summary
   - Overall daily or monthly summary → get_recap`;

module.exports = { toolDefinitions, executeTool, SYSTEM_PROMPT };
