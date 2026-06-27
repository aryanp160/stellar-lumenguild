import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Member {
  address: string;
  name: string;
}

export interface Expense {
  id: string;
  payerAddress: string;
  amount: number;
  description: string;
  date: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: Member[];
  expenses: Expense[];
  createdAt: string;
}

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('lumenguild_groups');
    if (stored) {
      try {
        setGroups(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse groups from localStorage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveGroups = (newGroups: Group[]) => {
    setGroups(newGroups);
    localStorage.setItem('lumenguild_groups', JSON.stringify(newGroups));
  };

  const createGroup = (name: string, description: string, creator: Member) => {
    const newGroup: Group = {
      id: uuidv4(),
      name,
      description,
      members: [creator],
      expenses: [],
      createdAt: new Date().toISOString()
    };
    saveGroups([newGroup, ...groups]);
    return newGroup;
  };

  const addMember = (groupId: string, member: Member) => {
    const newGroups = groups.map(g => {
      if (g.id === groupId) {
        // Prevent duplicates
        if (!g.members.find(m => m.address === member.address)) {
          return { ...g, members: [...g.members, member] };
        }
      }
      return g;
    });
    saveGroups(newGroups);
  };

  const addExpense = (groupId: string, payerAddress: string, amount: number, description: string) => {
    const newExpense: Expense = {
      id: uuidv4(),
      payerAddress,
      amount,
      description,
      date: new Date().toISOString()
    };
    
    const newGroups = groups.map(g => {
      if (g.id === groupId) {
        return { ...g, expenses: [...g.expenses, newExpense] };
      }
      return g;
    });
    saveGroups(newGroups);
  };

  const getGroup = (id: string) => groups.find(g => g.id === id);

  return {
    groups,
    isLoaded,
    createGroup,
    addMember,
    addExpense,
    getGroup
  };
}
