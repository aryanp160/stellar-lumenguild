import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useGroups } from '../hooks/useGroups';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Plus, Users } from 'lucide-react';
import { useToast } from '../components/Toast';

export function Dashboard() {
  const { address } = useWallet();
  const { groups, createGroup } = useGroups();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const { toast } = useToast();

  if (!address) {
    return <Navigate to="/" replace />;
  }

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      toast("Group name is required", "error");
      return;
    }
    
    createGroup(newGroupName, newGroupDesc, {
      address: address,
      name: 'You (Creator)'
    });
    
    toast("Guild created successfully!", "success");
    setIsModalOpen(false);
    setNewGroupName('');
    setNewGroupDesc('');
  };

  // Filter groups where the current user is a member
  const myGroups = groups.filter(g => g.members.some(m => m.address === address));

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Guilds</h1>
          <p className="text-textMuted">Manage your freelance collectives and projects.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus size={18} />
          New Guild
        </Button>
      </div>

      {myGroups.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-surface/30">
          <Users className="w-12 h-12 text-textMuted mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-white mb-2">No Guilds Yet</h3>
          <p className="text-textMuted mb-6">Create a new guild to start collaborating and tracking expenses.</p>
          <Button onClick={() => setIsModalOpen(true)}>Create your first Guild</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myGroups.map(group => (
            <Link key={group.id} to={`/group/${group.id}`} className="block group">
              <Card className="h-full hover:border-primary/50 transition-colors bg-surface/80 hover:bg-surface">
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">{group.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-textMuted text-sm mb-6 line-clamp-2 min-h-[40px]">
                    {group.description || 'No description provided.'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-textMuted">
                      <Users size={16} />
                      <span>{group.members.length} Members</span>
                    </div>
                    <div className="font-medium text-white">
                      {group.expenses.reduce((sum, e) => sum + e.amount, 0)} XLM
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Guild">
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <Input 
            label="Guild / Project Name" 
            placeholder="e.g. Acme Corp Rebrand" 
            value={newGroupName}
            onChange={e => setNewGroupName(e.target.value)}
            autoFocus
          />
          <Input 
            label="Description (Optional)" 
            placeholder="What is this project about?" 
            value={newGroupDesc}
            onChange={e => setNewGroupDesc(e.target.value)}
          />
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Guild</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
