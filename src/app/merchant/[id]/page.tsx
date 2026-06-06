import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { getMerchantDashboardData } from '@/lib/data';
import MerchantDashboardClient from '@/components/MerchantDashboardClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MerchantPage({ params }: PageProps) {
  const { id } = await params;
  const dashboardData = getMerchantDashboardData(id);

  if (!dashboardData) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto h-screen">
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 mb-6 flex flex-col items-center">
          <AlertCircle className="h-12 w-12 mb-3" />
          <h2 className="text-xl font-bold">Merchant Not Found</h2>
          <p className="text-sm text-slate-400 mt-1">
            The requested merchant with ID <code className="text-rose-300 font-semibold font-mono">"{id}"</code> could not be located in our dataset.
          </p>
        </div>
        <Link 
          href="/" 
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white rounded-xl text-sm font-semibold transition-all shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portal
        </Link>
      </main>
    );
  }

  return <MerchantDashboardClient data={dashboardData} />;
}
