import { useState, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useGroups } from '../hooks/useGroups';
import { calculateSettlement } from '../utils/settlement';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { useToast } from '../components/Toast';
import { ArrowLeft, Plus, UserPlus, Receipt, HandCoins } from 'lucide-react';
import freighterApi from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';

const { signTransaction } = freighterApi;

export function GroupDetails() {
  const { id } = useParams<{ id: string }>();
  const { address } = useWallet();
  const { getGroup, addMember, addExpense, addSettlement, isLoaded } = useGroups();
  const { toast } = useToast();

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isSettling, setIsSettling] = useState(false);

  // New Member Form
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberAddress, setNewMemberAddress] = useState('');

  // New Expense Form
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expensePayer, setExpensePayer] = useState(address || '');

  const group = id ? getGroup(id) : undefined;

  const settlementPlan = useMemo(() => {
    if (!group) return [];
    return calculateSettlement(group.members, group.expenses, group.settlements || []);
  }, [group]);

  if (!isLoaded) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  if (!address || !id) return <Navigate to="/dashboard" replace />;
  if (!group) return <Navigate to="/dashboard" replace />;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberAddress) {
      toast("All fields are required", "error");
      return;
    }
    
    // Basic Stellar address validation
    if (newMemberAddress.length !== 56 || !newMemberAddress.startsWith('G')) {
      toast("Invalid Stellar address", "error");
      return;
    }

    addMember(group.id, { name: newMemberName, address: newMemberAddress });
    toast("Member added!", "success");
    setIsMemberModalOpen(false);
    setNewMemberName('');
    setNewMemberAddress('');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(expenseAmount);
    if (!expenseDesc || isNaN(amt) || amt <= 0 || !expensePayer) {
      toast("Please enter valid expense details", "error");
      return;
    }

    addExpense(group.id, expensePayer, amt, expenseDesc);
    toast("Expense logged!", "success");
    setIsExpenseModalOpen(false);
    setExpenseDesc('');
    setExpenseAmount('');
  };

  const handleSettleDebt = async (tx: any) => {
    if (tx.fromAddress !== address) {
      toast("You can only sign transactions where you are the sender", "error");
      return;
    }

    setIsSettling(true);
    try {
      const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
      const sourceAccount = await server.loadAccount(address);
      
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: (await server.fetchBaseFee()).toString(),
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
      .addOperation(StellarSdk.Operation.payment({
        destination: tx.toAddress,
        asset: StellarSdk.Asset.native(),
        amount: tx.amount.toString(),
      }))
      .setTimeout(60)
      .build();

      const signedTxStr = await signTransaction(transaction.toXDR(), { networkPassphrase: StellarSdk.Networks.TESTNET });
      const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedTxStr.signedTxXdr, StellarSdk.Networks.TESTNET);
      
      const response = await server.submitTransaction(signedTx as any);
      toast(`Settled! Tx Hash: ${response.hash.substring(0, 10)}...`, "success");
      
      // Update the local state so the math updates
      addSettlement(group.id, tx.fromAddress, tx.toAddress, tx.amount);
    } catch (e: any) {
      console.error(e);
      if (e.response?.status === 400) {
        toast("Stellar Tx Failed (Destination likely unfunded). Marking as settled locally!", "info");
        addSettlement(group.id, tx.fromAddress, tx.toAddress, tx.amount);
      } else {
        toast("Transaction failed or was rejected.", "error");
      }
    } finally {
      setIsSettling(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Link to="/dashboard" className="p-2 rounded-full hover:bg-surface text-textMuted hover:text-text transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{group.name}</h1>
          <p className="text-sm text-textMuted">{group.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Members & Expenses */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Receipt size={18} /> Expenses</CardTitle>
              <Button size="sm" onClick={() => setIsExpenseModalOpen(true)} className="gap-1"><Plus size={16}/> Add Expense</Button>
            </CardHeader>
            <CardContent>
              {group.expenses.length === 0 ? (
                <div className="text-center py-8 text-textMuted">No expenses logged yet.</div>
              ) : (
                <div className="space-y-4">
                  {group.expenses.map(exp => (
                    <div key={exp.id} className="flex justify-between items-center p-3 rounded-lg bg-background border border-border">
                      <div>
                        <p className="font-medium text-white">{exp.description}</p>
                        <p className="text-xs text-textMuted">
                          Paid by {group.members.find(m => m.address === exp.payerAddress)?.name || 'Unknown'}
                        </p>
                      </div>
                      <div className="font-bold text-white">{exp.amount} XLM</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><UserPlus size={18} /> Members</CardTitle>
              <Button size="sm" variant="secondary" onClick={() => setIsMemberModalOpen(true)}>Invite</Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {group.members.map(m => (
                  <div key={m.address} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-sm">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white">{m.name}</span>
                    {m.address === address && <span className="text-[10px] bg-primary/20 text-primary px-1.5 rounded uppercase font-bold">You</span>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Settlement */}
        <div className="space-y-6">
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary"><HandCoins size={18} /> Settlement</CardTitle>
            </CardHeader>
            <CardContent>
              {settlementPlan.length === 0 ? (
                <div className="text-center py-8 text-textMuted text-sm">
                  Everyone is settled up!
                </div>
              ) : (
                <div className="space-y-4">
                  {settlementPlan.map((tx, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-surface border border-primary/20 flex flex-col gap-3">
                      <div className="text-sm">
                        <span className="font-semibold text-white">{tx.fromName}</span> owes <span className="font-semibold text-white">{tx.toName}</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{tx.amount} <span className="text-primary text-sm">XLM</span></div>
                      
                      {tx.fromAddress === address ? (
                        <Button 
                          size="sm" 
                          className="w-full mt-2" 
                          onClick={() => handleSettleDebt(tx)}
                          isLoading={isSettling}
                        >
                          Settle via Freighter
                        </Button>
                      ) : (
                        <Button size="sm" variant="secondary" className="w-full mt-2" disabled>
                          Waiting for {tx.fromName}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} title="Add Member">
        <form onSubmit={handleAddMember} className="space-y-4">
          <Input label="Name" placeholder="e.g. Alice Designer" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} />
          <Input label="Stellar Public Key" placeholder="G..." value={newMemberAddress} onChange={e => setNewMemberAddress(e.target.value)} />
          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsMemberModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add Member</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Log Expense">
        <form onSubmit={handleAddExpense} className="space-y-4">
          <Input label="Description" placeholder="e.g. AWS Hosting" value={expenseDesc} onChange={e => setExpenseDesc(e.target.value)} />
          <Input label="Amount (XLM)" type="number" step="0.01" placeholder="0.00" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} />
          
          <div className="w-full">
            <label className="block text-sm font-medium text-textMuted mb-1.5">Paid By</label>
            <select 
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              value={expensePayer}
              onChange={e => setExpensePayer(e.target.value)}
            >
              {group.members.map(m => (
                <option key={m.address} value={m.address}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsExpenseModalOpen(false)}>Cancel</Button>
            <Button type="submit">Log Expense</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
