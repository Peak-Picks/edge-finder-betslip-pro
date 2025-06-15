
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, Filter } from 'lucide-react';
import { useBetSlipContext } from './BetSlipContext';

export const BankrollTracker = () => {
  const { savedBetSlips } = useBetSlipContext();

  const calculateStats = () => {
    const settled = savedBetSlips.filter(slip => slip.status !== 'pending');
    const won = settled.filter(slip => slip.status === 'won');
    const totalWagered = savedBetSlips.reduce((sum, slip) => sum + parseFloat(slip.amount), 0);
    const totalReturns = settled.reduce((sum, slip) => sum + (slip.actualPayout || 0), 0);
    const profit = totalReturns - settled.reduce((sum, slip) => sum + parseFloat(slip.amount), 0);
    const roi = totalWagered > 0 ? (profit / totalWagered) * 100 : 0;
    const units = totalWagered > 0 ? profit / (totalWagered / savedBetSlips.length || 25) : 0; // Assuming average unit size

    return {
      totalBets: savedBetSlips.length,
      winRate: settled.length > 0 ? ((won.length / settled.length) * 100) : 0,
      roi: roi,
      profit: profit,
      units: units
    };
  };

  const stats = calculateStats();

  // Convert saved bet slips to recent bets format
  const recentBets = savedBetSlips
    .slice()
    .reverse()
    .slice(0, 5)
    .map((slip, index) => ({
      id: slip.timestamp,
      bet: slip.bets.length === 1 
        ? slip.bets[0].description || slip.bets[0].subtitle || 'Single Bet'
        : `${slip.bets.length}-leg Parlay`,
      stake: parseFloat(slip.amount),
      odds: slip.bets.length === 1 
        ? slip.bets[0].odds 
        : 'Parlay',
      result: slip.status === 'pending' ? 'pending' : slip.status,
      profit: slip.status === 'won' 
        ? (slip.actualPayout || 0) - parseFloat(slip.amount)
        : slip.status === 'lost' 
        ? -parseFloat(slip.amount)
        : 0,
      date: index === 0 ? 'Today' : index === 1 ? 'Yesterday' : `${index} days ago`
    }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Bankroll Tracker</h2>
        <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
          <Filter className="w-4 h-4 mr-1" />
          Filter
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-slate-800/50 border-slate-700/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Win Rate</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.winRate.toFixed(1)}%</p>
            </div>
            <Target className="w-8 h-8 text-emerald-400" />
          </div>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">ROI</p>
              <p className={`text-2xl font-bold ${stats.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.roi >= 0 ? '+' : ''}{stats.roi.toFixed(1)}%
              </p>
            </div>
            {stats.roi >= 0 ? (
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-400" />
            )}
          </div>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Profit</p>
              <p className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-emerald-400" />
          </div>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Units</p>
              <p className={`text-2xl font-bold ${stats.units >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.units >= 0 ? '+' : ''}{stats.units.toFixed(2)}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-emerald-400" />
          </div>
        </Card>
      </div>

      {/* Recent Bets */}
      <div>
        <h3 className="text-md font-semibold mb-3">Recent Bets</h3>
        <div className="space-y-3">
          {recentBets.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700/50 p-8 text-center">
              <p className="text-slate-400">No bets yet</p>
            </Card>
          ) : (
            recentBets.map((bet) => (
              <Card key={bet.id} className="bg-slate-800/50 border-slate-700/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{bet.bet}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-slate-400">${bet.stake} @ {bet.odds}</span>
                      <Badge 
                        className={
                          bet.result === 'won' 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : bet.result === 'lost'
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : bet.result === 'void'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                        }
                      >
                        {bet.result}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${bet.profit > 0 ? 'text-emerald-400' : bet.profit < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                      {bet.profit > 0 ? '+' : ''}${bet.profit.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400">{bet.date}</div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
