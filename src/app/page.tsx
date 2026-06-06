import Link from 'next/link';
import { getMerchants, getTransactions } from '@/lib/data';
import { Store, Utensils, Activity, Smartphone, Shirt } from 'lucide-react';

export default function Home() {
  const merchants = getMerchants();

  const merchantsWithMetrics = merchants.map(m => {
    const txns = getTransactions(m.merchantId).filter(t => t.status === 'SUCCESS');
    const totalRevenue = txns.reduce((sum, t) => sum + t.amount, 0);
    const count = txns.length;
    return {
      ...m,
      totalRevenue,
      txnCount: count,
    };
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Grocery Store':
        return <Store className="h-5 w-5 text-[#1F8A4C]" />;
      case 'Restaurant':
        return <Utensils className="h-5 w-5 text-[#C77A12]" />;
      case 'Medical Store':
        return <Activity className="h-5 w-5 text-[#D63B3B]" />;
      case 'Electronics Store':
        return <Smartphone className="h-5 w-5 text-[#3199E4]" />;
      case 'Clothing Store':
        return <Shirt className="h-5 w-5 text-[#577FCB]" />;
      default:
        return <Store className="h-5 w-5 text-[#002970]" />;
    }
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Grocery Store':
        return 'bg-[#E4F6EC] text-[#1F8A4C] border-[#1F8A4C]/10';
      case 'Restaurant':
        return 'bg-[#FCF1DD] text-[#C77A12] border-[#C77A12]/10';
      case 'Medical Store':
        return 'bg-[#FCE7E7] text-[#D63B3B] border-[#D63B3B]/10';
      case 'Electronics Store':
        return 'bg-[#E2F0FC] text-[#3199E4] border-[#3199E4]/10';
      case 'Clothing Store':
        return 'bg-[#EEFAFE] text-[#577FCB] border-[#577FCB]/10';
      default:
        return 'bg-[#F0F2F5] text-[#36404F] border-slate-200';
    }
  };

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-[#F5F7FA]">
      {/* Authentic Paytm App Header Gradient Banner */}
      <div className="bg-gradient-to-b from-[#98B9D8] to-[#2480D6] py-12 px-4 sm:px-6 lg:px-8 text-center text-white relative">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Paytm Wordmark Logo representation */}
          <div className="flex items-center gap-1.5 mb-4 select-none">
            <span className="text-3xl font-extrabold tracking-tight text-white">Pay</span>
            <span className="text-3xl font-light tracking-tight text-[#00BAF2]">tm</span>
            <span className="text-sm font-bold bg-white/20 px-2 py-0.5 rounded ml-2 border border-white/10 uppercase tracking-widest text-xs">
              Business
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Merchant Intelligence Portal
          </h1>
          <p className="text-sm text-white/90 max-w-xl font-medium leading-relaxed">
            AI-Powered Operations, Settlement Forecasting, and Decision Support
          </p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-6">
          <span className="h-2 w-2 rounded-full bg-[#00BAF2] animate-pulse"></span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#5A6473]">
            Select Merchant Account
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {merchantsWithMetrics.map(merchant => (
            <Link
              key={merchant.merchantId}
              href={`/merchant/${merchant.merchantId}`}
              className="group bg-white rounded-[10px] p-5 pt-card transition-all duration-200 border border-slate-100/40 hover:border-[#3199E4]/40 hover:-translate-y-0.5 hover:shadow-md"
              id={`merchant-link-${merchant.merchantId}`}
            >
              {/* Card Head */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#F0F2F5] border border-slate-200/60 group-hover:bg-[#E2F0FC] transition-colors">
                    {getCategoryIcon(merchant.category)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0A0E1A] text-[15px] group-hover:text-[#3199E4] transition-colors line-clamp-1">
                      {merchant.name}
                    </h3>
                    <p className="text-xs text-[#5A6473] font-medium">{merchant.city}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getCategoryStyles(merchant.category)}`}>
                  {merchant.category}
                </span>
              </div>

              {/* Owner and Details */}
              <div className="space-y-1.5 text-xs text-[#5A6473] font-medium">
                <p className="flex justify-between">
                  <span>Owner Name:</span>
                  <span className="text-[#0A0E1A] font-semibold">{merchant.ownerName}</span>
                </p>
                <p className="flex justify-between">
                  <span>Joined Date:</span>
                  <span className="text-[#7E8794]">
                    {new Date(merchant.joinedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                  </span>
                </p>
              </div>

              <div className="my-4 border-t border-[#F0F2F5]"></div>

              {/* Aggregates Preview */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#FAFBFC] border border-[#F0F2F5] rounded-[5px] p-2 text-center">
                  <span className="text-[9px] text-[#7E8794] font-semibold uppercase tracking-wider">30D Collection</span>
                  <p className="text-sm font-bold text-[#0A0E1A] mt-0.5 tnum">
                    ₹{merchant.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="bg-[#FAFBFC] border border-[#F0F2F5] rounded-[5px] p-2 text-center">
                  <span className="text-[9px] text-[#7E8794] font-semibold uppercase tracking-wider">Success Scans</span>
                  <p className="text-sm font-bold text-[#0A0E1A] mt-0.5 tnum">{merchant.txnCount}</p>
                </div>
              </div>

              {/* Card Action Link */}
              <div className="mt-4 flex items-center justify-end text-xs text-[#3199E4] font-bold group-hover:text-[#2480D6] transition-colors gap-1">
                View Business Dashboard
                <span className="transform translate-x-0 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="text-center text-[10px] font-bold text-[#7E8794] py-8 border-t border-[#E6E9EE] uppercase tracking-wider bg-white mt-12">
        Paytm AI Design Extension &bull; 100% Secure Merchant Platform
      </footer>
    </main>
  );
}
