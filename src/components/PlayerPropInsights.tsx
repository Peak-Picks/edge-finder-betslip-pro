
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

  // Generate dynamic insights based on the prop data
  const generateDynamicInsights = () => {
    const confidencePercentage = prop.confidence === 'high' ? 85 + Math.floor(Math.random() * 10) : 
                                prop.confidence === 'medium' ? 70 + Math.floor(Math.random() * 10) : 
                                55 + Math.floor(Math.random() * 10);

    const isOver = prop.type === 'Over';
    const variance = Math.abs(prop.projected - prop.line);
    
    // Generate realistic recent performance based on projection and bet type
    // Use actual team names instead of random matchups
    const opponents = [prop.team === 'LAL' ? 'BOS' : 'LAL', 
                      prop.team === 'MIA' ? 'PHX' : 'MIA', 
                      prop.team === 'DEN' ? 'GSW' : 'DEN', 
                      prop.team === 'BOS' ? 'MIA' : 'BOS', 
                      prop.team === 'PHX' ? 'LAL' : 'PHX'];
    const recentGames = opponents.map(opponent => `vs ${opponent}`);
    const recentPerformance = recentGames.map(game => {
      // Create more realistic performance around the projection
      const baseVariance = (Math.random() - 0.5) * 4; // Smaller variance for more realistic stats
      let stat = Math.max(0, prop.projected + baseVariance);
      
      // Round to appropriate decimal places based on stat type
      if (prop.prop.toLowerCase().includes('points')) {
        stat = Math.round(stat * 10) / 10; // One decimal for points
      } else {
        stat = Math.round(stat); // Whole numbers for rebounds/assists
      }
      
      // Determine if this would be a hit or miss based on the bet type and line
      const result = (isOver && stat > prop.line) || (!isOver && stat < prop.line) ? 'hit' : 'miss';
      return { game, stat, result };
    });

    // Calculate hit rate for recent games
    const hits = recentPerformance.filter(game => game.result === 'hit').length;
    const hitRate = `${hits}/5`;

    // Generate key factors based on the actual bet type and performance
    const avgStat = recentPerformance.reduce((sum, game) => sum + game.stat, 0) / recentPerformance.length;
    const keyFactors = [
      `${prop.player} averaging ${avgStat.toFixed(1)} ${prop.prop.toLowerCase()} over last 5 games`,
      isOver ? 
        `Strong matchup advantage suggests higher ${prop.prop.toLowerCase()} output` :
        `Defensive matchup suggests limited ${prop.prop.toLowerCase()} opportunities`,
      `Historical performance trend supports ${prop.type.toLowerCase()} play (${hitRate} recent hits)`
    ];

    const matchupAnalysis = {
      opponentRank: Math.floor(Math.random() * 30) + 1,
      allowedAverage: isOver ? prop.line + 1.2 : prop.line - 1.2,
      defenseRating: prop.edge > 8 ? 'Below Average' : prop.edge > 4 ? 'Average' : 'Above Average'
    };

    // Create clean AI recommendation without duplication
    // Extract the stat type from the prop string to avoid redundancy
    const statType = prop.prop.toLowerCase().includes('points') ? 'Points' :
                    prop.prop.toLowerCase().includes('rebounds') ? 'Rebounds' :
                    prop.prop.toLowerCase().includes('assists') ? 'Assists' :
                    prop.prop;
    
    const recommendation = `${prop.type} ${prop.line} ${statType}`;

    return {
      aiRecommendation: recommendation,
      confidence: confidencePercentage,
      keyFactors,
      recentPerformance,
      matchupAnalysis
    };
  };

  const insights = generateDynamicInsights();

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
                      {prop.prop.toLowerCase().includes('points') ? game.stat.toFixed(1) : game.stat.toString()}
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
