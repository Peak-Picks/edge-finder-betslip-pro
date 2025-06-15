
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Plus, BarChart3, Clock, RefreshCw } from 'lucide-react';
import { useBetSlipContext } from './BetSlipContext';
import { dynamicPicksGenerator, GeneratedPick } from '../services/dynamicPicksGenerator';

export const GameBasedPicks = () => {
  const { addToBetSlip, betSlip } = useBetSlipContext();
  const [gamePicks, setGamePicks] = useState<GeneratedPick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGamePicks();
  }, []);

  const loadGamePicks = () => {
    setLoading(true);
    try {
      const picks = dynamicPicksGenerator.generateGameBasedPicks();
      setGamePicks(picks);
    } catch (error) {
      console.error('Error loading game picks:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshPicks = () => {
    dynamicPicksGenerator.refreshAllPicks();
    loadGamePicks();
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Loading Game Picks...</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-slate-800/50 border-slate-700/50 p-4 animate-pulse">
              <div className="h-28 bg-slate-700/50 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold">Game-Based AI Picks</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300">
            {gamePicks.length} Available
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshPicks}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
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
                <p className="text-cyan-300 font-medium">{pick.type}: {pick.title}</p>
              </div>
              <div className="text-right">
                <Badge className={getConfidenceColor(pick.confidence.toString())}>
                  {pick.edge}% Edge
                </Badge>
                <div className="text-lg font-bold text-white">{pick.odds}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
              <div>
                <p className="text-slate-400">Sportsbook</p>
                <p className="text-white font-medium">{pick.platform}</p>
              </div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3 mb-3">
              <p className="text-xs text-cyan-100">{pick.insights}</p>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-cyan-700 hover:bg-cyan-800 text-white"
                size="sm"
                onClick={() => addToBetSlip({
                  id: pick.id,
                  type: pick.type,
                  description: pick.title,
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
