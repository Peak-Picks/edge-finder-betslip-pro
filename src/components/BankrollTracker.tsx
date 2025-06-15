
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, Filter } from 'lucide-react';

export const BankrollTracker = () => {
  const stats = {
    totalBets: 47,
    winRate: 62.3,
    roi: 12.3,
    profit: 247.50,
    units: "+2.48"
  };

  const recentBets = [
    {
      id: 1,
      bet: "Lakers ML",
      stake: 25,
      odds: "-110",
      result: "win",
      profit: 22.73,
      date: "Today"
    },
    {
      id: 2,
      bet: "Mahomes Over 2.5 TDs",
      stake: 50,
      odds: "+120",
      result: "loss",
      profit: -50,
      date: "Yesterday"
    },
    {
      id: 3,
      bet: "Celtics -4.5",
      stake: 30,
      odds: "-115",
      result: "win",
      profit: 26.09,
      date: "2 days ago"
    }
  ];

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
              <p className="text-2xl font-bold text-emerald-400">{stats.winRate}%</p>
            </div>
            <Target className="w-8 h-8 text-emerald-400" />
          </div>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">ROI</p>
              <p className="text-2xl font-bold text-emerald-400">+{stats.roi}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-400" />
          </div>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Profit</p>
              <p className="text-2xl font-bold text-emerald-400">${stats.profit}</p>
            </div>
            <DollarSign className="w-8 h-8 text-emerald-400" />
          </div>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Units</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.units}</p>
            </div>
            <Calendar className="w-8 h-8 text-emerald-400" />
          </div>
        </Card>
      </div>

      {/* Recent Bets */}
      <div>
        <h3 className="text-md font-semibold mb-3">Recent Bets</h3>
        <div className="space-y-3">
          {recentBets.map((bet) => (
            <Card key={bet.id} className="bg-slate-800/50 border-slate-700/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-white">{bet.bet}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-slate-400">${bet.stake} @ {bet.odds}</span>
                    <Badge 
                      className={
                        bet.result === 'win' 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }
                    >
                      {bet.result}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${bet.profit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {bet.profit > 0 ? '+' : ''}${bet.profit}
                  </div>
                  <div className="text-xs text-slate-400">{bet.date}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
