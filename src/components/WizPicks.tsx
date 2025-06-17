import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Zap, Target, Info, RefreshCw } from 'lucide-react';
import { professionalPicksService } from '@/services/professional/picksService';
import { FormatAdapter } from '@/services/professional/adapter';
import { apiManager } from '@/services/apiManager';
import { toast } from 'sonner';

interface WizPicksProps {
  onPickSelect: (pick: any) => void;
}

export function WizPicks({ onPickSelect }: WizPicksProps) {
  const [picks, setPicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPicks = async () => {
    try {
      setLoading(true);
      const professionalPicks = await professionalPicksService.getBestBets();
      const convertedPicks = FormatAdapter.toGeneratedPicks(professionalPicks);
      setPicks(convertedPicks);
    } catch (error) {
      console.error('Error loading picks:', error);
      toast.error('Failed to load picks');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const result = await apiManager.manualRefresh();
    if (result.success) {
      toast.success(result.message);
      await loadPicks();
    } else {
      toast.error(result.message);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    loadPicks();
  }, []);

  const getCategoryColor = (category: string) => {
    if (category.includes('Best')) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (category.includes('Top')) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (category.includes('Long')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  const getConfidenceDisplay = (confidence: number) => (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-3 rounded-full ${
              i < confidence ? 'bg-emerald-400' : 'bg-slate-600'
            }`}
          />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card className="p-6 bg-slate-800/50 border-slate-700">
        <div className="animate-pulse text-center text-slate-400">
          Loading professional picks...
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-semibold">Wiz Picks</h2>
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

      <div className="grid gap-3">
        {picks.map((pick) => (
          <Card
            key={pick.id}
            className="p-4 bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 
                     transition-all cursor-pointer"
            onClick={() => onPickSelect(pick)}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getCategoryColor(pick.category)}>
                      {pick.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {pick.edge.toFixed(1)}% edge
                    </Badge>
                  </div>
                  <h3 className="font-medium text-white">{pick.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{pick.game}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-400">{pick.odds}</div>
                  <div className="text-xs text-slate-500">{pick.platform}</div>
                </div>
              </div>
              
              <p className="text-sm text-slate-300">{pick.insights}</p>
              
              <div className="flex items-center justify-between">
                {getConfidenceDisplay(pick.confidence)}
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPickSelect(pick);
                  }}
                >
                  <Target className="w-3 h-3 mr-1" />
                  Add Pick
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
