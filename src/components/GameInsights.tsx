
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Brain, BarChart3, Users, Clock } from 'lucide-react';

interface GameInsightsProps {
  game: {
    id: number;
    homeTeam: string;
    awayTeam: string;
    time: string;
    homeSpread: string;
    awaySpread: string;
    homeML: string;
    awayML: string;
    total: string;
    overOdds: string;
    underOdds: string;
    edge: {
      spread: number;
      moneyline: number;
      total: number;
    };
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GameInsights = ({ game, open, onOpenChange }: GameInsightsProps) => {
  if (!game) return null;

  const insights = {
    aiRecommendation: `${game.awayTeam} +${game.awaySpread.replace('+', '')} spread`,
    confidence: 87,
    keyFactors: [
      `${game.awayTeam} covered in 4 of last 5 games`,
      `${game.homeTeam} struggling at home (2-6 ATS)`,
      `Total has gone OVER in 7 of last 10 matchups`
    ],
    publicBetting: {
      spread: { team: game.homeTeam, percentage: 68 },
      moneyline: { team: game.homeTeam, percentage: 72 },
      total: { side: 'Over', percentage: 61 }
    },
    recentForm: {
      home: { wins: 3, losses: 2, streak: 'W2' },
      away: { wins: 4, losses: 1, streak: 'W3' }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-emerald-400">
            {game.awayTeam} @ {game.homeTeam} - AI Insights
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* AI Recommendation */}
          <Card className="bg-slate-700/50 border-slate-600 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-emerald-400">AI Recommendation</h3>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                {insights.confidence}% Confidence
              </Badge>
            </div>
            <p className="text-lg font-medium text-white mb-2">{insights.aiRecommendation}</p>
            <p className="text-slate-300 text-sm">
              Best value bet based on {game.edge.spread}% edge calculation
            </p>
          </Card>

          {/* Key Factors */}
          <Card className="bg-slate-700/50 border-slate-600 p-4">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-blue-400">Key Factors</h3>
            </div>
            <ul className="space-y-2">
              {insights.keyFactors.map((factor, index) => (
                <li key={index} className="flex items-center gap-2 text-slate-300">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  {factor}
                </li>
              ))}
            </ul>
          </Card>

          {/* Public Betting */}
          <Card className="bg-slate-700/50 border-slate-600 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-purple-400">Public Betting</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Spread</span>
                <div className="flex items-center gap-2">
                  <span className="text-white">{insights.publicBetting.spread.team}</span>
                  <Badge variant="secondary">{insights.publicBetting.spread.percentage}%</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Moneyline</span>
                <div className="flex items-center gap-2">
                  <span className="text-white">{insights.publicBetting.moneyline.team}</span>
                  <Badge variant="secondary">{insights.publicBetting.moneyline.percentage}%</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Total</span>
                <div className="flex items-center gap-2">
                  <span className="text-white">{insights.publicBetting.total.side}</span>
                  <Badge variant="secondary">{insights.publicBetting.total.percentage}%</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Form */}
          <Card className="bg-slate-700/50 border-slate-600 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-orange-400" />
              <h3 className="font-semibold text-orange-400">Recent Form</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <h4 className="font-medium text-white mb-2">{game.homeTeam} (Home)</h4>
                <div className="flex justify-center items-center gap-2 mb-1">
                  <span className="text-emerald-400">{insights.recentForm.home.wins}W</span>
                  <span className="text-red-400">{insights.recentForm.home.losses}L</span>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  {insights.recentForm.home.streak}
                </Badge>
              </div>
              <div className="text-center">
                <h4 className="font-medium text-white mb-2">{game.awayTeam} (Away)</h4>
                <div className="flex justify-center items-center gap-2 mb-1">
                  <span className="text-emerald-400">{insights.recentForm.away.wins}W</span>
                  <span className="text-red-400">{insights.recentForm.away.losses}L</span>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  {insights.recentForm.away.streak}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
