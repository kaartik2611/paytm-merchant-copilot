'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Store, Utensils, Activity, Smartphone, Shirt, 
  IndianRupee, TrendingUp, TrendingDown, Users, AlertTriangle, 
  Clock, FileText, Send, Sparkles, ShieldAlert,
  Loader2, ClipboardCheck, Calendar, CreditCard, ActivityIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, PieChart, Pie, Cell, Legend, CartesianGrid, LineChart, Line
} from 'recharts';
import { MerchantDashboardData } from '@/lib/data';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export default function MerchantDashboardClient({ data }: { data: MerchantDashboardData }) {
  const { merchant, revenue, peakHours, customers, settlements, forecast, monthlyReview, latestDailyRecap } = data;
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue-forecast' | 'peak-payments' | 'customers' | 'settlements' | 'recaps' | 'copilot'>('overview');
  const [mounted, setMounted] = useState(false);

  // Daily Recap state
  const [selectedRecapDate, setSelectedRecapDate] = useState(latestDailyRecap.date);
  const [recapLoading, setRecapLoading] = useState(false);
  const [dailyRecapData, setDailyRecapData] = useState(latestDailyRecap);

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `### Welcome to your **Paytm Merchant Intelligence Copilot** 🚀\n\nI have analyzed your digital transaction records for **${merchant.name}** for the last 30 days.\n\nYou can ask me questions about your revenue forecasting, operational health score, peak transaction hours, customer retention rates, or bank settlement status. Try one of the quick questions below!`
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const availableRecapDates = revenue.dailyTrends.slice(-10).map(t => t.date).reverse();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle switching date for Daily Recap
  const handleDateChange = (date: string) => {
    setSelectedRecapDate(date);
    setRecapLoading(true);
    
    fetch(`/api/recap?merchantId=${merchant.merchantId}&date=${date}`)
      .then(res => res.json())
      .then(resData => {
        setDailyRecapData(resData.recap);
        setRecapLoading(false);
      })
      .catch(err => {
        console.error(err);
        setRecapLoading(false);
      });
  };

  // Chat submit handler
  const handleSendChat = async (text: string) => {
    if (!text.trim() || chatLoading) return;
    
    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      text
    };

    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId: merchant.merchantId,
          prompt: text,
          history: chatHistory
        })
      });

      const resData = await res.json();
      
      if (resData.answer) {
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          role: 'model',
          text: resData.answer
        }]);
      } else {
        throw new Error('No answer received');
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        role: 'model',
        text: '⚠️ **Copilot Error**: I experienced an issue communicating with the AI brain. Please check that your API key is correctly configured, or try again later.'
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Helper to select icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Grocery Store':
        return <Store className="h-6 w-6 text-emerald-400" />;
      case 'Restaurant':
        return <Utensils className="h-6 w-6 text-orange-400" />;
      case 'Medical Store':
        return <Activity className="h-6 w-6 text-rose-400" />;
      case 'Electronics Store':
        return <Smartphone className="h-6 w-6 text-cyan-400" />;
      case 'Clothing Store':
        return <Shirt className="h-6 w-6 text-amber-400" />;
      default:
        return <Store className="h-6 w-6 text-blue-400" />;
    }
  };

  // Segment colors for Pie Chart
  const PAYMENT_COLORS = ['#00b9f5', '#00d2c4', '#6366f1', '#f59e0b', '#ec4899'];
  const CUSTOMER_COLORS = ['#34d399', '#60a5fa', '#fbbf24', '#f87171'];

  // Prepare Forecast Overlay Chart Data
  // Combine historical dailyTrends (last 10 days) and forecast (7 days)
  const last10DaysTrends = revenue.dailyTrends.slice(-12).map(t => ({
    date: t.date.substring(8, 10) + ' ' + new Date(t.date).toLocaleDateString('en-IN', { month: 'short' }),
    actual: t.revenue,
    forecast: null
  }));

  const forecastTrends = forecast.map(f => ({
    date: f.date.substring(8, 10) + ' ' + new Date(f.date).toLocaleDateString('en-IN', { month: 'short' }) + ' (F)',
    actual: null,
    forecast: f.revenue
  }));

  // Create transition point so the forecast line connects to the last actual point
  if (last10DaysTrends.length > 0 && forecastTrends.length > 0) {
    forecastTrends.unshift({
      date: last10DaysTrends[last10DaysTrends.length - 1].date,
      actual: null,
      forecast: last10DaysTrends[last10DaysTrends.length - 1].actual
    });
  }

  const combinedForecastChartData = [...last10DaysTrends, ...forecastTrends];

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                {getCategoryIcon(merchant.category)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  {merchant.name}
                  <span className="text-xs px-2 py-0.5 rounded bg-brand-blue/30 border border-brand-cyan/20 text-brand-cyan uppercase font-semibold">
                    {merchant.category}
                  </span>
                </h1>
                <p className="text-xs text-slate-400 flex items-center gap-3">
                  <span>Owner: <strong className="text-slate-300">{merchant.ownerName}</strong></span>
                  <span>&bull;</span>
                  <span>UPI ID: <strong className="text-slate-300">{merchant.upiId}</strong></span>
                  <span>&bull;</span>
                  <span>City: <strong className="text-slate-300">{merchant.city}</strong></span>
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('copilot')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg",
              activeTab === 'copilot'
                ? "bg-brand-cyan text-slate-950 glow-border"
                : "bg-slate-900 border border-slate-800 hover:border-brand-cyan/40 text-brand-cyan hover:text-white"
            )}
          >
            <Sparkles className="h-4 w-4" />
            Ask Copilot
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <section className="bg-slate-950/40 border-b border-slate-900 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex overflow-x-auto gap-2 py-1 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: Store },
            { id: 'revenue-forecast', label: 'Revenue & Forecasting', icon: TrendingUp },
            { id: 'peak-payments', label: 'Peak Hours & Payments', icon: Clock },
            { id: 'customers', label: 'Customer Visit Patterns', icon: Users },
            { id: 'settlements', label: 'Settlement Intelligence', icon: ShieldAlert },
            { id: 'recaps', label: 'Recaps & Reviews', icon: FileText },
            { id: 'copilot', label: 'AI Copilot Chat', icon: Sparkles },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/35"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              
              {/* Card 1: Revenue */}
              <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group col-span-1 xl:col-span-2">
                <div className="absolute top-0 right-0 p-4 opacity-15 group-hover:opacity-30 transition-opacity">
                  <IndianRupee className="h-12 w-12 text-brand-cyan" />
                </div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">30D Revenue</h4>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-2xl font-extrabold text-white">₹{revenue.totalRevenue.toLocaleString()}</span>
                  <span className={cn(
                    "text-[10px] font-bold px-1 rounded flex items-center gap-0.5",
                    revenue.growthPercentage >= 0 ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"
                  )}>
                    {revenue.growthPercentage >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {Math.abs(revenue.growthPercentage)}%
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">Previous Period: ₹{Math.round(revenue.totalRevenue / (1 + (revenue.growthPercentage / 100))).toLocaleString()}</p>
              </div>

              {/* Card 2: Transactions */}
              <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-15 group-hover:opacity-30 transition-opacity">
                  <ActivityIcon className="h-12 w-12 text-brand-cyan" />
                </div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Scans</h4>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-extrabold text-white">{revenue.successTxnCount}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1 rounded ml-1">SUCCESS</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">Failed: {revenue.failedTxnCount} ({((revenue.failedTxnCount / (revenue.successTxnCount + revenue.failedTxnCount)) * 100).toFixed(1)}%)</p>
              </div>

              {/* Card 3: AOV */}
              <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-15 group-hover:opacity-30 transition-opacity">
                  <IndianRupee className="h-12 w-12 text-brand-teal" />
                </div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Average Ticket</h4>
                <p className="text-2xl font-extrabold text-white mt-2">₹{revenue.averageOrderValue}</p>
                <p className="text-[10px] text-slate-500 mt-2">Per digital scanner scan</p>
              </div>

              {/* Card 4: Repeat Visits */}
              <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-15 group-hover:opacity-30 transition-opacity">
                  <Users className="h-12 w-12 text-brand-teal" />
                </div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Repeat Scanners</h4>
                <p className="text-2xl font-extrabold text-white mt-2">{customers.repeatCustomerRate}%</p>
                <p className="text-[10px] text-slate-500 mt-2">Repeat visit customers rate</p>
              </div>

              {/* Card 5: Health Score */}
              <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-15 group-hover:opacity-30 transition-opacity">
                  <Sparkles className="h-12 w-12 text-brand-orange animate-pulse" />
                </div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Health Index</h4>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-extrabold text-white">{revenue.healthScore}</span>
                  <span className={cn(
                    "text-[8px] font-extrabold px-1 rounded uppercase tracking-wider",
                    revenue.healthLevel === 'EXCELLENT' ? 'text-emerald-400 bg-emerald-500/10' :
                    revenue.healthLevel === 'GOOD' ? 'text-brand-cyan bg-brand-cyan/10' :
                    revenue.healthLevel === 'NEEDS_ATTENTION' ? 'text-amber-400 bg-amber-500/10' :
                    'text-rose-400 bg-rose-500/10'
                  )}>
                    {revenue.healthLevel}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">Operational pipeline rating</p>
              </div>

            </div>

            {/* Middle Section: Health Score gauge and Daily Recap */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Daily recap */}
              <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-brand-cyan" />
                    Daily Operations Summary ({latestDailyRecap.date})
                  </h3>
                  <button 
                    onClick={() => setActiveTab('recaps')} 
                    className="text-xs text-brand-cyan hover:underline font-semibold"
                  >
                    View History
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-5">
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-900">
                    <span className="text-[10px] text-slate-500 uppercase">Gross Scans</span>
                    <p className="text-base font-bold text-slate-200 mt-0.5">₹{latestDailyRecap.revenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-900">
                    <span className="text-[10px] text-slate-500 uppercase">Total Counts</span>
                    <p className="text-base font-bold text-slate-200 mt-0.5">{latestDailyRecap.transactionsCount} payments</p>
                  </div>
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-900">
                    <span className="text-[10px] text-slate-500 uppercase">Popular Mode</span>
                    <p className="text-xs font-bold text-slate-250 mt-1 truncate" title={latestDailyRecap.dominantPaymentMode}>
                      {latestDailyRecap.dominantPaymentMode}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {latestDailyRecap.insights.map((insight, idx) => (
                    <li key={idx} className="text-xs text-slate-350 flex items-start gap-2">
                      <span className="text-brand-cyan mt-1">&bull;</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Health Score and Delay warnings */}
              <div className="glass-panel rounded-2xl p-6 bg-gradient-to-br from-brand-blue/15 to-slate-950/65 border-brand-cyan/15 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mb-3">
                    <ShieldAlert className="h-4 w-4 text-brand-cyan" />
                    Settlement Status Warnings
                  </h3>
                  
                  {settlements.delayPredictions.length > 0 ? (
                    <div className="space-y-3 mt-2">
                      {settlements.delayPredictions.map((pred, idx) => (
                        <div key={idx} className="bg-slate-950/80 border border-slate-900 rounded-xl p-3 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-rose-400">⚠️ Risk of delay: {pred.settlementId}</span>
                            <span className="text-[10px] font-bold text-slate-400">{pred.pendingHours}h pending</span>
                          </div>
                          <p className="text-slate-300 mt-1">Payout sum: **₹{pred.amount.toLocaleString()}**</p>
                          <p className="text-[10px] text-slate-500 mt-2">Exceeds standard 24-hour T+1 batch clearance timing.</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-4 text-center mt-2 text-xs text-slate-400">
                      ✓ All settlements are clearing normally. Delay predictions index is clean.
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveTab('settlements')}
                  className="text-xs text-brand-cyan hover:underline font-semibold mt-4 text-left flex items-center gap-1"
                >
                  Manage Payouts Pipeline &rarr;
                </button>
              </div>

            </div>

            {/* Quick Charts */}
            {mounted && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 30D daily trend area */}
                <div className="glass-panel rounded-2xl p-6">
                  <h3 className="text-base font-bold text-white mb-4">30-Day Revenue Trend</h3>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenue.dailyTrends}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00b9f5" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#00b9f5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickFormatter={(val) => val.substring(8, 10)} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                        <Area type="monotone" dataKey="revenue" stroke="#00b9f5" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue (₹)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Peak Hours distribution */}
                <div className="glass-panel rounded-2xl p-6">
                  <h3 className="text-base font-bold text-white mb-4">Hourly Traffic Distribution</h3>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={peakHours.hourlyStats}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `${val}h`} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                        <Bar dataKey="revenue" name="Volume (₹)">
                          {peakHours.hourlyStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.hour === peakHours.peakHours[0] ? '#ff5d24' : '#00d2c4'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REVENUE & FORECASTING */}
        {activeTab === 'revenue-forecast' && (
          <div className="space-y-8 animate-fade-in">
            {/* Forecast callouts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel rounded-2xl p-6 border-brand-cyan/20 bg-gradient-to-br from-brand-blue/10 to-transparent">
                <Sparkles className="h-8 w-8 text-brand-cyan mb-3" />
                <h4 className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Predicted 7-Day Cumulative Intake</h4>
                <p className="text-2xl font-bold text-white mt-1">
                  ₹{Math.round(forecast.reduce((sum, f) => sum + f.revenue, 0)).toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-1">Based on rolling seasonal projections</p>
              </div>
              <div className="glass-panel rounded-2xl p-6">
                <TrendingUp className="h-8 w-8 text-brand-teal mb-3" />
                <h4 className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Expected Growth Trend</h4>
                <p className="text-2xl font-bold text-white mt-1">
                  {revenue.growthPercentage >= 0 ? '+' : ''}{revenue.growthPercentage}%
                </p>
                <p className="text-xs text-slate-400 mt-1">Growth rate compared to previous period</p>
              </div>
              <div className="glass-panel rounded-2xl p-6">
                <IndianRupee className="h-8 w-8 text-slate-450 mb-3" />
                <h4 className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Baseline Daily Intake</h4>
                <p className="text-2xl font-bold text-white mt-1">
                  ₹{Math.round(revenue.totalRevenue / 30).toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-1">Median daily average over 30 days</p>
              </div>
            </div>

            {/* Line chart with historical actuals + forecast overlay */}
            {mounted && (
              <div className="glass-panel rounded-2xl p-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-brand-cyan" />
                    Revenue Projections & Forecast (Next 7 Days)
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Historical actual revenue is represented in <span className="text-brand-cyan font-semibold">Solid Cyan</span>. The projected forecast overlay is represented in <span className="text-brand-teal font-semibold">Dashed Cyan</span>.
                  </p>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={combinedForecastChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                      <Line type="monotone" dataKey="actual" stroke="#00b9f5" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Actual Revenue (₹)" connectNulls />
                      <Line type="monotone" dataKey="forecast" stroke="#00d2c4" strokeDasharray="5 5" strokeWidth={3} dot={{ r: 2 }} name="Forecasted Revenue (₹)" connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PEAK HOURS & PAYMENTS */}
        {activeTab === 'peak-payments' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            {/* Peak Hours distribution */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">Detailed Hourly Performance</h3>
              <p className="text-xs text-slate-400 mb-6">Identify busy slots to optimize cashier staff and Soundbox volume settings</p>
              
              {mounted && (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={peakHours.hourlyStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `${val}:00`} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                      <Bar dataKey="revenue" name="Revenue (₹)">
                        {peakHours.hourlyStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.hour === peakHours.peakHours[0] ? '#ff5d24' : '#00b9f5'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="mt-4 p-3 bg-slate-950/50 rounded-xl border border-slate-900 text-xs text-slate-350">
                ⚠️ Your primary peak slot occurs around **{peakHours.peakHours[0]}:00** (**{peakHours.peakPeriodName}**). Keep a secondary Paytm QR sticker visible at the counter to decrease queues.
              </div>
            </div>

            {/* Payment Mode Mix Pie Chart */}
            <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Payment Mode Mix</h3>
                <p className="text-xs text-slate-400 mb-6">Checkout distribution across UPI, Paytm Wallet, Card, and Net Banking channels</p>

                {mounted && (
                  <div className="h-[250px] w-full flex justify-center mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenue.paymentModeShare}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="count"
                          nameKey="mode"
                        >
                          {revenue.paymentModeShare.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="space-y-2.5 mt-4">
                  {revenue.paymentModeShare.map((mode, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PAYMENT_COLORS[idx % PAYMENT_COLORS.length] }}></span>
                        <span className="text-slate-300 font-medium">{mode.mode}</span>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <span className="text-slate-400">{mode.count} scans</span>
                        <span className="text-slate-200 font-bold">₹{mode.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMER LOYALTY */}
        {activeTab === 'customers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            {/* Visit frequency segments */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">Customer Visit Frequencies</h3>
              <p className="text-xs text-slate-400 mb-6">Group customer identifiers by frequency of scan payments over the month</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase border-b border-slate-900">
                    <tr>
                      <th className="py-3 px-2">Visit Segment</th>
                      <th className="py-3 px-2 text-right">Customer Count</th>
                      <th className="py-3 px-2 text-right">Segment Share</th>
                      <th className="py-3 px-2 text-right">Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/40 text-xs">
                    {customers.segmentDistribution.map((seg, idx) => (
                      <tr key={idx} className="hover:bg-slate-950/30">
                        <td className="py-3.5 px-2 font-medium text-slate-200 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CUSTOMER_COLORS[idx % CUSTOMER_COLORS.length] }}></span>
                          {seg.segment}
                        </td>
                        <td className="py-3.5 px-2 text-right text-slate-350">{seg.count} unique</td>
                        <td className="py-3.5 px-2 text-right">
                          {((seg.count / customers.uniqueCustomers) * 100).toFixed(0)}%
                        </td>
                        <td className="py-3.5 px-2 text-right font-semibold text-white">₹{seg.totalSpend.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Loyalty and visit share */}
            <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Visit Share Distribution</h3>
                <p className="text-xs text-slate-400 mb-6">Distribution share of unique buyer wallets scanning your counters</p>

                {mounted && (
                  <div className="h-[250px] w-full flex justify-center mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={customers.visitFrequencyShare}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                          nameKey="name"
                        >
                          {customers.visitFrequencyShare.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CUSTOMER_COLORS[index % CUSTOMER_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-900 text-xs text-slate-350 mt-4">
                Repeat customer visit rate stands at **{customers.repeatCustomerRate}%**. {customers.repeatCustomerRate < 40 ? 'Setup a Paytm cashback coupon to reward subsequent payments and raise retention.' : 'Strong loyalty metrics! Keep verify soundbox responses active.'}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SETTLEMENTS */}
        {activeTab === 'settlements' && (
          <div className="space-y-8 animate-fade-in">
            {/* Settlement summary ledger */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass-panel rounded-2xl p-6 text-center border-slate-900">
                <span className="text-xs text-slate-500 uppercase font-semibold">Total Settled Balance</span>
                <p className="text-2xl font-bold text-emerald-400 mt-2">₹{settlements.totalSettledAmount.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">{settlements.settledCount} batch payouts</p>
              </div>
              <div className="glass-panel rounded-2xl p-6 text-center">
                <span className="text-xs text-slate-500 uppercase font-semibold">Pending Batch Balance</span>
                <p className="text-2xl font-bold text-amber-400 mt-2">₹{settlements.totalPendingAmount.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">{settlements.pendingCount} active batches</p>
              </div>
              <div className="glass-panel rounded-2xl p-6 text-center">
                <span className="text-xs text-slate-500 uppercase font-semibold">Settlement Delay Rate</span>
                <p className="text-2xl font-bold text-slate-100 mt-2">{settlements.delayRate}%</p>
                <p className="text-xs text-rose-400 mt-1">{settlements.delayedCount} delayed runs</p>
              </div>
              <div className="glass-panel rounded-2xl p-6 text-center">
                <span className="text-xs text-slate-500 uppercase font-semibold">Failed Payouts</span>
                <p className="text-2xl font-bold text-rose-500 mt-2">₹{settlements.totalFailedAmount.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">{settlements.failedCount} failures</p>
              </div>
            </div>

            {/* Risk Index & Payout Ledger */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between items-center text-center">
                <div className="w-full">
                  <h3 className="text-base font-bold text-white">Pipeline Risk Index</h3>
                  <p className="text-xs text-slate-400 mt-1">Computed via settlement failure and delays</p>
                </div>
                
                <div className="my-6 relative flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-8 border-slate-900 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-white">{settlements.riskScore}</span>
                    <span className="text-[10px] text-slate-500 uppercase mt-0.5">Risk Score</span>
                  </div>
                </div>

                <div>
                  <span className={cn(
                    "text-xs font-extrabold px-3 py-1 rounded-full border uppercase tracking-wider",
                    settlements.riskLevel === 'LOW' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' :
                    settlements.riskLevel === 'MEDIUM' ? 'text-amber-400 border-amber-500/20 bg-amber-500/10' :
                    'text-rose-400 border-rose-500/20 bg-rose-500/10'
                  )}>
                    {settlements.riskLevel} PIPELINE RISK
                  </span>
                  <p className="text-xs text-slate-450 mt-4 max-w-[200px] mx-auto leading-relaxed">
                    {settlements.riskScore > 30 
                      ? "Frequent bank clearing delays flagged. Consider toggling Instant Settlements." 
                      : "Payout pipeline clears normally. Settlements reach linked bank accounts within 1-3 hours."}
                  </p>
                </div>
              </div>

              {/* Settlement History List */}
              <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-4">Payout Ledger History</h3>
                <div className="overflow-y-auto max-h-[300px] pr-2 space-y-3">
                  {settlements.recentSettlements.map((sett, idx) => (
                    <div key={idx} className="bg-slate-950/50 border border-slate-900 rounded-xl p-3 flex justify-between items-center hover:border-slate-800 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-200">₹{sett.amount.toLocaleString()}</span>
                          <span className={cn(
                            "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase",
                            sett.status === 'SETTLED' ? 'bg-emerald-500/10 text-emerald-400' :
                            sett.status === 'DELAYED' ? 'bg-amber-500/10 text-amber-400' :
                            sett.status === 'PENDING' ? 'bg-cyan-500/10 text-cyan-400 animate-pulse' :
                            'bg-rose-500/10 text-rose-500'
                          )}>
                            {sett.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">ID: {sett.settlementId} &bull; Bank Ref: {sett.bankRefNo || 'None'}</p>
                      </div>
                      <div className="text-right text-[10px] text-slate-400">
                        <p>Initiated: {sett.initiatedTime.substring(0, 10)} 06:00</p>
                        <p className="text-slate-550 mt-0.5">Cleared: {sett.settledTime ? sett.settledTime.substring(11, 16) : '--:--'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: RECAPS & REVIEWS */}
        {activeTab === 'recaps' && (
          <div className="space-y-8 animate-fade-in">
            {/* Daily recap selector */}
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-brand-cyan" />
                    Daily Operations Recap
                  </h3>
                  <p className="text-xs text-slate-400">Compile operational summaries for any past transaction date</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Select Date:</span>
                  <select
                    value={selectedRecapDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="glass-input rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer"
                  >
                    {availableRecapDates.map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                  </select>
                </div>
              </div>

              {recapLoading ? (
                <div className="h-[200px] flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-brand-cyan animate-spin" />
                  <span className="ml-3 text-sm text-slate-400">Aggregating checkout logs...</span>
                </div>
              ) : (
                <div className="bg-slate-950/60 rounded-xl border border-slate-900 p-6">
                  <div className="flex justify-between items-start border-b border-slate-900 pb-4 mb-6">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Report for {dailyRecapData.date}</h4>
                      <p className="text-xs text-slate-500 mt-1">Generated by Paytm Merchant Intelligence Engine</p>
                    </div>
                    <button 
                      onClick={() => {
                        const reportText = `Daily Payout Recap (${dailyRecapData.date}) for ${merchant.name}\nRevenue: ₹${dailyRecapData.revenue}\nTransactions: ${dailyRecapData.transactionsCount}\nAvg Ticket: ₹${dailyRecapData.averageTicketSize}\nInsights:\n${dailyRecapData.insights.map(i => `- ${i}`).join('\n')}`;
                        navigator.clipboard.writeText(reportText);
                        alert('Recap copied to clipboard!');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white transition-all"
                    >
                      <ClipboardCheck className="h-3 w-3" />
                      Copy Recap
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="text-center p-4 rounded-lg bg-slate-950 border border-slate-900/60">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Today's Revenue</span>
                      <p className="text-xl font-bold text-white mt-1">₹{dailyRecapData.revenue.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-slate-950 border border-slate-900/60">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Successful Scans</span>
                      <p className="text-xl font-bold text-white mt-1">{dailyRecapData.transactionsCount}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-slate-950 border border-slate-900/60">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Average Scan Value</span>
                      <p className="text-xl font-bold text-white mt-1">₹{dailyRecapData.averageTicketSize.toFixed(0)}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-slate-950 border border-slate-900/60">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Dominant Payment</span>
                      <p className="text-sm font-bold text-slate-200 mt-2 truncate" title={dailyRecapData.dominantPaymentMode}>
                        {dailyRecapData.dominantPaymentMode}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Paytm Operations Insights</h5>
                    <ul className="space-y-3">
                      {dailyRecapData.insights.map((insight, idx) => (
                        <li key={idx} className="text-sm text-slate-350 flex items-start gap-2.5">
                          <span className="h-2 w-2 rounded-full bg-brand-cyan mt-1.5"></span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Monthly business review */}
            <div className="glass-panel rounded-2xl p-6 bg-gradient-to-br from-brand-blue/10 to-slate-950/60 border-slate-900">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-teal" />
                Monthly Business Review ({monthlyReview.monthName})
              </h3>
              <p className="text-xs text-slate-400 mb-6">Aggregated intelligence report mapping monthly milestones and actions</p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Milestones Compiled</h4>
                  <ul className="space-y-2.5">
                    {monthlyReview.insights.map((ins, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start gap-2.5">
                        <span className="text-brand-teal mt-1 font-bold">&bull;</span>
                        <span>{ins}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-slate-900 pt-6">
                  <h4 className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Paytm Growth Playbooks (Recommended Actions)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {monthlyReview.recommendations.map((rec, idx) => (
                      <div key={idx} className="bg-slate-950/80 border border-slate-900 rounded-xl p-4 flex flex-col justify-between">
                        <p className="text-xs text-slate-300 leading-relaxed font-light">{rec}</p>
                        <button
                          onClick={() => {
                            setActiveTab('copilot');
                            setMessages(prev => [...prev, {
                              id: Math.random().toString(),
                              role: 'user',
                              text: `How do I deploy this Paytm recommendation: "${rec}"?`
                            }]);
                            handleSendChat(`How do I deploy this Paytm recommendation: "${rec}"?`);
                          }}
                          className="text-xs text-brand-cyan hover:underline font-semibold mt-4 text-left flex items-center gap-1"
                        >
                          Instruct Copilot to draft strategy &rarr;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: AI COPILOT CHAT */}
        {activeTab === 'copilot' && (
          <div className="glass-panel rounded-2xl p-6 flex flex-col h-[600px] animate-fade-in relative">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <h3 className="text-sm font-semibold text-slate-200">Paytm Copilot Brain</h3>
              </div>
              <span className="text-[10px] text-brand-cyan font-bold bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded">
                Gemini-2.5-Flash Active
              </span>
            </div>

            {/* Messages box */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "flex flex-col max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                    msg.role === 'user' 
                      ? "ml-auto bg-brand-blue text-slate-100 border border-slate-800" 
                      : "bg-slate-950/80 border border-slate-900 text-slate-300"
                  )}
                >
                  <div className="space-y-2 whitespace-pre-wrap leading-relaxed font-light">
                    {msg.text.startsWith('###') ? (
                      <div>
                        <h4 className="font-bold text-white text-base border-b border-slate-900 pb-1.5 mb-2 flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-brand-cyan" />
                          {msg.text.split('\n')[0].replace('###', '').trim()}
                        </h4>
                        <p>{msg.text.split('\n').slice(1).join('\n')}</p>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="bg-slate-950/85 border border-slate-900 rounded-2xl px-4 py-3 text-sm max-w-[80%] flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-brand-cyan animate-spin" />
                  <span className="text-slate-400">Copilot is thinking...</span>
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div className="mb-4">
              <p className="text-[10px] text-slate-500 uppercase font-semibold mb-2">Suggested merchant queries</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Predict next week's sales", text: "What is my revenue forecast for next week?" },
                  { label: "Why is my health score down?", text: "Why is my merchant health score down?" },
                  { label: "What are my peak hours?", text: "What are my peak business hours?" },
                  { label: "Check settlement delays", text: "How is my settlement delay risk looking?" },
                ].map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChat(qp.text)}
                    disabled={chatLoading}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-brand-cyan/40 text-[11px] text-slate-350 hover:text-brand-cyan transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs footer */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat(chatInput);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Copilot: 'What is my revenue forecast for next week?'"
                disabled={chatLoading}
                className="flex-1 glass-input rounded-xl px-4 py-2.5 text-sm"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || chatLoading}
                className="p-2.5 bg-brand-cyan text-slate-950 font-bold rounded-xl hover:bg-brand-teal transition-colors disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </div>
        )}

      </section>
    </div>
  );
}
