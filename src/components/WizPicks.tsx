import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Zap, Target, Info, Trophy, DollarSign } from 'lucide-react';
import { unifiedPicksService } from '@/services/professional/unifiedPicksService';
import { FormatAdapter } from '@/services/professional/adapter';
import { toast } from 'sonner';

interface WizPicksProps {
  onPickSelect: (pick: any) => void;
}

export function WizPicks({ onPickSelect }: WizPicksProps) {
  const [picks, setPicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'best' | 'value'>('all');

  const loadPicks = async () => {
    try {
      setLoading(true);
      const response = await unifiedPicksService.getAllPicks();
      
      // Combine best bets with some top player props
      const combinedPicks = [
        ...FormatAdapter.toGeneratedPicks(response.bestBets),
        ...FormatAdapter.toGeneratedPicks(response.playerProps.slice(0, 3))
      ];
      
      // Remove duplicates and sort by edge
      const uniquePicks = Array.from(
        new Map(combinedPicks.map(p => [p.id, p])).values()
      ).sort((a, b) => b.edge - a.edge);
      
      setPicks(uniquePicks);
      
      if (uniquePicks.length === 0) {
        toast.info('No picks available. Try refreshing.');
      }
    } catch (error) {
      console.error('Error loading Wiz Picks:', error);
      toast.error('Failed to load picks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPicks();
  }, []);

  const filteredPicks = picks.filter(pick => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'best') return pick.edge >= 7;
    if (activeFilter === 'value') return pick.edge >= 5 && pick.edge < 7;
    return true;
  });

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('best') || category.toLowerCase().includes('lock')) {
      return <Trophy className="w-4 h-4" />;
    }
    if (category.toLowerCase().includes('value')) {
      return <DollarSign className="w-4 h-4" />;
    }
    return <Target className="w-4 h-4" />;
  };

  const getCategoryColor = (edge: number) => {
    if (edge >= 10) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (edge >= 7) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (edge >= 5) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  };

  if (loading) {
    return (
      <Card className="p-6 bg-slate-800/50 border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="h-24 bg-slate-700 rounded"></div>
          <div className="h-24 bg-slate-700 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-semibold">AI-Powered Picks</h2>
        </div>
        <div className="flex gap-2">
          {['all', 'best', 'value'].map((filter) => (
            <Button
              key={filter}
              size="sm"
              variant={activeFilter === filter ? 'default' : 'ghost'}
              onClick={() => setActiveFilter(filter as any)}
              className="capitalize"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {filteredPicks.length === 0 ? (
        <Card className="p-6 bg-slate-800/50 border-slate-700 text-center">
          <p className="text-slate-400">No picks match your filter criteria.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filteredPicks.map((pick) => (
            <Card
              key={pick.id}
              className="p-4 bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 
                       transition-all cursor-pointer group"
              onClick={() => onPickSelect(pick)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getCategoryColor(pick.edge)}>
                        {getCategoryIcon(pick.category)}
                        <span className="ml-1">{pick.edge.toFixed(1)}% Edge</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {pick.sport}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                      {pick.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">{pick.game}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-400">{pick.odds}</div>
                    <div className="text-xs text-slate-500">{pick.platform}</div>
                  </div>
                </div>
                
                <p className="text-sm text-slate-300 line-clamp-2">{pick.insights}</p>
                
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Line: {pick.line}</span>
                    {pick.projected && <span>Proj: {pick.projected.toFixed(1)}</span>}
                  </div>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPickSelect(pick);
                    }}
                  >
                    <Target className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
