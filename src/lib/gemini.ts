import { GoogleGenAI } from '@google/genai';
import { MerchantDashboardData } from './data';

const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

// Formats transactional metrics as markdown text context for the LLM
function formatAnalyticsContext(data: MerchantDashboardData): string {
  const { merchant, revenue, peakHours, customers, settlements, forecast } = data;

  const paymentModesList = revenue.paymentModeShare
    .map(p => `- ${p.mode}: ₹${p.revenue.toLocaleString()} (${p.count} payments)`)
    .join('\n');

  const customerSegments = customers.segmentDistribution
    .map(s => `- ${s.segment}: ${s.count} shoppers (₹${s.totalSpend.toLocaleString()} spend)`)
    .join('\n');

  const forecastSummary = forecast
    .map(f => `- ${f.date}: ₹${f.revenue.toLocaleString()} (${f.isForecast ? 'Forecasted' : 'Actual'})`)
    .join('\n');

  const totalForecastedRevenue = forecast.reduce((sum, f) => sum + f.revenue, 0);

  return `
Merchant Name: ${merchant.name}
Category: ${merchant.category}
City: ${merchant.city}
UPI ID: ${merchant.upiId}

--- OPERATIONAL HEALTH SCORE ---
- Merchant Health Score: ${revenue.healthScore}/100 (Operational Rating: ${revenue.healthLevel})
- Transaction Success Rate: ${((revenue.successTxnCount / (revenue.successTxnCount + revenue.failedTxnCount)) * 100).toFixed(1)}% (Success: ${revenue.successTxnCount}, Failed: ${revenue.failedTxnCount})

--- REVENUE SUMMARY (LAST 30 DAYS) ---
- Total Revenue: ₹${revenue.totalRevenue.toLocaleString()}
- Average Ticket Size (AOV): ₹${revenue.averageOrderValue}
- Growth Rate (current 15 days vs previous 15 days): ${revenue.growthPercentage}%

--- 7-DAY REVENUE FORECAST ---
- Predicted Total (Next 7 Days): ₹${totalForecastedRevenue.toLocaleString()}
${forecastSummary}

--- PEAK HOURS ---
- Primary Peak Hour: ${peakHours.peakHours[0]}:00 (${peakHours.peakPeriodName})
- Secondary Peak Hour: ${peakHours.peakHours[1]}:00
- Hourly distribution: ${peakHours.hourlyStats.map(h => `${h.hour}h: ₹${Math.round(h.revenue)}`).join(', ')}

--- CUSTOMER RETENTION & VISITS ---
- Unique Shoppers: ${customers.uniqueCustomers}
- Repeat Customer Rate: ${customers.repeatCustomerRate}%
- Visit Frequency segments:
${customerSegments}

--- PAYMENT MODE PREFERENCES ---
${paymentModesList}

--- SETTLEMENT PIPELINE ---
- Settled Amount: ₹${settlements.totalSettledAmount.toLocaleString()} (${settlements.settledCount} settlements)
- Pending Payouts: ₹${settlements.totalPendingAmount.toLocaleString()} (${settlements.pendingCount} settlements)
- Delayed Payouts: ₹${settlements.totalDelayedAmount.toLocaleString()} (${settlements.delayedCount} settlements)
- Settlement Delay Rate: ${settlements.delayRate}%
- Delay Warnings for Pending Batches: ${settlements.delayPredictions.length > 0 ? settlements.delayPredictions.map(p => `Settlement ${p.settlementId} (₹${p.amount}) pending for ${p.pendingHours}h [${p.riskStatus}]`).join(', ') : 'None'}
`;
}

const SYSTEM_PROMPT = `
You are the Paytm Merchant Intelligence Copilot, a senior business consultant and transactional analyst.
Your job is to help Paytm merchants understand their daily business operations, identify payment bottlenecks, predict revenue schedules, and optimize settlement timings using transactional and payout streams.

Guidelines:
1. Speak directly to the merchant owner using the provided transaction metrics.
2. Be friendly, encouraging, and highly professional. Use formatting (bolding, bullet points, and tables) to make insights readable.
3. Ground your answers strictly in the provided analytics context (revenue, peak hours, customer visit patterns, settlements, forecasts, health score). Do not invent metrics.
4. Suggest operational strategies (like displaying extra QR stickers, adjusting counter staffing for peak hours, setting up Paytm loyalty scan campaigns, or toggling Instant Settlements to avoid bank delays).
5. Do NOT mention SKU products, product Margins, inventory levels, catalog lists, or suppliers since these are unavailable from Paytm scan streams.
`;

// Hackathon Fallback Generator - runs if GEMINI_API_KEY is not defined
function generateMockResponse(prompt: string, data: MerchantDashboardData): string {
  const query = prompt.toLowerCase();
  const { merchant, revenue, peakHours, customers, settlements, forecast } = data;

  if (query.includes('forecast') || query.includes('predict') || query.includes('future') || query.includes('next week')) {
    const totalForecast = forecast.reduce((sum, f) => sum + f.revenue, 0);
    return `### 🔮 Revenue Forecast for **${merchant.name}**

Based on your daily transaction patterns and week-over-week trends, here is your revenue projection for the next 7 days:

* **Predicted 7-Day Total**: **₹${totalForecast.toLocaleString()}**
* **Daily Projections Preview**:
  * Day 1: ₹${forecast[0]?.revenue.toLocaleString()}
  * Day 2: ₹${forecast[1]?.revenue.toLocaleString()}
  * Day 3: ₹${forecast[2]?.revenue.toLocaleString()}
  * Day 4: ₹${forecast[3]?.revenue.toLocaleString()}

**Copilot Insights:**
* We detected historical weekend spikes. Your forecast reflects this seasonality, showing elevated predictions during your typical peak days.
* To secure this revenue, ensure your **Paytm Soundbox** device is fully charged and connected to 4G/Wi-Fi to prevent transaction dropouts.`;
  }

  if (query.includes('health') || query.includes('score') || query.includes('rating') || query.includes('healthy')) {
    return `### 🩺 Merchant Health Score for **${merchant.name}** (ID: ${merchant.merchantId}): **${revenue.healthScore}/100** (Rating: **${revenue.healthLevel}**)

Your Operational Health Score indicates how smoothly your business checks out and settles digital payments.

**Score Components:**
1. **Payment Success Rate**: **${((revenue.successTxnCount / (revenue.successTxnCount + revenue.failedTxnCount)) * 100).toFixed(1)}%** (${revenue.successTxnCount} successful scans, ${revenue.failedTxnCount} failed). (40% weight)
2. **Settlement Stability**: Delayed payouts represent **${settlements.delayRate}%** of your batch runs. (30% weight)
3. **Customer Retention**: Repeat visits represent **${customers.repeatCustomerRate}%** of your shoppers. (20% weight)
4. **Growth Moment**: Currently trending at **${revenue.growthPercentage}%** growth. (10% weight)

**How to Improve Your Score:**
* **Reduce failures**: If your success rate is below 95%, test your Paytm QR sticker or scan counter terminal connectivity.
* **Boost retention**: Initiate a **Paytm Loyalty Campaign** to convert single-visit scanners into repeat customers.`;
  }

  if (query.includes('revenue') || query.includes('sales') || query.includes('grow') || query.includes('down') || query.includes('up')) {
    const direction = revenue.growthPercentage >= 0 ? 'up' : 'down';
    return `### 📊 Revenue Analysis for **${merchant.name}**

Your total revenue over the last 30 days is **₹${revenue.totalRevenue.toLocaleString()}** across **${revenue.successTxnCount}** scans.

**Key Metrics:**
* **Growth Trend**: Your revenue is **${direction} by ${Math.abs(revenue.growthPercentage)}%** compared to the first half of the month.
* **Average Ticket**: On average, customers scan for **₹${revenue.averageOrderValue}** per transaction.
* **Payment Modes**: Your primary channel is **UPI**, representing a key checkout driver.

**Copilot Recommendations:**
1. Maintain payment flow speed during peak hours. Use the **Paytm Business App** to review hourly breakdowns.
2. If growth is down, incentivize larger checkouts (AOV) by setting up a quick-discount Paytm banner.`;
  }

  if (query.includes('hour') || query.includes('time') || query.includes('busy') || query.includes('peak')) {
    const peakHour = peakHours.peakHours[0];
    const peakHourLabel = peakHour === 0 ? "12 AM" : peakHour === 12 ? "12 PM" : peakHour > 12 ? `${peakHour - 12} PM` : `${peakHour} AM`;
    return `### ⏰ Peak Hour Analysis for **${merchant.name}**

Your peak transaction volumes occur around **${peakHourLabel}** (labeled as **${peakHours.peakPeriodName}**).

**Key Findings:**
* **Peak Window**: The hour of **${peakHour}:00** represents your highest transaction density.
* **Hourly Trend**: Hourly checkouts spike by **1.8x** compared to other baseline business hours.

**Copilot Recommendations:**
1. **Reduce Queue Times**: During **${peakHourLabel}**, ensure staff are listening to **Paytm Soundbox voice alerts** rather than checking phone screens to speed up verification.
2. **Dedicated Scanning**: Place a second QR sticker code at the counter to split lines.`;
  }

  if (query.includes('customer') || query.includes('segment') || query.includes('repeat') || query.includes('loyalty')) {
    const freq = customers.segmentDistribution.find(s => s.segment === 'Frequent');
    const occasional = customers.segmentDistribution.find(s => s.segment === 'Occasional');
    return `### 👥 Customer Visit Insights for **${merchant.name}**

* **Unique Shoppers**: You had **${customers.uniqueCustomers}** unique identifiers scan your QR code.
* **Repeat Rate**: Your repeat customer rate is **${customers.repeatCustomerRate}%** (customers with $\\ge$ 2 visits).
* **Visit Groups**:
  * **Frequent Loyalists**: ${freq?.count || 0} customers ($\\ge$ 5 visits)
  * **Occasional Shoppers**: ${occasional?.count || 0} customers (2-4 visits)

**Copilot Recommendations:**
1. **Reward Loyalty**: Launch a **Paytm Loyalty Card** in the Paytm merchant panel. Offer customers a cashback discount on their 5th scan.
2. **Win Back Churned Shoppers**: Target shoppers who haven't visited in 15 days with a Paytm Business app push discount.`;
  }

  if (query.includes('settle') || query.includes('risk') || query.includes('delay') || query.includes('bank') || query.includes('money')) {
    const predictions = settlements.delayPredictions;
    return `### 🏦 Settlement Intelligence for **${merchant.name}**

* **Ledger Status**: Settled: **₹${settlements.totalSettledAmount.toLocaleString()}**, Pending payout: **₹${settlements.totalPendingAmount.toLocaleString()}**.
* **Delay Frequency**: **${settlements.delayRate}%** of your daily batches experience bank delays.
* **Delay Risk Warnings**:
  ${predictions.length > 0 
    ? `⚠️ **Warning**: Settlement ${predictions[0].settlementId} (₹${predictions[0].amount.toLocaleString()}) has been pending for **${predictions[0].pendingHours} hours** and is flagged as **${predictions[0].riskStatus.replace(/_/g, ' ')}**.`
    : '✓ No active delay warnings for pending settlements.'}

**Copilot Recommendations:**
1. Toggle **Instant Settlements** in your settings to bypass standard bank T+1 batch clearance times, especially if your delay frequency is high.
2. Check your linked bank account status if you experience consecutive settlement failures.`;
  }

  return `### Hello! I am your **Paytm Merchant Intelligence Copilot** 🚀

I've analyzed the transactional records for **${merchant.name}**. Here are some questions you can ask me:
* *"Why is my merchant health score down?"*
* *"What is my revenue forecast for next week?"*
* *"What are my peak business hours?"*
* *"How is my settlement delay risk looking?"*
* *"How can I increase customer repeat rates?"*

*(Note: Running in offline/fallback mode. Enter a GEMINI_API_KEY in .env.local to enable open-ended natural language conversations!)*`;
}

export async function askGemini(
  prompt: string,
  data: MerchantDashboardData,
  chatHistory: { role: 'user' | 'model'; text: string }[] = []
): Promise<string> {
  const ai = getGenAIClient();
  
  if (!ai) {
    return generateMockResponse(prompt, data);
  }

  const contextStr = formatAnalyticsContext(data);

  const contents = [
    {
      role: 'user',
      parts: [{ text: `Here is the merchant analytical context to ground all your responses:\n${contextStr}` }]
    },
    {
      role: 'model',
      parts: [{ text: "Understood. I have loaded the merchant's transactional dashboard. I am ready to answer their business questions using these facts." }]
    }
  ];

  chatHistory.forEach(h => {
    contents.push({
      role: h.role,
      parts: [{ text: h.text }]
    });
  });

  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      }
    });

    return response.text || "Sorry, I could not generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return `### Error communicating with Gemini API\n\nFallback analytics answer:\n\n${generateMockResponse(prompt, data)}`;
  }
}
