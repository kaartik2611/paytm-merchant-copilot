'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Store, Utensils, Activity, Smartphone, Shirt, 
  TrendingUp, TrendingDown, Users, AlertTriangle, 
  Clock, FileText, Send, Sparkles, ShieldAlert,
  Loader2, ClipboardCheck, Calendar, CheckCircle, ChevronRight, Mic, Volume2
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
      text: `### Welcome to your **Paytm Merchant Intelligence Copilot** 🚀\n\nI have parsed all scan logs for **${merchant.name}** for the last 30 days.\n\nYou can ask me questions about your revenue forecasting, operational health score, peak transaction hours, customer retention rates, or bank settlement status. Try one of the quick questions below!`
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Voice overlay state
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'processing' | 'responding'>('idle');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceReply, setVoiceReply] = useState('');

  const availableRecapDates = revenue.dailyTrends.slice(-10).map(t => t.date).reverse();

  const chatEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (activeTab === 'copilot') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatLoading, activeTab]);

  // Rich Markdown parser structures and components
  // Supported features: Headers (#, ##, ###), lists (*, -, 1.), tables (|), code blocks (```) with Copy button, inline bold (**), italic (*), and code (`)
  
  const renderFormattedText = (text: string, isUser: boolean) => {
    interface MarkdownBlock {
      type: 'paragraph' | 'header' | 'list' | 'ordered-list' | 'table' | 'code-block';
      level?: number;
      items?: string[];
      rows?: string[][];
      headers?: string[];
      content?: string;
      language?: string;
    }

    // Sub-component for code blocks with active Copy-to-Clipboard functionality
    const CodeBlock = ({ content, language }: { content: string; language?: string }) => {
      const [copied, setCopied] = useState(false);

      const handleCopy = async () => {
        try {
          await navigator.clipboard.writeText(content);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch (err) {
          console.error('Failed to copy code: ', err);
        }
      };

      return (
        <div className="my-2.5 rounded-xl bg-[#0D1117] dark:bg-black/80 p-3 font-mono text-[10px] text-white border border-white/10 relative group">
          <div className="flex justify-between items-center text-[9px] text-white/50 mb-1.5 border-b border-white/5 pb-1 select-none">
            <span>{language || 'code'}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 hover:text-white transition-colors duration-150 px-1.5 py-0.5 rounded hover:bg-white/10"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-3 w-3 text-[#2EA44F]" />
                  <span className="text-[#2EA44F]">Copied!</span>
                </>
              ) : (
                <>
                  <ClipboardCheck className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="whitespace-pre overflow-x-auto max-w-full scrollbar-none py-0.5">
            <code>{content}</code>
          </pre>
        </div>
      );
    };

    // 1. Lexer: split string into structured Markdown block tokens
    const lines = text.split('\n');
    const blocks: MarkdownBlock[] = [];
    let currentBlock: MarkdownBlock | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Code Block check
      if (trimmed.startsWith('```')) {
        if (currentBlock && currentBlock.type === 'code-block') {
          blocks.push(currentBlock);
          currentBlock = null;
        } else {
          if (currentBlock) blocks.push(currentBlock);
          const language = trimmed.slice(3).trim();
          currentBlock = { type: 'code-block', content: '', language };
        }
        continue;
      }

      if (currentBlock && currentBlock.type === 'code-block') {
        currentBlock.content = (currentBlock.content ? currentBlock.content + '\n' : '') + line;
        continue;
      }

      // Table check
      if (trimmed.startsWith('|')) {
        const parts = line.split('|').map(p => p.trim());
        const isSeparator = parts.every(p => p === '' || p.startsWith('-') || p.startsWith(':'));

        if (isSeparator) {
          if (currentBlock && currentBlock.type === 'table') {
            continue;
          }
        }

        const rowData = line
          .split('|')
          .slice(1, -1)
          .map(p => p.trim());

        if (currentBlock && currentBlock.type === 'table') {
          currentBlock.rows?.push(rowData);
        } else {
          if (currentBlock) blocks.push(currentBlock);
          currentBlock = { type: 'table', headers: rowData, rows: [] };
        }
        continue;
      }

      // Headers check
      if (trimmed.startsWith('#')) {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = null;

        const match = line.match(/^(#{1,6})\s+(.*)$/);
        if (match) {
          const level = match[1].length;
          const content = match[2];
          blocks.push({ type: 'header', level, content });
          continue;
        }
      }

      // Unordered list item check
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        const content = trimmed.replace(/^(\s*[\*\-•]\s+)/, '').trim();
        if (currentBlock && currentBlock.type === 'list') {
          currentBlock.items?.push(content);
        } else {
          if (currentBlock) blocks.push(currentBlock);
          currentBlock = { type: 'list', items: [content] };
        }
        continue;
      }

      // Ordered list item check
      const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (olMatch) {
        const content = olMatch[2].trim();
        if (currentBlock && currentBlock.type === 'ordered-list') {
          currentBlock.items?.push(content);
        } else {
          if (currentBlock) blocks.push(currentBlock);
          currentBlock = { type: 'ordered-list', items: [content] };
        }
        continue;
      }

      // Block separator (empty line)
      if (trimmed === '') {
        if (currentBlock) {
          blocks.push(currentBlock);
          currentBlock = null;
        }
        continue;
      }

      // Paragraph
      if (currentBlock && currentBlock.type === 'paragraph') {
        currentBlock.content = (currentBlock.content ? currentBlock.content + '\n' : '') + line;
      } else {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = { type: 'paragraph', content: line };
      }
    }

    if (currentBlock) {
      blocks.push(currentBlock);
    }

    // Helper to parser inline bold (**), italic (*), and inline code (`) using token mapping
    const parseInlineElements = (txt: string): React.ReactNode => {
      if (!txt) return '';
      let parts: (string | React.ReactNode)[] = [txt];

      // 1. Inline code: `code`
      parts = parts.flatMap(part => {
        if (typeof part !== 'string') return part;
        if (!part.includes('`')) return part;
        const sub = part.split('`');
        return sub.map((s, idx) => {
          if (idx % 2 === 1) {
            return (
              <code
                key={`code-${idx}`}
                className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-black/10 dark:bg-white/10 text-[#E25C5C] dark:text-[#F27C7C]"
              >
                {s}
              </code>
            );
          }
          return s;
        });
      });

      // 2. Bold: **bold**
      parts = parts.flatMap(part => {
        if (typeof part !== 'string') return part;
        if (!part.includes('**')) return part;
        const sub = part.split('**');
        return sub.map((s, idx) => {
          if (idx % 2 === 1) {
            return (
              <strong
                key={`bold-${idx}`}
                className={cn("font-extrabold", isUser ? "text-white" : "text-[#0A0E1A] dark:text-[#E2E8F0]")}
              >
                {s}
              </strong>
            );
          }
          return s;
        });
      });

      // 3. Italic: *italic*
      parts = parts.flatMap(part => {
        if (typeof part !== 'string') return part;
        if (!part.includes('*')) return part;
        const sub = part.split('*');
        return sub.map((s, idx) => {
          if (idx % 2 === 1) {
            return (
              <em key={`italic-${idx}`} className="italic">
                {s}
              </em>
            );
          }
          return s;
        });
      });

      return <>{parts}</>;
    };

    // 2. Render blocks to React JSX nodes
    return (
      <div className="space-y-2.5">
        {blocks.map((block, blockIdx) => {
          switch (block.type) {
            case 'header': {
              const level = block.level || 1;
              const content = parseInlineElements(block.content || '');
              if (level === 1) {
                return (
                  <h2 key={blockIdx} className={cn("text-base font-extrabold my-2", isUser ? "text-white" : "text-[#0A0E1A] dark:text-[#E2E8F0]")}>
                    {content}
                  </h2>
                );
              }
              if (level === 2) {
                return (
                  <h3 key={blockIdx} className={cn("text-sm font-bold my-1.5", isUser ? "text-white" : "text-[#0A0E1A] dark:text-[#E2E8F0]")}>
                    {content}
                  </h3>
                );
              }
              // Level 3+ gets Sparkles icon if from assistant
              return (
                <h4
                  key={blockIdx}
                  className={cn(
                    "font-bold text-xs border-b pb-1 mb-2 mt-3 flex items-center gap-1.5",
                    isUser ? "text-white border-white/20" : "text-[#0A0E1A] dark:text-[#E2E8F0] border-[#E6E9EE] dark:border-white/10"
                  )}
                >
                  {!isUser && <Sparkles className="h-3 w-3 text-[#3199E4] flex-none" />}
                  {content}
                </h4>
              );
            }

            case 'list':
              return (
                <ul key={blockIdx} className={cn("ml-4 pl-1 list-disc space-y-1 my-1.5 text-xs leading-relaxed", isUser ? "text-white/90" : "text-[#36404F] dark:text-[#A0AEC0]")}>
                  {block.items?.map((item, itemIdx) => (
                    <li key={itemIdx}>{parseInlineElements(item)}</li>
                  ))}
                </ul>
              );

            case 'ordered-list':
              return (
                <ol key={blockIdx} className={cn("ml-4 pl-1 list-decimal space-y-1 my-1.5 text-xs leading-relaxed", isUser ? "text-white/90" : "text-[#36404F] dark:text-[#A0AEC0]")}>
                  {block.items?.map((item, itemIdx) => (
                    <li key={itemIdx}>{parseInlineElements(item)}</li>
                  ))}
                </ol>
              );

            case 'table': {
              const hasRows = block.rows && block.rows.length > 0;
              return (
                <div key={blockIdx} className="my-3 overflow-x-auto rounded-xl border border-[#E6E9EE] dark:border-[#2D3748] shadow-sm select-text scrollbar-none">
                  <table className="min-w-full divide-y divide-[#E6E9EE] dark:divide-[#2D3748] text-[10px]">
                    <thead>
                      <tr className="bg-[#F5F7FA] dark:bg-[#1A202C]">
                        {block.headers?.map((header, headIdx) => (
                          <th
                            key={headIdx}
                            className="px-3 py-2 text-left font-bold text-[#36404F] dark:text-[#A0AEC0] whitespace-nowrap"
                          >
                            {parseInlineElements(header)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    {hasRows && (
                      <tbody className="divide-y divide-[#E6E9EE] dark:divide-[#2D3748]">
                        {block.rows?.map((row, rowIdx) => (
                          <tr
                            key={rowIdx}
                            className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-75"
                          >
                            {row.map((cell, cellIdx) => (
                              <td
                                key={cellIdx}
                                className="px-3 py-2 text-[#36404F] dark:text-[#E2E8F0] whitespace-nowrap"
                              >
                                {parseInlineElements(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                </div>
              );
            }

            case 'code-block':
              return <CodeBlock key={blockIdx} content={block.content || ''} language={block.language} />;

            case 'paragraph':
            default:
              return (
                <p
                  key={blockIdx}
                  className={cn(
                    "text-xs leading-relaxed min-h-[1em] my-1",
                    isUser ? "text-white" : "text-[#36404F] dark:text-[#E2E8F0]"
                  )}
                >
                  {parseInlineElements(block.content || '')}
                </p>
              );
          }
        })}
      </div>
    );
  };

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

  // Voice Assistant flow simulation
  const triggerVoiceAssistant = () => {
    setShowVoiceOverlay(true);
    setVoiceStatus('listening');
    setVoiceTranscript('How is my business looking today?');
    setVoiceReply('');

    // Simulate speech-to-text
    setTimeout(() => {
      setVoiceStatus('processing');
      
      // Simulate answer generation
      setTimeout(() => {
        setVoiceStatus('responding');
        setVoiceReply(`Good morning! ${merchant.name} is performing steadily. Today's daily recap shows ₹${latestDailyRecap.revenue.toLocaleString('en-IN')} collection across ${latestDailyRecap.transactionsCount} scans. Your settlement risk is LOW, with standard payout batch clearances.`);
      }, 1500);
    }, 2000);
  };

  // Helper to select icon based on category
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

  // Colors mapping
  const PAYMENT_COLORS = ['#3199E4', '#00BAF2', '#577FCB', '#859DD9', '#E2F0FC'];
  const CUSTOMER_COLORS = ['#1F8A4C', '#C77A12', '#3199E4', '#D63B3B'];

  // Prepare Forecast overlay
  const last12DaysTrends = revenue.dailyTrends.slice(-12).map(t => ({
    date: new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    actual: t.revenue,
    forecast: null
  }));

  const forecastTrends = forecast.map(f => ({
    date: new Date(f.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    actual: null,
    forecast: f.revenue
  }));

  if (last12DaysTrends.length > 0 && forecastTrends.length > 0) {
    forecastTrends.unshift({
      date: last12DaysTrends[last12DaysTrends.length - 1].date,
      actual: null,
      forecast: last12DaysTrends[last12DaysTrends.length - 1].actual
    });
  }

  const combinedForecastChartData = [...last12DaysTrends, ...forecastTrends];

  // AI Specimen card footer: Confidence bar generator
  const renderConfidenceMeter = (level: 'high' | 'medium' | 'low') => {
    const barsCount = level === 'high' ? 3 : level === 'medium' ? 2 : 1;
    const label = level === 'high' ? 'High Trust' : level === 'medium' ? 'Medium Trust' : 'Low Trust';
    const color = level === 'high' ? 'var(--success)' : level === 'medium' ? 'var(--warning)' : 'var(--ink-500)';
    return (
      <div className="ai-conf">
        <div className="ai-conf__bars">
          <b className={barsCount >= 1 ? 'on' : ''} style={{ '--_c': color } as any}></b>
          <b className={barsCount >= 2 ? 'on' : ''} style={{ '--_c': color } as any}></b>
          <b className={barsCount >= 3 ? 'on' : ''} style={{ '--_c': color } as any}></b>
        </div>
        <span className="ai-conf__label">{label}</span>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F5F7FA] min-h-screen">
      {/* 1. TOP NAV BAR (Paytm Design Spec: 58px height, white surface, hairline border) */}
      <nav className="h-[58px] bg-white border-b border-[#E6E9EE] flex items-center px-[22px] justify-between sticky top-0 z-30 select-none">
        <div className="flex items-center gap-3.5">
          <Link href="/" className="mr-1">
            <img src="/assets/paytm-logo.png" alt="Paytm" className="h-[22px] object-contain" />
          </Link>
          <span className="text-[13px] font-bold text-[#36404F] border-l border-[#E6E9EE] pl-3.5 pt-0.5">
            for Business
          </span>
          <div className="hidden md:flex items-center gap-2 text-xs text-[#5A6473] font-medium ml-4">
            <span>&bull;</span>
            <span>Account: <strong className="text-[#0A0E1A]">{merchant.name}</strong></span>
            <span>&bull;</span>
            <span>UPI ID: <strong className="text-[#0A0E1A] font-mono">{merchant.upiId}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={triggerVoiceAssistant} 
            className="pt-btn pt-btn--sm pt-btn--secondary flex items-center gap-1.5 font-bold"
          >
            <Mic className="h-3.5 w-3.5" />
            Ask by voice
          </button>
          <div className="h-[34px] w-[34px] rounded-full bg-[#3199E4] text-white flex items-center justify-center font-bold text-xs select-none shadow-sm">
            {merchant.ownerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
        </div>
      </nav>

      {/* Main Layout Grid */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-[22px] py-6 flex flex-col gap-6">
        
        {/* 2. SUB HEADER (Welcome name + Action AI button) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#0A0E1A] tracking-tight">
              Good morning, {merchant.ownerName}
            </h2>
            <p className="text-xs text-[#5A6473] font-medium flex items-center gap-1.5 mt-0.5">
              <span>{merchant.name}</span>
              <span>&bull;</span>
              <span>{merchant.city}</span>
              <span>&bull;</span>
              <span>Today, 06 Jun 2026</span>
            </p>
          </div>

          <button
            onClick={() => setActiveTab('copilot')}
            className={cn(
              "pt-btn pt-btn--md flex items-center gap-2 shadow-sm font-bold",
              activeTab === 'copilot'
                ? "pt-btn--navy"
                : "pt-btn--primary"
            )}
          >
            <Sparkles className="h-4 w-4" />
            Ask Paytm AI
          </button>
        </div>

        {/* 3. APP CHIPS NAVIGATION TABS */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'revenue-forecast', label: 'Revenue & Forecasting' },
            { id: 'peak-payments', label: 'Peak Hours & Payments' },
            { id: 'customers', label: 'Customer Visit Patterns' },
            { id: 'settlements', label: 'Settlement Intelligence' },
            { id: 'recaps', label: 'Recaps & Reviews' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "pt-chip",
                activeTab === tab.id
                  ? "bg-[#E2F0FC] text-[#3199E4] shadow-none border border-[#3199E4]"
                  : ""
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB content loader */}
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Paytm Collection Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Stat 1: Collections */}
              <div className="pt-cardshell p-5 relative overflow-hidden">
                <div className="text-[12px] font-bold text-[#5A6473] uppercase tracking-wide">30D collections</div>
                <div className="text-3xl font-extrabold text-[#0A0E1A] mt-2.5 tnum flex items-baseline gap-2">
                  ₹{revenue.totalRevenue.toLocaleString('en-IN')}
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5",
                    revenue.growthPercentage >= 0 ? "text-[#1F8A4C] bg-[#E4F6EC]" : "text-[#D63B3B] bg-[#FCE7E7]"
                  )}>
                    {revenue.growthPercentage >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {Math.abs(revenue.growthPercentage)}%
                  </span>
                </div>
                <div className="text-[11px] text-[#7E8794] mt-2 font-medium">Growth vs prior 15D period</div>
              </div>

              {/* Stat 2: Scans */}
              <div className="pt-cardshell p-5 relative overflow-hidden">
                <div className="text-[12px] font-bold text-[#5A6473] uppercase tracking-wide">SUCCESS Scans count</div>
                <div className="text-3xl font-extrabold text-[#0A0E1A] mt-2.5 tnum">{revenue.successTxnCount}</div>
                <div className="text-[11px] text-[#D63B3B] mt-2 font-medium">Failed scans: {revenue.failedTxnCount} ({((revenue.failedTxnCount / (revenue.successTxnCount + revenue.failedTxnCount)) * 100).toFixed(1)}%)</div>
              </div>

              {/* Stat 3: Avg Order */}
              <div className="pt-cardshell p-5 relative overflow-hidden">
                <div className="text-[12px] font-bold text-[#5A6473] uppercase tracking-wide">Average scan size</div>
                <div className="text-3xl font-extrabold text-[#0A0E1A] mt-2.5 tnum">₹{revenue.averageOrderValue}</div>
                <div className="text-[11px] text-[#7E8794] mt-2 font-medium">Per successful scanner transaction</div>
              </div>

              {/* Stat 4: Settlements */}
              <div className="pt-cardshell p-5 relative overflow-hidden">
                <div className="text-[12px] font-bold text-[#5A6473] uppercase tracking-wide">Pending payout balance</div>
                <div className="text-3xl font-extrabold text-[#C77A12] mt-2.5 tnum">₹{settlements.totalPendingAmount.toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-[#7E8794] mt-2 font-medium">Clearing T+1 standard batches</div>
              </div>

            </div>

            {/* AI For Your Business Specimen Header */}
            <div className="flex items-center gap-2.5 mt-2 ml-1">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#00BAF2] via-[#3199E4] to-[#1F4D9E] flex items-center justify-center text-white">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="text-[14px] font-bold text-[#0A0E1A]">AI for your business</span>
            </div>

            {/* AI Cards Grid (Speciment Spec) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* AI Insight Spec Card */}
              <div className="ai-card ai-card--rail" style={{ '--_accent': 'var(--cat-growth)' } as any}>
                <div className="ai-card__head">
                  <div className="h-[30px] w-[30px] rounded-full bg-[#EEFAFE] text-[#3199E4] flex items-center justify-center font-bold text-xs">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="ai-card__eyebrow">Business insight</span>
                  <span className="ai-card__spacer ai-insight__delta ai-insight__delta--up">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Growth Peak
                  </span>
                </div>
                <div className="ai-card__title mt-1">
                  Peak hourly traffic occurs during {peakHours.peakHours[0]}:00 ({peakHours.peakPeriodName})
                </div>
                <div className="ai-insight__metric mt-3">
                  <span className="ai-insight__value tnum">₹{Math.round(revenue.totalRevenue / 30).toLocaleString('en-IN')}</span>
                  <span className="text-xs text-[#5A6473] font-medium ml-2">Estimated daily baseline</span>
                </div>
                <div className="ai-insight__spark mt-4">
                  {peakHours.hourlyStats.slice(6, 22).map((h, i) => (
                    <i 
                      key={i} 
                      className={h.hour === peakHours.peakHours[0] ? 'is-peak' : ''} 
                      style={{ height: `${Math.max(12, (h.revenue / Math.max(...peakHours.hourlyStats.map(s => s.revenue))) * 100)}%` }} 
                    />
                  ))}
                </div>
                <div className="ai-card__foot mt-5">
                  {renderConfidenceMeter('high')}
                  <span onClick={() => setActiveTab('peak-payments')} className="ai-card__spacer pt-section__action flex items-center gap-1">
                    Why this? <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>

              {/* AI Recommendation Spec Card */}
              <div className="ai-card">
                <div className="ai-card__head">
                  <div className="h-[30px] w-[30px] rounded-full bg-[#E4F6EC] text-[#1F8A4C] flex items-center justify-center font-bold text-xs">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="ai-card__eyebrow">Paytm Action Recommendation</span>
                </div>
                
                <div className="ai-reco mt-2">
                  <div className="space-y-3 flex-1">
                    <h3 className="text-[15px] font-bold text-[#0A0E1A]">
                      Launch a 'Paytm Loyalty Stamp Card' campaign
                    </h3>
                    <p className="text-sm text-[#36404F] font-medium leading-relaxed">
                      Your repeat visits rate is currently **{customers.repeatCustomerRate}%**. Setting up a scan promo offering ₹25 cashback on a customer's 5th transaction can convert single-visit scanners.
                    </p>
                    <span className="ai-reco__impact">
                      Lift repeat rate by ~10%
                    </span>
                  </div>
                </div>

                <div className="ai-card__foot mt-6">
                  {renderConfidenceMeter('medium')}
                  <button 
                    onClick={() => {
                      setActiveTab('copilot');
                      setMessages(prev => [...prev, {
                        id: Math.random().toString(),
                        role: 'user',
                        text: "How do I setup a Paytm Loyalty Stamp Card campaign?"
                      }]);
                      handleSendChat("How do I setup a Paytm Loyalty Stamp Card campaign?");
                    }} 
                    className="ai-card__spacer pt-btn pt-btn--sm pt-btn--primary font-bold text-xs"
                  >
                    Setup Campaign
                  </button>
                </div>
              </div>

              {/* AI Risk Alert Card */}
              <div className="ai-risk ai-risk--medium">
                <div className="ai-risk__head">
                  <div className="ai-risk__icon">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="ai-risk__title">Payout Delay Risk Flagged</h4>
                    <span className="ai-risk__sev">Medium Pipeline Severity</span>
                  </div>
                </div>
                <p className="ai-risk__body">
                  We predicted delay risks for pending settlements. Currently, **{settlements.delayPredictions.length} payout** (SET092 for ₹{settlements.totalPendingAmount.toLocaleString('en-IN')}) has been pending for over 24 hours.
                </p>
                <div className="ai-risk__actions flex justify-end gap-3.5 mt-5">
                  <button 
                    onClick={() => setActiveTab('settlements')} 
                    className="pt-btn pt-btn--sm pt-btn--navy font-bold text-xs"
                  >
                    Investigate Ledger
                  </button>
                </div>
              </div>

              {/* Merchant Operational Health Spec Card */}
              <div className="ai-card ai-card--rail" style={{ '--_accent': 'var(--cat-insight)' } as any}>
                <div className="ai-card__head">
                  <div className="h-[30px] w-[30px] rounded-full bg-[#E2F0FC] text-[#3199E4] flex items-center justify-center font-bold text-xs">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="ai-card__eyebrow">Health Index Specimen</span>
                </div>
                
                <div className="flex items-center gap-6 mt-3">
                  <div className="h-20 w-20 rounded-full border-4 border-[#E6E9EE] flex flex-col items-center justify-center flex-none">
                    <span className="text-2xl font-black text-[#0A0E1A]">{revenue.healthScore}</span>
                    <span className="text-[8px] text-[#7E8794] font-bold uppercase">Index</span>
                  </div>
                  <div className="space-y-1 text-xs text-[#36404F]">
                    <p className="font-bold text-[#0A0E1A]">Rating: <span className="text-[#3199E4]">{revenue.healthLevel}</span></p>
                    <p>✓ Payment success rate is high ({((revenue.successTxnCount / (revenue.successTxnCount + revenue.failedTxnCount)) * 100).toFixed(1)}%)</p>
                    <p>✓ Settlement delay rate stands at {settlements.delayRate}%</p>
                  </div>
                </div>

                <div className="ai-card__foot mt-6">
                  {renderConfidenceMeter('high')}
                  <button 
                    onClick={() => {
                      setActiveTab('copilot');
                      setMessages(prev => [...prev, {
                        id: Math.random().toString(),
                        role: 'user',
                        text: "Explain my Merchant Health Score components."
                      }]);
                      handleSendChat("Explain my Merchant Health Score components.");
                    }} 
                    className="ai-card__spacer pt-btn pt-btn--sm pt-btn--secondary font-bold text-xs"
                  >
                    View Components
                  </button>
                </div>
              </div>

            </div>

            {/* Micro Charts Section */}
            {mounted && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                {/* 30D area chart */}
                <div className="pt-cardshell p-6">
                  <h3 className="text-sm font-bold text-[#0A0E1A] mb-4">Historical Daily Scans Trend</h3>
                  <div className="h-[240px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenue.dailyTrends}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3199E4" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#3199E4" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E6E9EE" />
                        <XAxis dataKey="date" stroke="#5A6473" fontSize={11} tickFormatter={(val) => val.substring(8, 10)} />
                        <YAxis stroke="#5A6473" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E6E9EE', color: '#0A0E1A' }} />
                        <Area type="monotone" dataKey="revenue" stroke="#3199E4" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Collection (₹)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Hourly traffic */}
                <div className="pt-cardshell p-6">
                  <h3 className="text-sm font-bold text-[#0A0E1A] mb-4">Hourly Collections Share</h3>
                  <div className="h-[240px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={peakHours.hourlyStats}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E6E9EE" />
                        <XAxis dataKey="hour" stroke="#5A6473" fontSize={11} tickFormatter={(val) => `${val}h`} />
                        <YAxis stroke="#5A6473" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E6E9EE', color: '#0A0E1A' }} />
                        <Bar dataKey="revenue" fill="#00BAF2" name="Collections (₹)">
                          {peakHours.hourlyStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.hour === peakHours.peakHours[0] ? '#ff5d24' : '#00BAF2'} />
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
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="pt-cardshell p-6 border-l-4 border-[#00BAF2]">
                <span className="text-[11px] text-[#5A6473] font-bold uppercase tracking-wider">Projected 7D Collections</span>
                <p className="text-2xl font-black text-[#0A0E1A] mt-2 tnum">
                  ₹{Math.round(forecast.reduce((sum, f) => sum + f.revenue, 0)).toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-[#7E8794] mt-1.5 font-medium">Predictive algorithm using rolling baseline averages</p>
              </div>
              <div className="pt-cardshell p-6">
                <span className="text-[11px] text-[#5A6473] font-bold uppercase tracking-wider">30D Growth Velocity</span>
                <p className="text-2xl font-black text-[#1F8A4C] mt-2 tnum flex items-center gap-1">
                  <TrendingUp className="h-5 w-5" />
                  {revenue.growthPercentage}%
                </p>
                <p className="text-[10px] text-[#7E8794] mt-1.5 font-medium">Growth compared to previous 15D period</p>
              </div>
              <div className="pt-cardshell p-6">
                <span className="text-[11px] text-[#5A6473] font-bold uppercase tracking-wider">Median Daily Collections</span>
                <p className="text-2xl font-black text-[#0A0E1A] mt-2 tnum">
                  ₹{Math.round(revenue.totalRevenue / 30).toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-[#7E8794] mt-1.5 font-medium">Calculated over a 30-day historical log</p>
              </div>
            </div>

            {mounted && (
              <div className="pt-cardshell p-6">
                <div className="mb-6">
                  <h3 className="text-base font-bold text-[#0A0E1A] flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-[#3199E4]" />
                    7-Day Sales Projections & Forecasting
                  </h3>
                  <p className="text-xs text-[#5A6473] font-medium mt-1 leading-relaxed">
                    Historical actual collection levels are plotted in <span className="text-[#3199E4] font-semibold">Solid Blue</span>. The estimated forecast projections are plotted in <span className="text-[#00BAF2] font-semibold">Dashed Cyan</span>.
                  </p>
                </div>
                
                <div className="h-[380px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={combinedForecastChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E6E9EE" />
                      <XAxis dataKey="date" stroke="#5A6473" fontSize={11} />
                      <YAxis stroke="#5A6473" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E6E9EE', color: '#0A0E1A' }} />
                      <Line type="monotone" dataKey="actual" stroke="#3199E4" strokeWidth={3} dot={{ r: 3 }} name="Actual (₹)" connectNulls />
                      <Line type="monotone" dataKey="forecast" stroke="#00BAF2" strokeDasharray="5 5" strokeWidth={3} dot={{ r: 2 }} name="Forecast (₹)" connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PEAK HOURS & PAYMENTS */}
        {activeTab === 'peak-payments' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            {/* Hourly charts */}
            <div className="pt-cardshell p-6">
              <h3 className="text-base font-bold text-[#0A0E1A] mb-1">Hourly Checkout Intensities</h3>
              <p className="text-xs text-[#5A6473] font-medium mb-6">Volume distribution across the standard 24h operational day</p>

              {mounted && (
                <div className="h-[300px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={peakHours.hourlyStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E6E9EE" />
                      <XAxis dataKey="hour" stroke="#5A6473" fontSize={11} tickFormatter={(val) => `${val}:00`} />
                      <YAxis stroke="#5A6473" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E6E9EE', color: '#0A0E1A' }} />
                      <Bar dataKey="revenue" name="Collections (₹)">
                        {peakHours.hourlyStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.hour === peakHours.peakHours[0] ? '#ff5d24' : '#3199E4'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="mt-4 p-3.5 bg-[#F4F9FE] border border-[#3199E4]/20 rounded-xl text-xs text-[#36404F]">
                💡 **Peak Hour Optimization**: Your peak business occurs around **{peakHours.peakHours[0]}:00** (**{peakHours.peakPeriodName}**). Double-check counter terminal network connections before this window.
              </div>
            </div>

            {/* Payment share mix */}
            <div className="pt-cardshell p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0A0E1A] mb-1">Payment Mode Breakdown</h3>
                <p className="text-xs text-[#5A6473] font-medium mb-6">Distribution share of scan types (UPI, Paytm Wallet, Card, Net Banking)</p>

                {mounted && (
                  <div className="h-[220px] w-full flex justify-center mb-4 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenue.paymentModeShare}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="count"
                          nameKey="mode"
                        >
                          {revenue.paymentModeShare.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E6E9EE', color: '#0A0E1A' }} />
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
                        <span className="text-[#36404F] font-semibold">{mode.mode}</span>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <span className="text-[#7E8794]">{mode.count} payments</span>
                        <span className="text-[#0A0E1A] font-bold tnum">₹{mode.revenue.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMER VISIT PATTERNS */}
        {activeTab === 'customers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            {/* Visit table */}
            <div className="pt-cardshell p-6">
              <h3 className="text-base font-bold text-[#0A0E1A] mb-1">Customer visit frequency segments</h3>
              <p className="text-xs text-[#5A6473] font-medium mb-6">Group wallet identifiers based on scan frequencies</p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[10px] text-[#7E8794] uppercase tracking-wider border-b border-[#E6E9EE]">
                    <tr>
                      <th className="py-3 px-2">Segment</th>
                      <th className="py-3 px-2 text-right">Unique Wallets</th>
                      <th className="py-3 px-2 text-right">Visit Share</th>
                      <th className="py-3 px-2 text-right">Revenue Contributed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E9EE]/40 text-[#36404F]">
                    {customers.segmentDistribution.map((seg, idx) => (
                      <tr key={idx} className="hover:bg-[#FAFBFC]">
                        <td className="py-3 px-2 font-bold text-[#0A0E1A] flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CUSTOMER_COLORS[idx % CUSTOMER_COLORS.length] }}></span>
                          {seg.segment}
                        </td>
                        <td className="py-3 px-2 text-right tnum">{seg.count} unique</td>
                        <td className="py-3 px-2 text-right tnum">
                          {((seg.count / customers.uniqueCustomers) * 100).toFixed(0)}%
                        </td>
                        <td className="py-3 px-2 text-right font-bold text-[#0A0E1A] tnum">₹{seg.totalSpend.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visit frequency share */}
            <div className="pt-cardshell p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0A0E1A] mb-1">Visit Share Distribution</h3>
                <p className="text-xs text-[#5A6473] font-medium mb-6">Distribution percentage of shopping segments</p>

                {mounted && (
                  <div className="h-[220px] w-full flex justify-center mb-4 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={customers.visitFrequencyShare}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="value"
                          nameKey="name"
                        >
                          {customers.visitFrequencyShare.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CUSTOMER_COLORS[index % CUSTOMER_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E6E9EE', color: '#0A0E1A' }} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="p-3 bg-[#F4F9FE] border border-[#3199E4]/20 rounded-xl text-xs text-[#36404F] mt-4">
                💡 **Repeat Rate**: Your repeat visit scanner rate is **{customers.repeatCustomerRate}%**. Setting up a cashback coupon targeted at Occasional/Single visit wallets can boost customer lifetime value.
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SETTLEMENT INTELLIGENCE */}
        {activeTab === 'settlements' && (
          <div className="space-y-6 animate-fade-in">
            {/* Settlements statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="pt-cardshell p-5 text-center">
                <span className="text-[10px] text-[#5A6473] font-bold uppercase tracking-wider">Settled Payouts</span>
                <p className="text-2xl font-black text-[#1F8A4C] mt-1.5 tnum">₹{settlements.totalSettledAmount.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-[#7E8794] mt-1">{settlements.settledCount} cleared runs</p>
              </div>
              <div className="pt-cardshell p-5 text-center">
                <span className="text-[10px] text-[#5A6473] font-bold uppercase tracking-wider">Pending Batches</span>
                <p className="text-2xl font-black text-[#C77A12] mt-1.5 tnum">₹{settlements.totalPendingAmount.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-[#7E8794] mt-1">{settlements.pendingCount} batches active</p>
              </div>
              <div className="pt-cardshell p-5 text-center">
                <span className="text-[10px] text-[#5A6473] font-bold uppercase tracking-wider">Delay Rate</span>
                <p className="text-2xl font-black text-[#0A0E1A] mt-1.5 tnum">{settlements.delayRate}%</p>
                <p className="text-[10px] text-[#D63B3B] mt-1">{settlements.delayedCount} delayed clearings</p>
              </div>
              <div className="pt-cardshell p-5 text-center">
                <span className="text-[10px] text-[#5A6473] font-bold uppercase tracking-wider">Failed Payouts</span>
                <p className="text-2xl font-black text-[#D63B3B] mt-1.5 tnum">₹{settlements.totalFailedAmount.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-[#7E8794] mt-1">{settlements.failedCount} failed bank payouts</p>
              </div>
            </div>

            {/* Gauge and ledger */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Gauge and delay warnings */}
              <div className="pt-cardshell p-6 flex flex-col items-center justify-between text-center">
                <div className="w-full">
                  <h3 className="text-[13px] font-bold text-[#0A0E1A] uppercase tracking-wider">Payout Risk Index</h3>
                  <p className="text-xs text-[#5A6473] font-medium mt-1">Calculated via bank clearance histories</p>
                </div>

                <div className="my-6 relative flex items-center justify-center">
                  <div className="h-28 w-28 rounded-full border-8 border-[#F0F2F5] flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-[#0A0E1A]">{settlements.riskScore}</span>
                    <span className="text-[9px] text-[#7E8794] font-bold uppercase">Index</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className={cn(
                    "text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider",
                    settlements.riskLevel === 'LOW' ? 'text-[#1F8A4C] border-[#1F8A4C]/10 bg-[#E4F6EC]' :
                    settlements.riskLevel === 'MEDIUM' ? 'text-[#C77A12] border-[#C77A12]/10 bg-[#FCF1DD]' :
                    'text-[#D63B3B] border-[#D63B3B]/10 bg-[#FCE7E7]'
                  )}>
                    {settlements.riskLevel} RISK PIPELINE
                  </span>
                  <p className="text-xs text-[#36404F] font-medium leading-relaxed max-w-[200px] mx-auto">
                    {settlements.riskScore > 30 
                      ? "Warning: bank clearance delays are elevated. Toggle Instant Settlements." 
                      : "Payout pipeline is operational. Batches clear on-schedule."}
                  </p>
                </div>
              </div>

              {/* Settlement History List */}
              <div className="lg:col-span-2 pt-cardshell p-6">
                <h3 className="text-sm font-bold text-[#0A0E1A] mb-4">Daily Payouts Ledger</h3>
                <div className="overflow-y-auto max-h-[280px] space-y-2.5 pr-2">
                  {settlements.recentSettlements.map((sett, idx) => (
                    <div key={idx} className="bg-white border border-[#E6E9EE] rounded-lg p-3 flex justify-between items-center hover:bg-[#FAFBFC] transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#0A0E1A] tnum">₹{sett.amount.toLocaleString('en-IN')}</span>
                          <span className={cn(
                            "text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider",
                            sett.status === 'SETTLED' ? 'bg-[#E4F6EC] text-[#1F8A4C]' :
                            sett.status === 'DELAYED' ? 'bg-[#FCF1DD] text-[#C77A12]' :
                            sett.status === 'PENDING' ? 'bg-[#E2F0FC] text-[#3199E4] animate-pulse' :
                            'bg-[#FCE7E7] text-[#D63B3B]'
                          )}>
                            {sett.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#7E8794] mt-1 font-medium">ID: {sett.settlementId} &bull; Ref: {sett.bankRefNo || 'N/A'}</p>
                      </div>
                      <div className="text-right text-[10px] text-[#5A6473] font-medium">
                        <p>Initiated: {sett.initiatedTime.substring(0, 10)} 06:00</p>
                        <p className="text-[#7E8794] mt-0.5">Cleared: {sett.settledTime ? sett.settledTime.substring(11, 16) : '--:--'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 6: DAILY RECAPS */}
        {activeTab === 'recaps' && (
          <div className="space-y-6 animate-fade-in">
            {/* Daily recaps selector */}
            <div className="pt-cardshell p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-[#0A0E1A] flex items-center gap-2">
                    <Calendar className="h-4.5 w-4.5 text-[#3199E4]" />
                    Daily Operations Report
                  </h3>
                  <p className="text-xs text-[#5A6473] font-medium">View detailed transactional performance metrics for any past date</p>
                </div>
                
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-[#5A6473]">Select Date:</span>
                  <select
                    value={selectedRecapDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="glass-input rounded-lg px-2 py-1 bg-white border border-[#E6E9EE] outline-none text-[#0A0E1A] cursor-pointer"
                  >
                    {availableRecapDates.map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                  </select>
                </div>
              </div>

              {recapLoading ? (
                <div className="h-[200px] flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-[#3199E4] animate-spin" />
                  <span className="ml-3 text-xs text-[#5A6473] font-semibold">Compiling checkout logs...</span>
                </div>
              ) : (
                <div className="bg-[#FAFBFC] border border-[#E6E9EE] rounded-xl p-5">
                  <div className="flex justify-between items-start border-b border-[#E6E9EE] pb-4 mb-5">
                    <div>
                      <h4 className="text-xs font-bold text-[#5A6473] uppercase tracking-wider">Operational Report &bull; {dailyRecapData.date}</h4>
                      <p className="text-[10px] text-[#7E8794] font-medium mt-0.5">Paytm Merchant Operations Engine</p>
                    </div>
                    <button 
                      onClick={() => {
                        const reportText = `Daily Report (${dailyRecapData.date}) for ${merchant.name}\nRevenue: ₹${dailyRecapData.revenue}\nTransactions: ${dailyRecapData.transactionsCount}\nAvg Ticket: ₹${dailyRecapData.averageTicketSize}\nInsights:\n${dailyRecapData.insights.map(i => `- ${i}`).join('\n')}`;
                        navigator.clipboard.writeText(reportText);
                        alert('Report copied!');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E6E9EE] hover:bg-[#FAFBFC] text-[10px] font-bold text-[#36404F] transition-all"
                    >
                      <ClipboardCheck className="h-3 w-3" />
                      Copy Report
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-[#E6E9EE] p-3 rounded-lg text-center">
                      <span className="text-[9px] text-[#7E8794] font-bold uppercase tracking-wider">Collections</span>
                      <p className="text-lg font-black text-[#0A0E1A] mt-1 tnum">₹{dailyRecapData.revenue.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white border border-[#E6E9EE] p-3 rounded-lg text-center">
                      <span className="text-[9px] text-[#7E8794] font-bold uppercase tracking-wider">Successful Scans</span>
                      <p className="text-lg font-black text-[#0A0E1A] mt-1 tnum">{dailyRecapData.transactionsCount}</p>
                    </div>
                    <div className="bg-white border border-[#E6E9EE] p-3 rounded-lg text-center">
                      <span className="text-[9px] text-[#7E8794] font-bold uppercase tracking-wider">Avg Scan Value</span>
                      <p className="text-lg font-black text-[#0A0E1A] mt-1 tnum">₹{dailyRecapData.averageTicketSize.toFixed(0)}</p>
                    </div>
                    <div className="bg-white border border-[#E6E9EE] p-3 rounded-lg text-center">
                      <span className="text-[9px] text-[#7E8794] font-bold uppercase tracking-wider">Dominant Payment</span>
                      <p className="text-xs font-bold text-[#36404F] mt-2 truncate" title={dailyRecapData.dominantPaymentMode}>
                        {dailyRecapData.dominantPaymentMode}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[11px] text-[#7E8794] font-bold uppercase tracking-wider mb-3">AI Operations Insights</h5>
                    <ul className="space-y-2.5">
                      {dailyRecapData.insights.map((insight, idx) => (
                        <li key={idx} className="text-xs text-[#36404F] font-medium flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#3199E4] mt-1.5 flex-none"></span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Monthly review */}
            <div className="pt-cardshell p-6 bg-gradient-to-br from-[#E2F0FC]/20 to-white border border-[#E6E9EE]">
              <h3 className="text-base font-bold text-[#0A0E1A] mb-2 flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-[#3199E4]" />
                Monthly Business Review ({monthlyReview.monthName})
              </h3>
              <p className="text-xs text-[#5A6473] font-medium mb-6">Aggregated intelligence report compiling monthly milestones and recommended actions</p>

              <div className="space-y-5">
                <div>
                  <h4 className="text-[11px] text-[#7E8794] font-bold uppercase tracking-wider mb-2.5">Milestones Compiled</h4>
                  <ul className="space-y-2">
                    {monthlyReview.insights.map((ins, idx) => (
                      <li key={idx} className="text-xs text-[#36404F] font-medium flex items-start gap-2">
                        <span className="text-[#1F8A4C] mt-0.5 font-bold">&bull;</span>
                        <span>{ins}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-[#E6E9EE] pt-5">
                  <h4 className="text-[11px] text-[#7E8794] font-bold uppercase tracking-wider mb-3">Paytm Growth Playbooks</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {monthlyReview.recommendations.map((rec, idx) => (
                      <div key={idx} className="bg-white border border-[#E6E9EE] rounded-xl p-4 flex flex-col justify-between">
                        <p className="text-xs text-[#36404F] font-medium leading-relaxed font-light">{rec}</p>
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
                          className="text-xs text-[#3199E4] hover:underline font-bold mt-4 text-left flex items-center gap-0.5"
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

        {/* TAB 7: AI COPILOT CHAT (Specimen specification: light theme, white bubble, user blue bubble) */}
        {activeTab === 'copilot' && (
          <div className="pt-cardshell flex flex-col h-[580px] overflow-hidden relative">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E6E9EE] px-5 py-3.5 bg-white select-none">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#1F8A4C] animate-pulse"></div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#36404F]">Paytm Copilot Brain</h3>
              </div>
              <span className="text-[10px] text-[#3199E4] font-bold bg-[#E2F0FC] border border-[#3199E4]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Gemini-2.5-Flash Active
              </span>
            </div>

            {/* Chat Stream (Light wash background) */}
            <div className="flex-1 bg-[#F5F7FA] overflow-y-auto px-5 py-4 space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "ai-bubble",
                    msg.role === 'user' 
                      ? "ai-bubble--user" 
                      : "ai-bubble--assistant"
                  )}
                >
                  <div className="whitespace-pre-wrap font-medium">
                    {renderFormattedText(msg.text, msg.role === 'user')}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="ai-bubble ai-bubble--assistant flex items-center gap-2 text-xs text-[#5A6473]">
                  <Loader2 className="h-3.5 w-3.5 text-[#3199E4] animate-spin" />
                  <span>Copilot is writing analysis...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Prompts chips footer */}
            <div className="bg-[#F5F7FA] px-5 pb-3">
              <span className="text-[9px] text-[#7E8794] font-bold uppercase tracking-wider mb-2 block select-none">Suggested operational questions</span>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { label: "Predict sales", text: "What is my revenue forecast for next week?" },
                  { label: "Check health index", text: "Why is my merchant health score down?" },
                  { label: "Find peak slots", text: "What are my peak business hours?" },
                  { label: "Check delays", text: "How is my settlement delay risk looking?" },
                ].map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChat(qp.text)}
                    disabled={chatLoading}
                    className="pt-chip pt-chip--ai text-xs font-bold py-1.5 px-3 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Composer */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat(chatInput);
              }}
              className="ai-chat__composer select-none"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Paytm AI: 'Are my payouts delayed?'"
                disabled={chatLoading}
                className="ai-chat__input"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || chatLoading}
                className="ai-chat__send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </div>
        )}

      </div>

      {/* 4. VOICE ASSISTANT SHEET VOICE OVERLAY (Specimen specification: sheet, voice orb with sheen) */}
      {showVoiceOverlay && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-[20px] p-6 shadow-xl flex flex-col items-center gap-6 border-t border-[#E6E9EE]">
            
            {/* Header */}
            <div className="w-full flex justify-between items-center select-none border-b border-[#F0F2F5] pb-3">
              <span className="text-xs font-bold text-[#5A6473] uppercase tracking-wider flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-[#3199E4]" />
                Paytm Voice Assistant
              </span>
              <button 
                onClick={() => {
                  setShowVoiceOverlay(false);
                  setVoiceStatus('idle');
                }} 
                className="text-xs text-[#7E8794] hover:text-[#0A0E1A] font-bold bg-[#F0F2F5] px-2.5 py-1 rounded-full transition-all"
              >
                Close
              </button>
            </div>

            {/* Voice Orb (Specimen spec: background sheen, scale pulse) */}
            <div className="ai-voice flex flex-col items-center gap-4 w-full">
              <button
                onClick={triggerVoiceAssistant}
                disabled={voiceStatus === 'listening' || voiceStatus === 'processing'}
                className={cn(
                  "ai-orb focus:outline-none transition-transform active:scale-95",
                  voiceStatus === 'listening' ? 'ai-orb--listening' :
                  voiceStatus === 'processing' ? 'ai-orb--processing' : ''
                )}
                style={{ border: 0, background: "transparent", cursor: "pointer", padding: 0 }}
                title="Tap to speak"
              >
                {/* Secondary wave ring */}
                <div className="ai-orb__ring r1"></div>
                <div className="ai-orb__ring r2"></div>
                {/* Main Core */}
                <div className="ai-orb__core">
                  <Mic className="h-10 w-10 text-white" />
                </div>
              </button>

              {/* Status text */}
              <div className="ai-voice__status text-sm font-bold text-[#0A0E1A] uppercase tracking-wide">
                {voiceStatus === 'listening' ? 'Listening to voice...' :
                 voiceStatus === 'processing' ? 'Analyzing metrics...' :
                 voiceStatus === 'responding' ? 'Responding...' : 'Tap Mic to Speak'}
              </div>

              {/* Transcript details */}
              {voiceTranscript && (
                <div className="bg-[#FAFBFC] border border-[#E6E9EE] rounded-xl p-3 w-full text-center text-xs text-[#36404F] leading-normal italic">
                  "{voiceTranscript}"
                </div>
              )}

              {/* Responses text */}
              {voiceReply && (
                <div className="bg-[#F4F9FE] border border-[#3199E4]/25 rounded-xl p-4 w-full text-[#0A0E1A] text-xs font-medium leading-relaxed shadow-sm">
                  {voiceReply}
                </div>
              )}
            </div>

            {/* Voice suggestion chip */}
            <div className="w-full text-center text-[10px] text-[#7E8794] font-semibold uppercase tracking-wider mb-2 select-none">
              Try: "How are my settlements clearing?"
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-[10px] font-bold text-[#7E8794] py-8 border-t border-[#E6E9EE] uppercase tracking-wider bg-white mt-12">
        Paytm AI Design Extension &bull; 100% Secure Merchant Platform
      </footer>
    </div>
  );
}
