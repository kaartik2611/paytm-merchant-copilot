import { getMerchantDashboardData } from '../src/lib/data';
import { askGemini } from '../src/lib/gemini';

async function testChat() {
  console.log("=== STARTING CHATBOT REFACTORED VERIFICATION ===");

  const data = getMerchantDashboardData('m1');
  if (!data) throw new Error("m1 not found");

  // Query health score
  const resp1 = await askGemini("Why is my health score down?", data);
  console.log("\nQuery: 'Why is my health score down?'");
  console.log(resp1);
  if (!resp1.includes("Health Score") || !resp1.includes("m1")) {
    throw new Error("Health score answer fallback failed");
  }

  // Query forecast
  const resp2 = await askGemini("Predict my sales for next week", data);
  console.log("\nQuery: 'Predict my sales for next week'");
  console.log(resp2);
  if (!resp2.includes("Revenue Forecast") || !resp2.includes("7-Day Total")) {
    throw new Error("Forecast answer fallback failed");
  }

  console.log("\n✓ Chatbot transactional fallback engine verified successfully.");
  console.log("=== CHATBOT VERIFICATION COMPLETED ===");
}

testChat().catch(console.error);
