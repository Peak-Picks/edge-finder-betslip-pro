
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SavedBetSlip } from './BetSlipContext';

interface EditBetSlipModalProps {
  slip: SavedBetSlip | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (amount: string, notes?: string) => void;
}

export const EditBetSlipModal = ({ slip, open, onOpenChange, onSave }: EditBetSlipModalProps) => {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (slip) {
      setAmount(slip.amount);
      setNotes(slip.notes || '');
    }
  }, [slip]);

  const handleSubmit = () => {
    onSave(amount, notes || undefined);
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
