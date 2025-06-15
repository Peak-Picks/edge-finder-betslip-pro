import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Plus, Star, RefreshCw } from 'lucide-react';
import { useBetSlipContext } from './BetSlipContext';
import { dynamicPicksGenerator, GeneratedPick } from '../services/dynamicPicksGenerator';

export const LongShots = () => {
  const { addToBetSlip, betSlip } = useBetSlipContext();
  const [longShots, setLongShots] = useState<GeneratedPick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLongShots();
  }, []);

  const loadLongShots = () => {
    setLoading(true);
    try {
      const picks = dynamicPicksGenerator.generateLongShots();
      setLongShots(picks);
    } catch (error) {
      console.error('Error loading long shots:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshPicks = () => {
    dynamicPicksGenerator.refreshAllPicks();
    loadLongShots();
  };

  const getConfidenceStars = (confidence: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < confidence ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
      />
    ));
  };

  const getOddsColor = (odds: string) => {
    const isPositive = odds.startsWith('+');
    return isPositive ? 'text-emerald-400' : 'text-red-400';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Loading Long Shots...</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-slate-800/50 border-slate-700/50 p-4 animate-pulse">
              <div className="h-24 bg-slate-700/50 rounded"></div>
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
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold">Long Shot Picks</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
            {longShots.length} Available
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
        {longShots.map((bet) => (
          <Card key={bet.id} className="bg-slate-800/50 border-slate-700/50 p-4 hover:bg-slate-800/70 transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-white text-lg">{bet.player} {bet.title}</h3>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                    {bet.category}
                  </Badge>
                </div>
                <div className="text-sm text-slate-400 mb-1">
                  {bet.sport} | Game: {bet.game}
                </div>
                <p className="text-slate-300 text-sm mb-3">{bet.description}</p>
              </div>
              <div className={`text-2xl font-bold ${getOddsColor(bet.odds)}`}>
                {bet.odds}
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-3 mb-3">
              <h4 className="text-emerald-400 font-medium text-sm mb-2">AI Insights:</h4>
              <p className="text-xs text-slate-300">{bet.insights}</p>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-slate-400 text-xs">Platform:</p>
                  <p className="text-white font-medium text-sm">{bet.platform}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Confidence:</p>
                  <div className="flex items-center gap-1">
                    {getConfidenceStars(bet.confidence)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                size="sm"
                onClick={() => addToBetSlip({
                  id: bet.id,
                  type: "Long Shot",
                  description: `${bet.player} ${bet.title}`,
                  odds: bet.odds,
                  edge: 0
                })}
                disabled={betSlip.some(b => b.id === bet.id)}
              >
                <Plus className="w-4 h-4 mr-1" />
                {betSlip.some(b => b.id === bet.id) ? "Added" : "Add to Betslip"}
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
