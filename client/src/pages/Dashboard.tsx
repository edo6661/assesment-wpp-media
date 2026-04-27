import React, { useState, useMemo } from 'react';
import { Sparkles, Send, Bot, AlertCircle, Database } from 'lucide-react';
import { usePredict } from '../hooks/usePredict';
import DataTable from '../components/shared/DataTable';
const Dashboard = () => {
  const [prompt, setPrompt] = useState('');
  const { mutate: predict, data, isPending, error } = usePredict();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    predict(prompt);
  };
  const tableConfig = useMemo(() => {
    if (!data) return null;
    const intent = data.structured_output.intent;
    switch (intent) {
      case 'product_search':
        return {
          title: 'Products Inventory',
          columns: [
            { header: 'Product Name', accessor: 'name' },
            { header: 'Brand', accessor: 'brand' },
            { header: 'Category', accessor: 'category', render: (val: string) => <span className="capitalize">{val}</span> },
            { header: 'Price', accessor: 'price', render: (val: number | string) => `Rp ${new Intl.NumberFormat('id-ID').format(Number(val))}` },
          ]
        };
      case 'audience_search':
        return {
          title: 'Target Audiences',
          columns: [
            { header: 'Audience Name', accessor: 'name' },
            { header: 'Age Range', accessor: 'age_range', render: (val: string) => <span className="uppercase text-xs font-bold">{val}</span> },
            { header: 'Preferences', accessor: 'preferences' },
          ]
        };
      case 'campaign_search':
        return {
          title: 'Marketing Campaigns',
          columns: [
            { header: 'Campaign Name', accessor: 'name' },
            { header: 'Target Audience', accessor: 'audience', render: (val: any) => val?.name || '-' },
            { header: 'Featured Product', accessor: 'product', render: (val: any) => val?.name || '-' },
            { header: 'Budget', accessor: 'budget', render: (val: number | string) => `Rp ${new Intl.NumberFormat('id-ID').format(Number(val))}` },
          ]
        };
      case 'performance_query':
        return {
          title: 'Campaign Performance',
          columns: [
            { header: 'Campaign', accessor: 'campaign', render: (val: any) => <span className="font-bold">{val?.name || '-'}</span> },
            { header: 'Impressions', accessor: 'impressions', render: (val: number) => new Intl.NumberFormat('id-ID').format(val) },
            { header: 'Clicks', accessor: 'clicks', render: (val: number) => new Intl.NumberFormat('id-ID').format(val) },
            { header: 'Conversions', accessor: 'conversions', render: (val: number) => <span className="text-green-600 font-bold">{new Intl.NumberFormat('id-ID').format(val)}</span> },
          ]
        };
      default:
        return {
          title: 'Search Results',
          columns: [
            { header: 'ID', accessor: 'id' }
          ]
        };
    }
  }, [data]);
  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-2xl mb-2">
            <Bot size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">AI Data Assistant</h1>
          <p className="text-slate-500 font-medium">Query your relational database using natural language.</p>
        </div>
        <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-200/60 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <div className="absolute left-4 text-slate-400">
              <Sparkles size={20} />
            </div>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Show me skincare products for gen z under 100k..."
              className="w-full pl-12 pr-32 py-4 bg-transparent border-none text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0 text-[15px]"
              disabled={isPending}
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isPending}
              className="absolute right-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending ? 'Processing...' : 'Ask AI'}
              {!isPending && <Send size={16} />}
            </button>
          </form>
        </div>
        {error && (
          <div className="max-w-3xl mx-auto p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{error.message}</p>
          </div>
        )}
        {data && tableConfig && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-[20px] border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Detected Intent</h3>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm border border-indigo-100">
                  <Database size={16} />
                  {data.structured_output.intent}
                </div>
              </div>
              <div className="flex-[2] md:border-l md:border-slate-100 md:pl-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Extracted Entities</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(data.structured_output.entities).map(([key, value]) => (
                    value !== undefined && value !== null && value !== '' && (
                      <div key={key} className="flex items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px]">
                        <span className="font-semibold text-slate-500 capitalize mr-2">{key.replace('_', ' ')}:</span>
                        <span className="font-bold text-slate-800">
                          {(typeof value === 'number' && (key.includes('price') || key.includes('budget')))
                            ? `Rp ${new Intl.NumberFormat('id-ID').format(value)}`
                            : String(value)}
                        </span>
                      </div>
                    )
                  ))}
                  {Object.values(data.structured_output.entities).every(val => val === undefined || val === null || val === '') && (
                    <span className="text-sm text-slate-400 italic">No specific entities detected.</span>
                  )}
                </div>
              </div>
            </div>
            {data.structured_output.intent === 'unknown' ? (
              <div className="bg-white p-12 rounded-[20px] border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
                <AlertCircle size={32} className="text-slate-300 mb-3" />
                <h3 className="text-slate-800 font-bold mb-1">Unrecognized Query</h3>
                <p className="text-slate-500 text-sm">The AI couldn't map your query to a known dataset. Please try rephrasing.</p>
              </div>
            ) : (
              <DataTable
                title={tableConfig.title}
                columns={tableConfig.columns}
                data={data.retrieved_data}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;