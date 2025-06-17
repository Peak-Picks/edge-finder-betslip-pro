import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, Target, RefreshCw } from 'lucide-react';
import { unifiedPicksService } from '@/services/professional/unifiedPicksService';
import { FormatAdapter } from '@/services/professional/adapter';
import { apiManager } from '@/services/apiManager';
import { toast } from 'sonner';

interface GameLinesProps {
  sport?: string;
  onPickSelect?: (pick: any) => void;
}

export function GameLines({ sport = 'all', onPickSelect }: GameLinesProps) {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'spread' | 'total' | 'all'>('all');

  const loadGameLines = async () => {
    try {
      setLoading(true);
      const response = await unifiedPicksService.getAllPicks();
      const lines = FormatAdapter.toGeneratedPicks(response.gameLines);
      setGames(lines);
      
      if (lines.length === 0) {
        toast.info('No game lines available. Try refreshing.');
      }
    } catch (error) {
      console.error('Error loading game lines:', error);
      toast.error('Failed to load game lines');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const result = await apiManager.manualRefresh();
    if (result.success) {
      toast.success('Game lines refreshed');
      await loadGameLines();
    } else {
      toast.error(result.message);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    loadGameLines();
  }, [sport]);

  const filteredGames = games.filter(game => {
    if (activeTab === 'all') return true;
    return game.type === activeTab;
  });

  if (loading) {
    return (
      <Card className="p-6 bg-slate-800/50 border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="grid gap-3">
            <div className="h-20 bg-slate-700 rounded"></div>
            <div className="h-20 bg-slate-700 rounded"></div>
          </div>
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
          <Badge variant="outline" className="text-xs">
            {filteredGames.length} picks
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {['all', 'spread', 'total'].map((tab) => (
              <Button
                key={tab}
                size="sm"
                variant={activeTab === tab ? 'default' : 'outline'}
                onClick={() => setActiveTab(tab as any)}
                className="capitalize"
              >
                {tab}
              </Button>
            ))}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {filteredGames.length === 0 ? (
        <Card className="p-6 bg-slate-800/50 border-slate-700 text-center">
          <p className="text-slate-400">No game lines available for {activeTab}.</p>
        </Card>
      ) : (
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
                        {game.type === 'spread' ? 'Spread' : 'Total'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
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
                    {game.projected && (
                      <div>
                        <span className="text-slate-500">Proj:</span>
                        <span className="text-emerald-400 ml-1">{game.projected.toFixed(1)}</span>
                      </div>
                    )}
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
