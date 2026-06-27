import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import freighterApi from '@stellar/freighter-api';
const { isAllowed, setAllowed, getAddress, getNetwork } = freighterApi;
import { useToast } from '../components/Toast';

interface WalletContextType {
  address: string | null;
  network: string | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const allowed = await isAllowed();
      if (allowed) {
        const userInfo = await getAddress();
        const net = await getNetwork();
        if (userInfo.address) {
          setAddress(userInfo.address);
          setNetwork(net.network || net.networkPassphrase || 'UNKNOWN');
        }
      }
    } catch (error) {
      console.error("Error checking Freighter connection:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const connect = async () => {
    setIsConnecting(true);
    try {
      const allowed = await setAllowed();
      if (allowed) {
        const userInfo = await getAddress();
        const net = await getNetwork();
        if (userInfo.address) {
          setAddress(userInfo.address);
          setNetwork(net.network || net.networkPassphrase || 'UNKNOWN');
          toast("Connected to Freighter", "success");
        }
      } else {
        toast("Connection rejected", "error");
      }
    } catch (error: any) {
      toast("Make sure Freighter extension is installed", "error");
      console.error(error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    // Freighter doesn't have a strict disconnect method that revokes permission via API cleanly,
    // so we just clear the local state to log them out of our app.
    setAddress(null);
    setNetwork(null);
    toast("Disconnected from wallet", "info");
  };

  return (
    <WalletContext.Provider value={{ address, network, isConnecting, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return context;
}
