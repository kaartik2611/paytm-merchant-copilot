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
  const r1 = resp1.toLowerCase();
  if (!r1.includes("health score") || (!r1.includes("m1") && !r1.includes("apna bazar"))) {
    throw new Error("Health score answer fallback failed");
  }

  // Query forecast
  const resp2 = await askGemini("Predict my sales for next week", data);
  console.log("\nQuery: 'Predict my sales for next week'");
  console.log(resp2);
  const r2 = resp2.toLowerCase();
  if (!r2.includes("forecast") && !r2.includes("projection") && !r2.includes("predict")) {
    throw new Error("Forecast answer fallback failed");
  }

  console.log("\n✓ Chatbot transactional fallback engine verified successfully.");
  console.log("=== CHATBOT VERIFICATION COMPLETED ===");
}

testChat().catch(console.error);
