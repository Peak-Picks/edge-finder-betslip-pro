
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Ban } from 'lucide-react';
import { SavedBetSlip } from './BetSlipContext';

interface BetResultModalProps {
  slip: SavedBetSlip | null;
  slipIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkResult: (slipIndex: number, status: 'won' | 'lost' | 'void', actualPayout?: number, notes?: string) => void;
}

export const BetResultModal = ({ slip, slipIndex, open, onOpenChange, onMarkResult }: BetResultModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<'won' | 'lost' | 'void' | null>(null);
  const [actualPayout, setActualPayout] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!selectedStatus) return;
    
    const payoutAmount = selectedStatus === 'won' ? parseFloat(actualPayout) || 0 : 0;
    onMarkResult(slipIndex, selectedStatus, payoutAmount, notes || undefined);
    
    // Reset form
    setSelectedStatus(null);
    setActualPayout('');
    setNotes('');
    onOpenChange(false);
  };

  const calculatePotentialPayout = () => {
    if (!slip) return '0.00';
    const amount = parseFloat(slip.amount) || 0;
    // Simple calculation - in real app this would use actual odds
    return (amount * 2.5).toFixed(2);
  };

  if (!slip) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Mark Bet Result</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-slate-400">Bet Slip #{slipIndex + 1}</p>
            <div className="space-y-1">
              {slip.bets.map(bet => (
                <div key={bet.id} className="text-sm">
                  <span className="text-slate-300">
                    {bet.description || bet.subtitle} ({bet.odds})
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Wager: ${slip.amount}</span>
              <span className="text-slate-400">Potential: ${calculatePotentialPayout()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Select Result:</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={selectedStatus === 'won' ? 'default' : 'outline'}
                className={selectedStatus === 'won' 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                }
                onClick={() => setSelectedStatus('won')}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Won
              </Button>
              <Button
                variant={selectedStatus === 'lost' ? 'default' : 'outline'}
                className={selectedStatus === 'lost' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                }
                onClick={() => setSelectedStatus('lost')}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Lost
              </Button>
              <Button
                variant={selectedStatus === 'void' ? 'default' : 'outline'}
                className={selectedStatus === 'void' 
                  ? 'bg-yellow-600 hover:bg-yellow-700' 
                  : 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10'
                }
                onClick={() => setSelectedStatus('void')}
              >
                <Ban className="w-4 h-4 mr-1" />
                Void
              </Button>
            </div>
          </div>

          {selectedStatus === 'won' && (
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
              placeholder="Add any notes about this bet..."
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
              disabled={!selectedStatus}
            >
              Save Result
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
