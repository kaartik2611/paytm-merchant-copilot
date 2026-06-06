import * as fs from 'fs';
import * as path from 'path';

interface Merchant {
  merchantId: string;
  name: string;
  category: 'Grocery Store' | 'Restaurant' | 'Medical Store' | 'Electronics Store' | 'Clothing Store';
  ownerName: string;
  email: string;
  phone: string;
  upiId: string;
  city: string;
  joinedDate: string;
}

interface Transaction {
  txnId: string;
  merchantId: string;
  customerId: string;
  amount: number;
  timestamp: string;
  paymentMode: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

interface Settlement {
  settlementId: string;
  merchantId: string;
  amount: number;
  txnIds: string[];
  status: 'SETTLED' | 'PENDING' | 'DELAYED' | 'FAILED';
  initiatedTime: string;
  settledTime: string | null;
  bankRefNo: string | null;
}

// 1. Generate Merchants
const merchants: Merchant[] = [
  {
    merchantId: 'm1',
    name: 'Apna Bazar Supermarket',
    category: 'Grocery Store',
    ownerName: 'Rajesh Kumar',
    email: 'contact@apnabazar.com',
    phone: '+91 98765 43210',
    upiId: 'apnabazar@paytm',
    city: 'Mumbai',
    joinedDate: '2025-01-15T09:00:00Z',
  },
  {
    merchantId: 'm2',
    name: 'The Spice Route Restaurant',
    category: 'Restaurant',
    ownerName: 'Priya Sharma',
    email: 'info@spiceroute.com',
    phone: '+91 98765 43211',
    upiId: 'spiceroute@paytm',
    city: 'Delhi NCR',
    joinedDate: '2025-02-10T10:30:00Z',
  },
  {
    merchantId: 'm3',
    name: 'City Life Medicos',
    category: 'Medical Store',
    ownerName: 'Dr. Amit Patel',
    email: 'citymedicos@gmail.com',
    phone: '+91 98765 43212',
    upiId: 'citymedicos@paytm',
    city: 'Ahmedabad',
    joinedDate: '2025-03-01T08:00:00Z',
  },
  {
    merchantId: 'm4',
    name: 'Techno World Electronics',
    category: 'Electronics Store',
    ownerName: 'Vikram Mehta',
    email: 'sales@technoworld.in',
    phone: '+91 98765 43213',
    upiId: 'technoworld@paytm',
    city: 'Bengaluru',
    joinedDate: '2024-11-20T11:00:00Z',
  },
  {
    merchantId: 'm5',
    name: 'Vogue Boutique & Apparel',
    category: 'Clothing Store',
    ownerName: 'Neha Sen',
    email: 'hello@vogueboutique.com',
    phone: '+91 98765 43214',
    upiId: 'vogueboutique@paytm',
    city: 'Kolkata',
    joinedDate: '2025-01-05T10:00:00Z',
  },
  {
    merchantId: 'm6',
    name: 'Fresh Mart Grocery',
    category: 'Grocery Store',
    ownerName: 'Suresh Gupta',
    email: 'suresh.g@freshmart.com',
    phone: '+91 98765 43215',
    upiId: 'freshmart@paytm',
    city: 'Pune',
    joinedDate: '2025-04-12T08:30:00Z',
  },
  {
    merchantId: 'm7',
    name: 'Pizza Corner & Cafe',
    category: 'Restaurant',
    ownerName: 'Rohan Malhotra',
    email: 'admin@pizzacorner.in',
    phone: '+91 98765 43216',
    upiId: 'pizzacorner@paytm',
    city: 'Chandigarh',
    joinedDate: '2025-03-15T12:00:00Z',
  },
  {
    merchantId: 'm8',
    name: 'Cure All Pharmacy',
    category: 'Medical Store',
    ownerName: 'Meena Reddy',
    email: 'cureallpharmacy@yahoo.com',
    phone: '+91 98765 43217',
    upiId: 'cureall@paytm',
    city: 'Hyderabad',
    joinedDate: '2025-02-18T09:15:00Z',
  },
  {
    merchantId: 'm9',
    name: 'Gadget Zone Store',
    category: 'Electronics Store',
    ownerName: 'Anil Verma',
    email: 'support@gadgetzone.co.in',
    phone: '+91 98765 43218',
    upiId: 'gadgetzone@paytm',
    city: 'Chennai',
    joinedDate: '2024-12-01T10:00:00Z',
  },
  {
    merchantId: 'm10',
    name: 'Trendz Wear Clothing',
    category: 'Clothing Store',
    ownerName: 'Karan Johar',
    email: 'contact@trendzwear.com',
    phone: '+91 98765 43219',
    upiId: 'trendzwear@paytm',
    city: 'Jaipur',
    joinedDate: '2025-05-01T10:30:00Z',
  },
];

// Price spread and AOV configurations by category
const categoryPricing = {
  'Grocery Store': { min: 80, max: 2500, skewType: 'low-mid' },
  'Restaurant': { min: 120, max: 1500, skewType: 'mid' },
  'Medical Store': { min: 40, max: 3000, skewType: 'low' },
  'Electronics Store': { min: 5000, max: 75000, skewType: 'high' },
  'Clothing Store': { min: 400, max: 8000, skewType: 'mid-high' },
};

const paymentModes = ['UPI', 'Paytm Wallet', 'Net Banking', 'Debit Card', 'Credit Card'];
const paymentModeWeights = [0.60, 0.25, 0.03, 0.02, 0.10]; // 85% Mobile payments typical of Paytm QR

// Helper to pick item based on weights
function weightedRandom<T>(items: T[], weights: number[]): T {
  let r = Math.random();
  for (let i = 0; i < weights.length; i++) {
    if (r < weights[i]) return items[i];
    r -= weights[i];
  }
  return items[items.length - 1];
}

// Generate random integer in range [min, max]
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate skewed amount
function getAmount(category: Merchant['category']): number {
  const config = categoryPricing[category];
  const r = Math.random();
  
  if (config.skewType === 'high') {
    // Mostly low frequency high value, e.g. 5000 to 75000
    if (r < 0.70) return randInt(5000, 18000);
    if (r < 0.95) return randInt(18000, 45000);
    return randInt(45000, 75000);
  }
  if (config.skewType === 'low') {
    // Medical store: lots of small bills, occasional large ones
    if (r < 0.80) return randInt(40, 400);
    if (r < 0.97) return randInt(400, 1500);
    return randInt(1500, 3000);
  }
  if (config.skewType === 'low-mid') {
    // Grocery: fairly distributed with bias to smaller shops
    if (r < 0.60) return randInt(80, 600);
    if (r < 0.90) return randInt(600, 1500);
    return randInt(1500, 2500);
  }
  // Restaurants/Clothing: standard spread
  if (r < 0.50) return randInt(config.min, Math.round(config.max * 0.4));
  return randInt(Math.round(config.max * 0.4), config.max);
}

// Generate transaction status
function getTxnStatus(): 'SUCCESS' | 'FAILED' | 'PENDING' {
  const r = Math.random();
  if (r < 0.94) return 'SUCCESS';
  if (r < 0.98) return 'FAILED';
  return 'PENDING';
}

function generateData() {
  const transactions: Transaction[] = [];
  const settlements: Settlement[] = [];

  // Generate Customer Pool (e.g. 800 unique customers for all merchants)
  const customers: string[] = [];
  for (let i = 1; i <= 850; i++) {
    customers.push(`cust_${1000 + i}`);
  }

  // Define date range: last 30 days from June 6, 2026.
  // Start: May 7, 2026, End: June 6, 2026
  const startDate = new Date('2026-05-07T00:00:00Z');
  const endDate = new Date('2026-06-06T23:59:59Z');
  const msInDay = 24 * 60 * 60 * 1000;
  
  let txnCounter = 1;
  let settlementCounter = 1;

  // Track customer assignments to simulate customer retention per merchant
  const merchantCustomerPool: { [merchantId: string]: string[] } = {};
  merchants.forEach(m => {
    const size = randInt(100, 220);
    const pool: string[] = [];
    for (let i = 0; i < size; i++) {
      pool.push(customers[randInt(0, customers.length - 1)]);
    }
    merchantCustomerPool[m.merchantId] = pool;
  });

  // Loop through each day
  const daysCount = 30;
  
  for (let d = 0; d < daysCount; d++) {
    const currentDayTime = startDate.getTime() + d * msInDay;
    const currentDayDate = new Date(currentDayTime);
    const dayOfWeek = currentDayDate.getUTCDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // For each merchant, generate transactions for this day
    merchants.forEach(merchant => {
      // Determine transaction frequency multiplier based on category and day
      let dayMultiplier = 1.0;
      if (merchant.category === 'Grocery Store' && isWeekend) {
        dayMultiplier = 2.0;
      } else if (merchant.category === 'Restaurant') {
        dayMultiplier = isWeekend ? 1.8 : 0.9;
      } else if (merchant.category === 'Clothing Store') {
        dayMultiplier = isWeekend ? 2.5 : 0.8;
      } else if (merchant.category === 'Electronics Store') {
        dayMultiplier = isWeekend ? 1.4 : 0.7;
      } else if (merchant.category === 'Medical Store') {
        dayMultiplier = 1.0; // Steady
      }

      // Base transaction volume per day
      let baseVolume = 0;
      if (merchant.category === 'Grocery Store') baseVolume = randInt(20, 35);
      else if (merchant.category === 'Restaurant') baseVolume = randInt(25, 45);
      else if (merchant.category === 'Medical Store') baseVolume = randInt(15, 25);
      else if (merchant.category === 'Electronics Store') baseVolume = randInt(2, 6);
      else if (merchant.category === 'Clothing Store') baseVolume = randInt(8, 16);

      const dailyTxnVolume = Math.round(baseVolume * dayMultiplier);
      const dailySuccessTxns: Transaction[] = [];

      for (let t = 0; t < dailyTxnVolume; t++) {
        // Generate hour of day based on category pattern
        let hour = 12;
        const roll = Math.random();

        if (merchant.category === 'Restaurant') {
          // Lunch spike: 12-14, Dinner spike: 19-22
          if (roll < 0.20) hour = randInt(12, 13);
          else if (roll < 0.80) hour = randInt(19, 21);
          else hour = randInt(9, 23);
        } else if (merchant.category === 'Medical Store') {
          // Morning spike: 8-11, Evening: 17-20
          if (roll < 0.45) hour = randInt(8, 11);
          else if (roll < 0.85) hour = randInt(17, 20);
          else hour = randInt(6, 23);
        } else if (merchant.category === 'Grocery Store') {
          if (roll < 0.30) hour = randInt(10, 13);
          else if (roll < 0.80) hour = randInt(16, 20);
          else hour = randInt(8, 22);
        } else if (merchant.category === 'Electronics Store') {
          hour = randInt(11, 19);
        } else { // Clothing
          if (roll < 0.80) hour = randInt(15, 20);
          else hour = randInt(11, 21);
        }

        const minute = randInt(0, 59);
        const second = randInt(0, 59);
        const txnTime = new Date(currentDayTime);
        txnTime.setUTCHours(hour, minute, second);

        // Make sure timestamp doesn't exceed final date
        if (txnTime.getTime() > endDate.getTime()) continue;

        // Choose customer (some chance of new customer vs repeat)
        let customerId = '';
        if (Math.random() < 0.65) {
          const pool = merchantCustomerPool[merchant.merchantId];
          customerId = pool[randInt(0, pool.length - 1)];
        } else {
          customerId = customers[randInt(0, customers.length - 1)];
        }

        const amount = getAmount(merchant.category);

        const txn: Transaction = {
          txnId: `TXN${String(txnCounter++).padStart(7, '0')}`,
          merchantId: merchant.merchantId,
          customerId,
          amount: Number(amount.toFixed(2)),
          timestamp: txnTime.toISOString(),
          paymentMode: weightedRandom(paymentModes, paymentModeWeights),
          status: getTxnStatus(),
        };

        transactions.push(txn);

        if (txn.status === 'SUCCESS') {
          dailySuccessTxns.push(txn);
        }
      }

      // Generate Settlements for this day's SUCCESS transactions
      if (dailySuccessTxns.length > 0) {
        const totalSettlementAmount = dailySuccessTxns.reduce((sum, t) => sum + t.amount, 0);
        const txnIds = dailySuccessTxns.map(t => t.txnId);

        // Initiation is next morning at 06:00:00
        const initiationDate = new Date(currentDayTime + msInDay);
        initiationDate.setUTCHours(6, 0, 0, 0);

        let delayChance = 0.05;
        let failChance = 0.01;
        
        // Simulating higher settlement risks for m8 and m9
        if (merchant.merchantId === 'm9' || merchant.merchantId === 'm8') {
          delayChance = 0.18;
          failChance = 0.04;
        } else if (merchant.merchantId === 'm3' || merchant.merchantId === 'm4') {
          delayChance = 0.02;
          failChance = 0.005;
        }

        let settlementStatus: Settlement['status'] = 'SETTLED';
        let settledTime: string | null = null;
        let bankRefNo: string | null = null;

        const rollStatus = Math.random();
        const isLastDay = (d === daysCount - 1);

        if (isLastDay) {
          settlementStatus = 'PENDING';
          settledTime = null;
          bankRefNo = null;
        } else if (rollStatus < failChance) {
          settlementStatus = 'FAILED';
          settledTime = null;
          bankRefNo = null;
        } else if (rollStatus < failChance + delayChance) {
          settlementStatus = 'DELAYED';
          const delayHrs = randInt(25, 48);
          const settledDate = new Date(initiationDate.getTime() + delayHrs * 60 * 60 * 1000);
          settledTime = settledDate.toISOString();
          bankRefNo = `REF${randInt(100000, 999999)}BRN`;
        } else {
          settlementStatus = 'SETTLED';
          const delayMins = randInt(30, 180);
          const settledDate = new Date(initiationDate.getTime() + delayMins * 60 * 1000);
          settledTime = settledDate.toISOString();
          bankRefNo = `REF${randInt(100000, 999999)}BRN`;
        }

        settlements.push({
          settlementId: `SET${String(settlementCounter++).padStart(5, '0')}`,
          merchantId: merchant.merchantId,
          amount: Number(totalSettlementAmount.toFixed(2)),
          txnIds,
          status: settlementStatus,
          initiatedTime: initiationDate.toISOString(),
          settledTime,
          bankRefNo,
        });
      }
    });
  }

  // Ensure directories exist
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write files
  fs.writeFileSync(path.join(dataDir, 'merchants.json'), JSON.stringify(merchants, null, 2));
  fs.writeFileSync(path.join(dataDir, 'transactions.json'), JSON.stringify(transactions, null, 2));
  fs.writeFileSync(path.join(dataDir, 'settlements.json'), JSON.stringify(settlements, null, 2));

  console.log(`Successfully generated:`);
  console.log(`- ${merchants.length} Merchants`);
  console.log(`- ${transactions.length} Transactions`);
  console.log(`- ${settlements.length} Settlements`);
}

generateData();
