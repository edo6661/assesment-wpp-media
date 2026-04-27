import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PageLoader from './pages/PageLoader';
import { QueryProvider } from './providers/QueryProvider';
import RootLayout from './components/layouts/RootLayout';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const App = () => {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryProvider>
  );
};
export default App;