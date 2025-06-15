
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Ban, Clock } from 'lucide-react';
import { SavedBetSlip } from './BetSlipContext';

interface EditBetSlipModalProps {
  slip: SavedBetSlip | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (amount: string, notes?: string, status?: 'pending' | 'won' | 'lost' | 'void', actualPayout?: number) => void;
}

export const EditBetSlipModal = ({ slip, open, onOpenChange, onSave }: EditBetSlipModalProps) => {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'pending' | 'won' | 'lost' | 'void'>('pending');
  const [actualPayout, setActualPayout] = useState('');

  useEffect(() => {
    if (slip) {
      setAmount(slip.amount);
      setNotes(slip.notes || '');
      setStatus(slip.status);
      setActualPayout(slip.actualPayout?.toString() || '');
    }
  }, [slip]);

  const calculatePotentialPayout = () => {
    if (!slip) return '0.00';
    const amountValue = parseFloat(amount) || 0;
    // Simple calculation - in real app this would use actual odds
    return (amountValue * 2.5).toFixed(2);
  };

  // Auto-populate actual payout when "Won" is selected
  useEffect(() => {
    if (status === 'won' && actualPayout === '') {
      setActualPayout(calculatePotentialPayout());
    }
  }, [status, amount]);

  const handleSubmit = () => {
    const payoutAmount = status === 'won' ? parseFloat(actualPayout) || 0 : 0;
    onSave(amount, notes || undefined, status, payoutAmount);
    onOpenChange(false);
  };

  if (!slip) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Edit Bet Slip</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-slate-400">Bets:</p>
            <div className="space-y-1">
              {slip.bets.map(bet => (
                <div key={bet.id} className="text-sm text-slate-300">
                  {bet.description || bet.subtitle} ({bet.odds})
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bet Amount ($)</label>
            <Input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Status</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={status === 'pending' ? 'default' : 'outline'}
                className={status === 'pending' 
                  ? 'bg-slate-600 hover:bg-slate-700' 
                  : 'border-slate-500/30 text-slate-400 hover:bg-slate-500/10'
                }
                onClick={() => setStatus('pending')}
              >
                <Clock className="w-4 h-4 mr-1" />
                Pending
              </Button>
              <Button
                variant={status === 'won' ? 'default' : 'outline'}
                className={status === 'won' 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                }
                onClick={() => setStatus('won')}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Won
              </Button>
              <Button
                variant={status === 'lost' ? 'default' : 'outline'}
                className={status === 'lost' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                }
                onClick={() => setStatus('lost')}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Lost
              </Button>
              <Button
                variant={status === 'void' ? 'default' : 'outline'}
                className={status === 'void' 
                  ? 'bg-yellow-600 hover:bg-yellow-700' 
                  : 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10'
                }
                onClick={() => setStatus('void')}
              >
                <Ban className="w-4 h-4 mr-1" />
                Void
              </Button>
            </div>
          </div>

          {status === 'won' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Actual Payout ($)</label>
              <Input
                type="number"
                step="0.01"
                value={actualPayout}
                onChange={(e) => setActualPayout(e.target.value)}
                placeholder="Enter actual payout amount"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes..."
              className="bg-slate-700/50 border-slate-600 text-white resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={handleSubmit}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
