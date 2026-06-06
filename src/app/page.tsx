import Link from 'next/link';
import { getMerchants, getTransactions } from '@/lib/data';
import { Store, Utensils, Activity, Smartphone, Shirt } from 'lucide-react';

export default function Home() {
  const merchants = getMerchants();

  // Pre-calculate revenue previews for each merchant
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

  // Helper to select icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Grocery Store':
        return <Store className="h-5 w-5 text-emerald-400" />;
      case 'Restaurant':
        return <Utensils className="h-5 w-5 text-orange-400" />;
      case 'Medical Store':
        return <Activity className="h-5 w-5 text-rose-400" />;
      case 'Electronics Store':
        return <Smartphone className="h-5 w-5 text-cyan-400" />;
      case 'Clothing Store':
        return <Shirt className="h-5 w-5 text-amber-400" />;
      default:
        return <Store className="h-5 w-5 text-blue-400" />;
    }
  };

  // Helper to select style classes for category badges
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Grocery Store':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Restaurant':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Medical Store':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Electronics Store':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Clothing Store':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center">
      {/* Header section */}
      <div className="text-center mb-12 animate-float">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-brand-cyan mb-4 tracking-wide font-medium uppercase glow-border">
          <span className="h-2 w-2 rounded-full bg-brand-cyan animate-pulse"></span>
          Paytm Business Solutions
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-brand-cyan to-brand-teal bg-clip-text text-transparent mb-4">
          Paytm Merchant Intelligence Copilot
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
          Unlock the power of your transactional data. Get daily recaps, settlement risk scoring, peak hour mapping, and an AI copilot to grow your business.
        </p>
      </div>

      {/* Grid selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {merchantsWithMetrics.map(merchant => (
          <Link
            key={merchant.merchantId}
            href={`/merchant/${merchant.merchantId}`}
            className="group flex flex-col rounded-2xl glass-panel p-6"
            id={`merchant-link-${merchant.merchantId}`}
          >
            {/* Merchant Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-brand-cyan/40 transition-colors">
                  {getCategoryIcon(merchant.category)}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg group-hover:text-brand-cyan transition-colors line-clamp-1">
                    {merchant.name}
                  </h3>
                  <p className="text-xs text-slate-400">{merchant.city}</p>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${getCategoryStyles(merchant.category)}`}>
                {merchant.category}
              </span>
            </div>

            {/* Merchant info details */}
            <div className="mt-2 space-y-1 text-sm text-slate-400 flex-1">
              <p className="flex justify-between">
                <span>Owner:</span>
                <span className="text-slate-200 font-medium">{merchant.ownerName}</span>
              </p>
              <p className="flex justify-between">
                <span>Joined Date:</span>
                <span className="text-slate-350">{new Date(merchant.joinedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}</span>
              </p>
            </div>

            <div className="my-5 border-t border-slate-800/80"></div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-2.5 text-center">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">30D Revenue</p>
                <p className="text-sm font-bold text-slate-100 mt-0.5">₹{merchant.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-2.5 text-center">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Transactions</p>
                <p className="text-sm font-bold text-slate-100 mt-0.5">{merchant.txnCount}</p>
              </div>
            </div>

            {/* Action text */}
            <div className="mt-4 flex items-center justify-end text-xs text-brand-cyan font-semibold group-hover:text-brand-teal transition-colors gap-1">
              Analyze Merchant Dashboard
              <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
          </Link>
        ))}
      </div>

      <footer className="text-center text-xs text-slate-500 mt-6 border-t border-slate-900 pt-6">
        Paytm Merchant Intelligence Copilot &bull; Hackathon MVP Edition
      </footer>
    </main>
  );
}
