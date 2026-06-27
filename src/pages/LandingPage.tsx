import { useWallet } from '../context/WalletContext';
import { Navigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Users, Receipt, ArrowRightLeft } from 'lucide-react';

export function LandingPage() {
  const { address, connect, isConnecting } = useWallet();

  // Redirect to dashboard if already connected
  if (address) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-4xl mx-auto">
      <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        Built on Stellar
      </div>
      
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
        Decentralized <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
          Freelance Collectives
        </span>
      </h1>
      
      <p className="text-xl text-textMuted mb-10 max-w-2xl leading-relaxed">
        Form ad-hoc guilds for client projects. Track shared expenses, run automatic settlement math, and reimburse everyone instantly on the Stellar network.
      </p>

      <Button size="lg" onClick={connect} isLoading={isConnecting} className="text-lg px-8 h-14 rounded-xl shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] transition-shadow">
        Connect Wallet to Enter
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left w-full">
        <div className="p-6 rounded-2xl bg-surface/50 border border-border">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <Users className="text-primary w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Form Guilds</h3>
          <p className="text-textMuted">Create a group for your next big client project and invite your collaborators.</p>
        </div>
        
        <div className="p-6 rounded-2xl bg-surface/50 border border-border">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
            <Receipt className="text-purple-500 w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Track Expenses</h3>
          <p className="text-textMuted">Log out-of-pocket costs like hosting, fonts, and assets effortlessly.</p>
        </div>

        <div className="p-6 rounded-2xl bg-surface/50 border border-border">
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
            <ArrowRightLeft className="text-success w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Instant Settlement</h3>
          <p className="text-textMuted">Automatically calculate who owes who and settle up using Stellar XLM or USDC.</p>
        </div>
      </div>
    </div>
  );
}
