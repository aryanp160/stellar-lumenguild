import { Outlet, Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { Button } from './Button';
import { Wallet } from 'lucide-react';

export function Layout() {
  const { address, isConnecting, connect, disconnect } = useWallet();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Lumen<span className="text-primary">Guild</span></span>
          </Link>
          
          <div className="flex items-center gap-4">
            {address ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="text-sm font-medium text-textMuted hover:text-white transition-colors">
                  Dashboard
                </Link>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2 bg-background border border-border rounded-full py-1.5 px-3">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-medium text-textMuted">
                    {address.slice(0, 5)}...{address.slice(-4)}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={disconnect}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={connect} isLoading={isConnecting} className="gap-2">
                <Wallet size={16} />
                Connect Freighter
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-textMuted">
        <p>Built for the Stellar Journey to Mastery</p>
      </footer>
    </div>
  );
}
