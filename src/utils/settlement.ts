import type { Expense, Member, Settlement } from '../hooks/useGroups';

export interface SettlementTransaction {
  fromAddress: string;
  fromName: string;
  toAddress: string;
  toName: string;
  amount: number;
}

export function calculateSettlement(members: Member[], expenses: Expense[], pastSettlements: Settlement[] = []): SettlementTransaction[] {
  if (members.length === 0) return [];
  
  // Calculate total spent by each member
  const spentByMember: Record<string, number> = {};
  members.forEach(m => spentByMember[m.address] = 0);
  
  let totalExpenses = 0;
  expenses.forEach(e => {
    if (spentByMember[e.payerAddress] !== undefined) {
      spentByMember[e.payerAddress] += e.amount;
      totalExpenses += e.amount;
    }
  });

  // Calculate the equal share everyone should pay
  const equalShare = totalExpenses / members.length;

  // Calculate balances (positive = gets paid back, negative = owes money)
  const balances: { address: string; name: string; balance: number }[] = members.map(m => ({
    address: m.address,
    name: m.name,
    balance: spentByMember[m.address] - equalShare
  }));
  
  // Adjust balances based on what has already been settled manually or on-chain
  pastSettlements.forEach(s => {
    const fromMember = balances.find(b => b.address === s.fromAddress);
    const toMember = balances.find(b => b.address === s.toAddress);
    if (fromMember) fromMember.balance += s.amount;
    if (toMember) toMember.balance -= s.amount;
  });

  const debtors = balances.filter(b => b.balance < -0.0001).sort((a, b) => a.balance - b.balance); // Most negative first
  const creditors = balances.filter(b => b.balance > 0.0001).sort((a, b) => b.balance - a.balance); // Most positive first

  const transactions: SettlementTransaction[] = [];

  let d = 0;
  let c = 0;

  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];

    const amountToSettle = Math.min(Math.abs(debtor.balance), creditor.balance);

    if (amountToSettle > 0.0001) {
      transactions.push({
        fromAddress: debtor.address,
        fromName: debtor.name,
        toAddress: creditor.address,
        toName: creditor.name,
        amount: Number(amountToSettle.toFixed(7)) // Stellar uses 7 decimals
      });
    }

    debtor.balance += amountToSettle;
    creditor.balance -= amountToSettle;

    if (Math.abs(debtor.balance) < 0.0001) d++;
    if (Math.abs(creditor.balance) < 0.0001) c++;
  }

  return transactions;
}
