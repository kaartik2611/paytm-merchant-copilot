const { transactions, inventory } = require("../data/mockData");
const {
  groupByDate,
  topProducts,
  peakHours,
  customerSegments,
  filterTransactions,
  getInventoryStatus,
  buildSnapshot,
} = require("./dataUtils");

const toolDefinitions = [
  {
    type: "function",
    function: {
      name: "get_revenue_trend",
      description:
        "Get daily revenue and order count. Optionally filter by date range or specific month.",
      parameters: {
        type: "object",
        properties: {
          month: {
            type: "string",
            description: 'Filter by month in YYYY-MM format, e.g. "2024-06"',
          },
          startDate: {
            type: "string",
            description: "Start date in YYYY-MM-DD format",
          },
          endDate: {
            type: "string",
            description: "End date in YYYY-MM-DD format",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_top_products",
      description:
        "Get top selling products ranked by revenue. Returns product name, total revenue, and units sold.",
      parameters: {
        type: "object",
        properties: {
          count: {
            type: "number",
            description: "Number of top products to return (default 5)",
          },
          month: {
            type: "string",
            description: 'Filter by month in YYYY-MM format, e.g. "2024-06"',
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_peak_hours",
      description:
        "Get transaction counts for each hour of the day (0-23) to identify busiest hours.",
      parameters: {
        type: "object",
        properties: {
          month: {
            type: "string",
            description: 'Filter by month in YYYY-MM format, e.g. "2024-06"',
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_customer_segments",
      description:
        "Get customer breakdown: new customers, returning customers, high-value (spent > ₹500), and occasional (≤2 visits).",
      parameters: {
        type: "object",
        properties: {
          month: {
            type: "string",
            description: 'Filter by month in YYYY-MM format, e.g. "2024-06"',
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_inventory_alerts",
      description:
        "Get current inventory status for all products, including stock levels and whether each item is low stock.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_recap",
      description:
        'Get a business recap summary for a given period. "daily" returns today\'s stats (2024-06-06), "monthly" returns June 2024 stats including best day.',
      parameters: {
        type: "object",
        properties: {
          period: {
            type: "string",
            enum: ["daily", "monthly"],
            description: 'Period for the recap: "daily" or "monthly"',
          },
        },
        required: ["period"],
      },
    },
  },
];

function executeTool(name, args = {}) {
  switch (name) {
    case "get_revenue_trend": {
      const filtered = filterTransactions(transactions, {
        month: args.month,
        startDate: args.startDate,
        endDate: args.endDate,
      });
      return groupByDate(filtered);
    }

    case "get_top_products": {
      const filtered = args.month
        ? filterTransactions(transactions, { month: args.month })
        : transactions;
      return topProducts(filtered, args.count || 5);
    }

    case "get_peak_hours": {
      const filtered = args.month
        ? filterTransactions(transactions, { month: args.month })
        : transactions;
      return peakHours(filtered);
    }

    case "get_customer_segments": {
      const filtered = args.month
        ? filterTransactions(transactions, { month: args.month })
        : transactions;
      return customerSegments(filtered);
    }

    case "get_inventory_alerts": {
      return getInventoryStatus(inventory);
    }

    case "get_recap": {
      const period = args.period || "daily";
      const filtered =
        period === "daily"
          ? filterTransactions(transactions, { date: "2024-06-06" })
          : filterTransactions(transactions, { month: "2024-06" });

      const totalRevenue = filtered.reduce((s, t) => s + t.amount, 0);
      const totalOrders = filtered.length;
      const top = topProducts(filtered, 1);
      const newCustomers = filtered.filter((t) => t.is_new_customer).length;
      const lowStockItems = inventory
        .filter((i) => i.stock < i.reorder_level)
        .map((i) => i.product_name);

      const result = {
        period,
        totalRevenue,
        totalOrders,
        topProduct: top[0]?.name || "N/A",
        newCustomers,
        lowStockItems,
      };

      if (period === "monthly") {
        const byDate = groupByDate(filtered);
        const bestDay = byDate.reduce(
          (a, b) => (b.revenue > a.revenue ? b : a),
          byDate[0]
        );
        result.bestDay = bestDay?.date || "N/A";
      }

      return result;
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

const SYSTEM_PROMPT = `You are the Paytm Merchant Intelligence Copilot, a senior business consultant and transactional analyst for small Indian merchants.

Your job is to help merchants understand their daily business operations, identify trends, and make data-driven decisions using their transaction analytics.

Guidelines:
1. ALWAYS call the appropriate tool before answering any question about numbers, data, or business metrics. Never guess or invent figures.
2. Today is 2024-06-06. The data covers May 1 to June 6, 2024.
3. Speak directly to the merchant owner in a friendly, professional, and encouraging tone.
4. Use formatting (bold with **, bullet points with *, section headers with ###) to make insights readable.
5. Keep answers focused — 3-5 sentences or a short bulleted list. Avoid padding.
6. After sharing data, always add one actionable recommendation the merchant can act on immediately.
7. When asked about restocking, always call get_inventory_alerts first.
8. When asked about peak hours or busy times, always call get_peak_hours first.
9. When asked about best sellers or top products, always call get_top_products first.
10. When asked about customers or retention, always call get_customer_segments first.`;

module.exports = { toolDefinitions, executeTool, SYSTEM_PROMPT };
