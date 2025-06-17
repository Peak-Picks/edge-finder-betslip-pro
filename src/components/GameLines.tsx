import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, Target } from 'lucide-react';
import { professionalPicksService } from '@/services/professional/picksService';
import { FormatAdapter } from '@/services/professional/adapter';

interface GameLinesProps {
  sport?: string;
  onPickSelect?: (pick: any) => void;
}

export function GameLines({ sport = 'all', onPickSelect }: GameLinesProps) {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'spread' | 'total'>('spread');

  useEffect(() => {
    const loadGameLines = async () => {
      try {
        setLoading(true);
        const lines = await professionalPicksService.getGameLines(
          sport === 'all' ? undefined : sport
        );
        const convertedLines = FormatAdapter.toGeneratedPicks(lines);
        setGames(convertedLines);
      } catch (error) {
        console.error('Error loading game lines:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGameLines();
  }, [sport]);

  const filteredGames = games.filter(game => 
    activeTab === 'spread' ? game.type === 'spread' : game.type === 'total'
  );

  if (loading) {
    return (
      <Card className="p-6 bg-slate-800/50 border-slate-700">
        <div className="animate-pulse text-center text-slate-400">
          Loading game lines...
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold">Game Lines</h2>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={activeTab === 'spread' ? 'default' : 'outline'}
            onClick={() => setActiveTab('spread')}
          >
            Spread
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'total' ? 'default' : 'outline'}
            onClick={() => setActiveTab('total')}
          >
            Total
          </Button>
        </div>
      </div>

      <div className="grid gap-3">
        {filteredGames.map((game) => (
          <Card
            key={game.id}
            className="p-4 bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 
                     transition-all cursor-pointer"
            onClick={() => onPickSelect?.(game)}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {game.sport}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {game.edge.toFixed(1)}% edge
                    </Badge>
                  </div>
                  <h3 className="font-medium text-white">{game.title}</h3>
                  <p className="text-sm text-slate-400">{game.game}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-400">{game.odds}</div>
                  <div className="text-xs text-slate-500">{game.platform}</div>
                </div>
              </div>
              
              <p className="text-sm text-slate-300">{game.insights}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Line:</span>
                    <span className="text-white ml-1">{game.line}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Proj:</span>
                    <span className="text-emerald-400 ml-1">{game.projected?.toFixed(1)}</span>
                  </div>
                </div>
                {onPickSelect && (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPickSelect(game);
                    }}
                  >
                    <Target className="w-3 h-3 mr-1" />
                    Add Pick
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
