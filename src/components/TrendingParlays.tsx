import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, TrendingUp, Users, Target } from 'lucide-react';
import { unifiedPicksService } from '@/services/professional/unifiedPicksService';
import { FormatAdapter } from '@/services/professional/adapter';

interface TrendingParlaysProps {
  onParlaySelect?: (parlay: any) => void;
}

export function TrendingParlays({ onParlaySelect }: TrendingParlaysProps) {
  const [longShots, setLongShots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLongShots = async () => {
      try {
        setLoading(true);
        const response = await unifiedPicksService.getAllPicks();
        const shots = FormatAdapter.toGeneratedPicks(response.longShots);
        setLongShots(shots);
      } catch (error) {
        console.error('Error loading long shots:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLongShots();
  }, []);

  if (loading) {
    return (
      <Card className="p-6 bg-slate-800/50 border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="grid gap-3">
            <div className="h-24 bg-slate-700 rounded"></div>
            <div className="h-24 bg-slate-700 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-orange-400" />
        <h2 className="text-lg font-semibold">Long Shots & Value Plays</h2>
      </div>

      {longShots.length === 0 ? (
        <Card className="p-6 bg-slate-800/50 border-slate-700 text-center">
          <p className="text-slate-400">No long shots available at this time.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {longShots.map((shot) => (
            <Card
              key={shot.id}
              className="p-4 bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 
                       transition-all cursor-pointer"
              onClick={() => onParlaySelect?.(shot)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        <Flame className="w-3 h-3 mr-1" />
                        Long Shot
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {shot.odds}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-white">{shot.title}</h3>
                    <p className="text-sm text-slate-400">{shot.game}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Potential</div>
                    <div className="text-lg font-bold text-purple-400">
                      {shot.odds.includes('+') ? shot.odds : `+${shot.odds}`}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-slate-300">{shot.insights}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Edge: {shot.edge.toFixed(1)}%</span>
                    <span>{shot.platform}</span>
                  </div>
                  {onParlaySelect && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onParlaySelect(shot);
                      }}
                    >
                      <Target className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
