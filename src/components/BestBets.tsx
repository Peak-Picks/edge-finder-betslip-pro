
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Plus, Star, Clock } from 'lucide-react';

export const BestBets = () => {
  const bestBets = [
    {
      id: 1,
      title: "Lakers vs Warriors",
      subtitle: "LeBron James Over 25.5 Points",
      edge: 8.2,
      confidence: "high",
      odds: "+110",
      projectedValue: 28.3,
      bookmaker: "DraftKings",
      gameTime: "8:00 PM ET",
      reasoning: "LeBron is averaging 31.2 points per game against the Warriors this season and is coming off a three-game 35+ point streak. Warriors struggle to defend high-usage forwards (allowing 2.5 points per attempt above league average), and LeBron’s usage increases by 9% in games projected to finish within 5 points. Simulated outcomes project him over 25.5 in 68% of AI model runs. Injury report is favorable and reported defensive assignments increase his scoring ceiling."
    },
    {
      id: 2,
      title: "Chiefs vs Bills",
      subtitle: "Patrick Mahomes Over 2.5 Passing TDs",
      edge: 12.5,
      confidence: "high",
      odds: "-115",
      projectedValue: 3.1,
      bookmaker: "FanDuel",
      gameTime: "4:25 PM ET",
      reasoning: "Mahomes faces a Bills defense allowing 2.8 passing TDs per game over their last 5. AI analysis factors in offensive line strength, red zone efficiency (Chiefs top 5), and game script projecting above league-average pass attempts. Simulations project 3.14 TDs on average. Weather: Clear, moderate winds, which correlates with a 7% uptick in passing efficiency for Mahomes at home. AI model gives a 65% probability for the over."
    },
    {
      id: 3,
      title: "Celtics vs Heat",
      subtitle: "Jayson Tatum Over 8.5 Rebounds",
      edge: 6.1,
      confidence: "medium",
      odds: "+125",
      projectedValue: 9.8,
      bookmaker: "BetMGM",
      gameTime: "7:30 PM ET",
      reasoning: "AI projects Tatum for 10+ rebounds in this matchup due to increased time at power forward and Miami’s key frontcourt injuries. Past 10 games, Heat allow the 2nd most rebounds to AI-profiled comparable forwards. Celtics’ pace increases against fast break teams, further boosting rebounding opportunities. Model shows 59% hit rate at this line."
    }
  ];

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-semibold">Today's Best Bets</h2>
        </div>
        <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
          {bestBets.length} Available
        </Badge>
      </div>

      <div className="space-y-3">
        {bestBets.map((bet) => (
          <Card key={bet.id} className="bg-slate-800/50 border-slate-700/50 p-4 hover:bg-slate-800/70 transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{bet.title}</h3>
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">{bet.gameTime}</span>
                </div>
                <p className="text-emerald-400 font-medium mb-2">{bet.subtitle}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getConfidenceColor(bet.confidence)}>
                    {bet.edge}% Edge
                  </Badge>
                </div>
                <div className="text-lg font-bold text-white">{bet.odds}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
              <div>
                <p className="text-slate-400">Projected</p>
                <p className="text-white font-medium">{bet.projectedValue}</p>
              </div>
              <div>
                <p className="text-slate-400">Sportsbook</p>
                <p className="text-white font-medium">{bet.bookmaker}</p>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-3 mb-3">
              <p className="text-xs text-emerald-100">{bet.reasoning}</p>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add to Betslip
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
