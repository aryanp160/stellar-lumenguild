import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { ToastProvider } from './components/Toast';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { GroupDetails } from './pages/GroupDetails';

function App() {
  return (
    <ToastProvider>
      <WalletProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="group/:id" element={<GroupDetails />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </ToastProvider>
  );
}

export default App;
