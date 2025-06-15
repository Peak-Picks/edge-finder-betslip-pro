
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Users, TrendingUp, Flame } from 'lucide-react';
import { useBetSlipContext } from './BetSlipContext';

export const TrendingParlays = () => {
  const { addToBetSlip, betSlip } = useBetSlipContext();

  const trendingParlays = [
    {
      id: "parlay1",
      title: "NBA Superstar Special",
      legs: [
        "LeBron James Over 25.5 Points",
        "Steph Curry Over 4.5 Threes",
        "Luka Dončić Over 8.5 Assists"
      ],
      odds: "+650",
      payout: "$750",
      popularity: 89,
      edge: 5.2
    },
    {
      id: "parlay2",
      title: "Sunday NFL Parlay",
      legs: [
        "Mahomes Over 2.5 Passing TDs",
        "Bills -3.5",
        "Over 48.5 Total Points"
      ],
      odds: "+425",
      payout: "$525",
      popularity: 76,
      edge: 3.8
    },
    {
      id: "parlay3",
      title: "College Basketball Boost",
      legs: [
        "Duke -2.5",
        "UNC Over 75.5 Points",
        "Kentucky ML"
      ],
      odds: "+320",
      payout: "$420",
      popularity: 62,
      edge: 7.1
    }
  ];

  const handleAddParlay = (parlay: typeof trendingParlays[0]) => {
    addToBetSlip({
      id: parlay.id,
      type: "Parlay",
      description: parlay.title,
      odds: parlay.odds,
      edge: parlay.edge,
      legs: parlay.legs
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg font-semibold">Trending Parlays</h2>
        </div>
        <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
          Hot Picks
        </Badge>
      </div>

      <div className="space-y-3">
        {trendingParlays.map((parlay) => (
          <Card key={parlay.id} className="bg-slate-800/50 border-slate-700/50 p-4 hover:bg-slate-800/70 transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{parlay.title}</h3>
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">{parlay.popularity}% of users</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                    {parlay.edge}% Edge
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">{parlay.odds}</div>
                <div className="text-sm text-emerald-400">Pays {parlay.payout}</div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {parlay.legs.map((leg, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-slate-300">{leg}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 bg-slate-700/30 rounded-full h-2">
                <div 
                  className="h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                  style={{ width: `${parlay.popularity}%` }}
                />
              </div>
              <span className="ml-2 text-xs text-slate-400">{parlay.popularity}%</span>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                size="sm"
                onClick={() => handleAddParlay(parlay)}
                disabled={betSlip.some(b => b.id === parlay.id)}
              >
                <Plus className="w-4 h-4 mr-1" />
                {betSlip.some(b => b.id === parlay.id) ? "Added" : "Add Parlay"}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <TrendingUp className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
