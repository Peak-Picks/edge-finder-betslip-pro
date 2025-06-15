
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp } from 'lucide-react';

export const GameLines = () => {
  const gameLines = [
    {
      id: 1,
      homeTeam: "Lakers",
      awayTeam: "Warriors",
      time: "8:00 PM ET",
      homeSpread: "-3.5",
      awaySpread: "+3.5",
      homeML: "-165",
      awayML: "+145",
      total: "225.5",
      overOdds: "-110",
      underOdds: "-110",
      edge: {
        spread: 4.2,
        moneyline: 2.8,
        total: 3.5
      }
    },
    {
      id: 2,
      homeTeam: "Celtics",
      awayTeam: "Heat",
      time: "7:30 PM ET",
      homeSpread: "-7.5",
      awaySpread: "+7.5",
      homeML: "-320",
      awayML: "+260",
      total: "218.5",
      overOdds: "-105",
      underOdds: "-115",
      edge: {
        spread: 6.1,
        moneyline: 1.9,
        total: 5.7
      }
    },
    {
      id: 3,
      homeTeam: "Chiefs",
      awayTeam: "Bills",
      time: "4:25 PM ET",
      homeSpread: "-2.5",
      awaySpread: "+2.5",
      homeML: "-130",
      awayML: "+110",
      total: "47.5",
      overOdds: "-110",
      underOdds: "-110",
      edge: {
        spread: 7.3,
        moneyline: 4.1,
        total: 2.4
      }
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Game Lines</h2>
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
          Live Lines
        </Badge>
      </div>

      <div className="space-y-3">
        {gameLines.map((game) => (
          <Card key={game.id} className="bg-slate-800/50 border-slate-700/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">{game.awayTeam} @ {game.homeTeam}</h3>
                <p className="text-sm text-slate-400">{game.time}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="space-y-4">
              {/* Spread */}
              <div className="bg-slate-700/30 rounded-lg p-3">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Spread</h4>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300">{game.awayTeam} {game.awaySpread}</span>
                      <span className="text-emerald-400 font-medium">-110</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{game.homeTeam} {game.homeSpread}</span>
                      <span className="text-emerald-400 font-medium">-110</span>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs mb-1">
                      {game.edge.spread}% Edge
                    </Badge>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Money Line */}
              <div className="bg-slate-700/30 rounded-lg p-3">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Money Line</h4>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300">{game.awayTeam}</span>
                      <span className="text-emerald-400 font-medium">{game.awayML}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{game.homeTeam}</span>
                      <span className="text-emerald-400 font-medium">{game.homeML}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs mb-1">
                      {game.edge.moneyline}% Edge
                    </Badge>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Total Points */}
              <div className="bg-slate-700/30 rounded-lg p-3">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Total Points</h4>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300">Over {game.total}</span>
                      <span className="text-emerald-400 font-medium">{game.overOdds}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Under {game.total}</span>
                      <span className="text-emerald-400 font-medium">{game.underOdds}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs mb-1">
                      {game.edge.total}% Edge
                    </Badge>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
