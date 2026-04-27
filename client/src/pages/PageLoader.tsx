import { Bot } from 'lucide-react';
const PageLoader = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 space-y-4">
      <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl animate-pulse">
        <Bot size={40} />
      </div>
      <p className="text-slate-500 font-medium animate-pulse">Loading Workspace...</p>
    </div>
  );
};
export default PageLoader;