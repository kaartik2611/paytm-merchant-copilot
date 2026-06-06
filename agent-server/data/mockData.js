const products = [
  { id: "P1", name: "Masala Chai", price: 30 },
  { id: "P2", name: "Samosa", price: 20 },
  { id: "P3", name: "Vada Pav", price: 25 },
  { id: "P4", name: "Cold Coffee", price: 60 },
  { id: "P5", name: "Sandwich", price: 50 },
  { id: "P6", name: "Mango Juice", price: 45 },
];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function weightedPick(rand, items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function generateTransactions() {
  const rand = seededRandom(42);
  const txns = [];

  const mayDates = [];
  const juneDates = [];
  for (let d = 1; d <= 31; d++) {
    mayDates.push(`2024-05-${String(d).padStart(2, "0")}`);
  }
  for (let d = 1; d <= 6; d++) {
    juneDates.push(`2024-06-${String(d).padStart(2, "0")}`);
  }

  // ~35 in May, ~65 in June for upward trend
  const dates = [];
  for (let i = 0; i < 35; i++) {
    dates.push(mayDates[Math.floor(rand() * mayDates.length)]);
  }
  for (let i = 0; i < 65; i++) {
    dates.push(juneDates[Math.floor(rand() * juneDates.length)]);
  }

  // Masala Chai weighted highest for #1 by revenue
  const productWeights = [30, 15, 15, 12, 14, 14];

  const peakHours = [9, 13, 19];
  const hourWeights = Array(24).fill(1);
  hourWeights[9] = 12;
  hourWeights[13] = 10;
  hourWeights[19] = 11;
  hourWeights[10] = 4;
  hourWeights[12] = 4;
  hourWeights[18] = 3;
  hourWeights[20] = 3;

  const paymentMethods = ["UPI", "Cash", "Card"];
  const paymentWeights = [60, 25, 15];

  for (let i = 0; i < 100; i++) {
    const product = weightedPick(rand, products, productWeights);
    const hour = weightedPick(
      rand,
      Array.from({ length: 24 }, (_, h) => h),
      hourWeights
    );
    const customerId = `C${Math.floor(rand() * 30) + 1}`;
    const qty = Math.floor(rand() * 4) + 1;
    const date = dates[i];

    txns.push({
      id: `T${i + 1}`,
      merchant_id: "M1",
      customer_id: customerId,
      product_id: product.id,
      product_name: product.name,
      category: "Food & Beverage",
      amount: product.price * qty,
      quantity: qty,
      is_new_customer: rand() < 0.3,
      payment_method: weightedPick(rand, paymentMethods, paymentWeights),
      hour,
      date,
      month: date.slice(0, 7),
    });
  }

  return txns;
}

const transactions = generateTransactions();

const inventory = [
  { product_id: "P1", product_name: "Masala Chai", stock: 50, reorder_level: 20 },
  { product_id: "P2", product_name: "Samosa", stock: 8, reorder_level: 15 },
  { product_id: "P3", product_name: "Vada Pav", stock: 40, reorder_level: 10 },
  { product_id: "P4", product_name: "Cold Coffee", stock: 5, reorder_level: 12 },
  { product_id: "P5", product_name: "Sandwich", stock: 30, reorder_level: 10 },
  { product_id: "P6", product_name: "Mango Juice", stock: 25, reorder_level: 10 },
];

module.exports = { transactions, inventory };
