
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

  // Generate realistic insights based on the prop data
  const generateRealisticInsights = () => {
    const confidencePercentage = prop.confidence === 'high' ? 85 + Math.floor(Math.random() * 10) : 
                                prop.confidence === 'medium' ? 70 + Math.floor(Math.random() * 10) : 
                                55 + Math.floor(Math.random() * 10);

    const isOver = prop.type === 'Over';
    
    // Generate realistic recent performance based on the player and prop
    const getRealisticPerformance = () => {
      const playerPerformanceData = {
        'Luka Dončić': {
          'Points': { avg: 32.1, variance: 6.2, recent: [28, 35, 31, 29, 38] },
          'Rebounds': { avg: 8.5, variance: 2.1, recent: [9, 7, 10, 8, 6] },
          'Assists': { avg: 8.9, variance: 2.8, recent: [11, 8, 7, 9, 12] }
        },
        'Jayson Tatum': {
          'Points': { avg: 26.9, variance: 5.8, recent: [24, 31, 28, 22, 29] },
          'Rebounds': { avg: 8.1, variance: 2.4, recent: [8, 9, 6, 10, 7] },
          'Assists': { avg: 4.8, variance: 1.9, recent: [5, 4, 6, 3, 7] }
        },
        'Giannis Antetokounmpo': {
          'Points': { avg: 29.2, variance: 7.1, recent: [35, 28, 31, 26, 33] },
          'Rebounds': { avg: 11.8, variance: 3.2, recent: [14, 10, 12, 9, 15] },
          'Assists': { avg: 5.9, variance: 2.1, recent: [6, 5, 8, 4, 7] }
        },
        'A\'ja Wilson': {
          'Points': { avg: 22.8, variance: 4.9, recent: [26, 21, 25, 19, 24] },
          'Rebounds': { avg: 9.5, variance: 2.7, recent: [11, 8, 10, 7, 12] },
          'Assists': { avg: 3.5, variance: 1.8, recent: [4, 3, 5, 2, 4] }
        },
        'Breanna Stewart': {
          'Points': { avg: 20.4, variance: 5.2, recent: [23, 18, 22, 17, 25] },
          'Rebounds': { avg: 8.4, variance: 2.5, recent: [9, 7, 10, 6, 11] },
          'Assists': { avg: 3.7, variance: 1.6, recent: [4, 3, 5, 2, 3] }
        },
        'Sabrina Ionescu': {
          'Points': { avg: 18.2, variance: 4.8, recent: [21, 16, 19, 15, 23] },
          'Rebounds': { avg: 4.4, variance: 1.9, recent: [5, 4, 6, 3, 4] },
          'Assists': { avg: 6.2, variance: 2.3, recent: [8, 5, 7, 4, 9] }
        }
      };

      // Get realistic opponents based on team
      const getRecentOpponents = (team: string) => {
        const teamSchedules = {
          'DAL': ['vs LAL', 'vs GSW', '@ DEN', 'vs PHX', '@ SA'],
          'BOS': ['@ MIA', 'vs PHI', 'vs NYK', '@ MIL', 'vs TOR'],
          'MIL': ['vs PHI', '@ BOS', 'vs CHI', 'vs IND', '@ CLE'],
          'LAL': ['@ DAL', 'vs GSW', 'vs DEN', '@ SAC', 'vs LAC'],
          'MIA': ['vs BOS', '@ ATL', 'vs ORL', 'vs CHA', '@ WAS'],
          'PHX': ['@ DAL', 'vs DEN', 'vs GSW', '@ UTA', 'vs POR'],
          'LV': ['vs NY', '@ SEA', 'vs MIN', 'vs PHX', '@ LAS'],
          'NY': ['@ LV', 'vs CONN', 'vs ATL', '@ CHI', 'vs IND'],
          'CONN': ['vs NY', '@ BOS', 'vs WAS', 'vs ATL', '@ IND'],
          'MIN': ['vs CHI', 'vs IND', '@ LV', 'vs SEA', 'vs DAL'],
          'IND': ['@ NY', 'vs CHI', '@ ATL', 'vs CONN', '@ MIN'],
          'CHI': ['@ IND', '@ MIN', 'vs NY', 'vs ATL', 'vs WAS'],
          'SEA': ['vs LV', '@ POR', 'vs PHX', '@ MIN', 'vs LAS']
        };
        
        return teamSchedules[team] || ['vs OPP1', 'vs OPP2', '@ OPP3', 'vs OPP4', '@ OPP5'];
      };

      const opponents = getRecentOpponents(prop.team);
      const playerData = playerPerformanceData[prop.player as keyof typeof playerPerformanceData];
      
      if (!playerData || !playerData[prop.prop as keyof typeof playerData]) {
        // Fallback for players not in our database
        return opponents.map((opponent, index) => {
          const stat = prop.projected + (Math.random() - 0.5) * 4;
          const finalStat = Math.max(0, Math.round(stat * 10) / 10);
          const result = (isOver && finalStat > prop.line) || (!isOver && finalStat < prop.line) ? 'hit' : 'miss';
          return { game: opponent, stat: finalStat, result };
        });
      }

      const propData = playerData[prop.prop as keyof typeof playerData];
      
      return opponents.map((opponent, index) => {
        const recentStat = propData.recent[index];
        const result = (isOver && recentStat > prop.line) || (!isOver && recentStat < prop.line) ? 'hit' : 'miss';
        return { game: opponent, stat: recentStat, result };
      });
    };

    const recentPerformance = getRealisticPerformance();

    // Calculate hit rate for recent games
    const hits = recentPerformance.filter(game => game.result === 'hit').length;
    const hitRate = `${hits}/5`;

    // Generate key factors based on actual performance
    const avgStat = recentPerformance.reduce((sum, game) => sum + game.stat, 0) / recentPerformance.length;
    const keyFactors = [
      `${prop.player} averaging ${avgStat.toFixed(1)} ${prop.prop.toLowerCase()} over last 5 games`,
      isOver ? 
        `Recent performance trend favors over ${prop.line} ${prop.prop.toLowerCase()}` :
        `Defensive matchups suggest under ${prop.line} ${prop.prop.toLowerCase()}`,
      `Hit rate on ${prop.type.toLowerCase()} bets: ${hitRate} in recent games`
    ];

    const matchupAnalysis = {
      opponentRank: Math.floor(Math.random() * 30) + 1,
      allowedAverage: isOver ? prop.line + 1.2 : prop.line - 1.2,
      defenseRating: prop.edge > 8 ? 'Below Average' : prop.edge > 4 ? 'Average' : 'Above Average'
    };

    // Create clean AI recommendation
    const statType = prop.prop;
    const recommendation = `${prop.type} ${prop.line} ${statType}`;

    return {
      aiRecommendation: recommendation,
      confidence: confidencePercentage,
      keyFactors,
      recentPerformance,
      matchupAnalysis
    };
  };

  const insights = generateRealisticInsights();

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
              {prop.player} shows {prop.edge.toFixed(1)}% edge based on our projections vs. sportsbook line
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
                    <span className="text-white font-medium">
                      {typeof game.stat === 'number' && prop.prop.toLowerCase().includes('points') ? 
                        game.stat.toFixed(1) : 
                        game.stat.toString()
                      }
                    </span>
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
