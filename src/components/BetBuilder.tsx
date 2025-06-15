
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, DollarSign, TrendingUp, Calculator } from 'lucide-react';

export const BetBuilder = () => {
  const [betAmount, setBetAmount] = useState('');
  const [betslipItems, setBetslipItems] = useState([
    {
      id: 1,
      selection: "Lakers ML",
      odds: "-110",
      edge: 5.2
    },
    {
      id: 2,
      selection: "LeBron Over 25.5 Points",
      odds: "+120",
      edge: 8.1
    }
  ]);

  const calculatePayout = () => {
    if (!betAmount || betslipItems.length === 0) return 0;
    // Simplified payout calculation for demo
    const totalOdds = betslipItems.length > 1 ? 350 : 120; // Example combined odds
    return ((parseFloat(betAmount) * totalOdds) / 100).toFixed(2);
  };

  const calculateEV = () => {
    const avgEdge = betslipItems.reduce((sum, item) => sum + item.edge, 0) / betslipItems.length;
    return avgEdge.toFixed(1);
  };

  const removeBet = (id: number) => {
    setBetslipItems(betslipItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <h1 className="text-xl font-bold">Bet Builder</h1>
        <p className="text-slate-400 text-sm">Build your custom parlay with live odds</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Betslip Items */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Selections</h3>
              <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                {betslipItems.length} {betslipItems.length === 1 ? 'Bet' : 'Leg Parlay'}
              </Badge>
            </div>

            {betslipItems.length === 0 ? (
              <div className="text-center py-8">
                <Plus className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No bets added yet</p>
                <p className="text-sm text-slate-500">Add some bets to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {betslipItems.map((item, index) => (
                  <div key={item.id} className="bg-slate-700/30 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{item.selection}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-slate-400">{item.odds}</span>
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                            {item.edge}% Edge
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBet(item.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Bet Amount */}
        {betslipItems.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700/50 p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Bet Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-slate-400">Potential Payout</span>
                </div>
                <p className="text-lg font-bold text-emerald-400">
                  ${calculatePayout()}
                </p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-slate-400">Expected Value</span>
                </div>
                <p className="text-lg font-bold text-emerald-400">
                  +{calculateEV()}%
                </p>
              </div>
            </div>

            <Separator className="my-4 bg-slate-700" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Risk:</span>
                <span className="text-white">${betAmount || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">To Win:</span>
                <span className="text-emerald-400">
                  ${betAmount ? (parseFloat(calculatePayout()) - parseFloat(betAmount)).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>

            <Button 
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={!betAmount || parseFloat(betAmount) <= 0}
            >
              Place Bet
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};
