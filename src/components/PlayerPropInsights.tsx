
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Brain, BarChart3, Target, Clock } from 'lucide-react';

interface PlayerPropInsightsProps {
  prop: {
    player: string;
    team: string;
    prop: string;
    line: number;
    type: string;
    odds: string;
    edge: number;
    projected: number;
    confidence: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PlayerPropInsights = ({ prop, open, onOpenChange }: PlayerPropInsightsProps) => {
  if (!prop) return null;

  const insights = {
    aiRecommendation: `${prop.type} ${prop.line} ${prop.prop}`,
    confidence: 85,
    keyFactors: [
      `${prop.player} averaging ${prop.projected} ${prop.prop.toLowerCase()} over last 5 games`,
      `Strong matchup advantage in this category`,
      `Historical performance suggests ${prop.type.toLowerCase()} trend`
    ],
    recentPerformance: [
      { game: 'vs LAL', stat: prop.projected + 2.1, result: 'hit' },
      { game: 'vs BOS', stat: prop.projected - 1.3, result: 'miss' },
      { game: 'vs MIA', stat: prop.projected + 3.2, result: 'hit' },
      { game: 'vs PHX', stat: prop.projected + 0.8, result: 'hit' },
      { game: 'vs DEN', stat: prop.projected - 0.5, result: 'miss' }
    ],
    matchupAnalysis: {
      opponentRank: 23,
      allowedAverage: prop.projected + 1.2,
      defenseRating: 'Below Average'
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-emerald-400">
            {prop.player} - {prop.prop} Analysis
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
              Best value bet based on {prop.edge}% edge calculation
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

          {/* Recent Performance */}
          <Card className="bg-slate-700/50 border-slate-600 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-purple-400">Recent Performance (Last 5 Games)</h3>
            </div>
            <div className="space-y-2">
              {insights.recentPerformance.map((game, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-slate-600/30 rounded">
                  <span className="text-slate-300">{game.game}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{game.stat.toFixed(1)}</span>
                    <Badge className={game.result === 'hit' ? 
                      'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    }>
                      {game.result.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Matchup Analysis */}
          <Card className="bg-slate-700/50 border-slate-600 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-5 h-5 text-orange-400" />
              <h3 className="font-semibold text-orange-400">Matchup Analysis</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Opponent Defense Rank</span>
                <span className="text-white font-medium">#{insights.matchupAnalysis.opponentRank}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Avg Allowed ({prop.prop})</span>
                <span className="text-white font-medium">{insights.matchupAnalysis.allowedAverage.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Defense Rating</span>
                <Badge variant="secondary">{insights.matchupAnalysis.defenseRating}</Badge>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
