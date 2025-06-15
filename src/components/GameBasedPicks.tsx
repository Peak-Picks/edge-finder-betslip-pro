
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Plus, BarChart3, Clock } from 'lucide-react';
import { useBetSlipContext } from './BetSlipContext';

export const GameBasedPicks = () => {
  const { addToBetSlip, betSlip } = useBetSlipContext();
  const gamePicks = [
    {
      id: 101,
      matchup: 'Lakers vs Warriors',
      type: 'Spread',
      pick: 'Lakers -3.5',
      odds: '-110',
      edge: 4.9,
      confidence: 'medium',
      bookmaker: 'DraftKings',
      gameTime: '8:00 PM ET',
      aiInsight: "The AI model projects the Lakers to outperform the spread due to significant rebound and transition advantages against a Warriors defense ranked in the bottom third for defensive rating on the road. Lakers' adjusted +6.2 net rating at home and LeBron's stronger on/off splits increase expected point margin. Simulations have Lakers covering this spread 61% of the time. Additional factors: Warriors' top scorer’s ankle injury affects expected pace. LA’s preferred switching defense is expected to limit Golden State’s drives, while betting market consensus projects a line closer to -5."
    },
    {
      id: 102,
      matchup: 'Celtics vs Heat',
      type: 'Total',
      pick: 'Under 218.5',
      odds: '-115',
      edge: 6.7,
      confidence: 'high',
      bookmaker: 'BetMGM',
      gameTime: '7:30 PM ET',
      aiInsight: "AI predicts a defensive-focused contest, with both teams in the top 6 for defensive efficiency over the last 10 games. The Heat’s pace drops significantly against top-tier opponents, and recent injury adjustments forecast a 211 total. Historical data shows 8 of the last 10 meetings finishing under this line. 74% model confidence. Weather: No impact. AI notes: If Celtics’ Robert Williams is ruled out (questionable), predicted total drops by another 2.3 points. Key On/Off metrics are baked into the total."
    },
    {
      id: 103,
      matchup: 'Chiefs vs Bills',
      type: 'Moneyline',
      pick: 'Chiefs ML',
      odds: '-130',
      edge: 7.5,
      confidence: 'high',
      bookmaker: 'FanDuel',
      gameTime: '4:25 PM ET',
      aiInsight: "After analyzing home/away splits, QB matchups, and late-season trends, AI rates Chiefs' win probability at 61%, factoring injury updates and weather. Mahomes' EPA/play increases to 0.35 at home vs. playoff teams, while Bills struggle in red zone defense (ranked 23rd last 8 games). This value is above market consensus. Noted: KC also ranks 2nd in special teams DVOA, which can swing close games; sharp money from betting exchanges has moved the line from -120 to -130."
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
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold">Game-Based AI Picks</h2>
        </div>
        <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300">
          {gamePicks.length} Available
        </Badge>
      </div>
      <div className="space-y-3">
        {gamePicks.map((pick) => (
          <Card key={pick.id} className="bg-slate-800/50 border-slate-700/50 p-4 hover:bg-slate-800/70 transition-all duration-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{pick.matchup}</h3>
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">{pick.gameTime}</span>
                </div>
                <p className="text-cyan-300 font-medium">{pick.type}: {pick.pick}</p>
              </div>
              <div className="text-right">
                <Badge className={getConfidenceColor(pick.confidence)}>
                  {pick.edge}% Edge
                </Badge>
                <div className="text-lg font-bold text-white">{pick.odds}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
              <div>
                <p className="text-slate-400">Sportsbook</p>
                <p className="text-white font-medium">{pick.bookmaker}</p>
              </div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3 mb-3">
              <p className="text-xs text-cyan-100">{pick.aiInsight}</p>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-cyan-700 hover:bg-cyan-800 text-white"
                size="sm"
                onClick={() => addToBetSlip({
                  id: pick.id,
                  type: pick.type,
                  description: pick.pick,
                  odds: pick.odds,
                  edge: pick.edge
                })}
                disabled={betSlip.some(b => b.id === pick.id)}
              >
                <Plus className="w-4 h-4 mr-1" />
                {betSlip.some(b => b.id === pick.id) ? "Added" : "Add to Betslip"}
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
