import { Outlet } from 'react-router-dom';
const RootLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default RootLayout;