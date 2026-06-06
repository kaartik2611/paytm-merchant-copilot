export interface Merchant {
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

export interface Transaction {
  txnId: string;
  merchantId: string;
  customerId: string;
  amount: number;
  timestamp: string; // ISO string
  paymentMode: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface Settlement {
  settlementId: string;
  merchantId: string;
  amount: number;
  txnIds: string[];
  status: 'SETTLED' | 'PENDING' | 'DELAYED' | 'FAILED';
  initiatedTime: string; // ISO string
  settledTime: string | null; // ISO string
  bankRefNo: string | null;
}
