import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Target, RefreshCw } from 'lucide-react';
import { unifiedPicksService } from '@/services/professional/unifiedPicksService';
import { FormatAdapter } from '@/services/professional/adapter';
import { apiManager } from '@/services/apiManager';
import { toast } from 'sonner';

interface PropsProps {
  onPickSelect: (pick: any) => void;
}

export function Props({ onPickSelect }: PropsProps) {
  const [playerProps, setPlayerProps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSport, setActiveSport] = useState<string>('all');

  const loadProps = async () => {
    try {
      setLoading(true);
      const response = await unifiedPicksService.getAllPicks();
      const props = FormatAdapter.toGeneratedPicks(response.playerProps);
      setPlayerProps(props);
      
      if (props.length === 0) {
        toast.info('No player props available. Try refreshing.');
      }
    } catch (error) {
      console.error('Error loading props:', error);
      toast.error('Failed to load player props');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const result = await apiManager.manualRefresh();
    if (result.success) {
      toast.success('Props refreshed successfully');
      await loadProps();
    } else {
      toast.error(result.message);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    loadProps();
  }, []);

  const categories = ['all', 'points', 'rebounds', 'assists', 'other'];
  const sports = ['all', 'WNBA', 'MLB', 'NBA', 'NFL'];
  
  const filteredProps = playerProps.filter(prop => {
    const categoryMatch = activeCategory === 'all' || 
      (activeCategory === 'other' ? 
        !['points', 'rebounds', 'assists'].some(cat => prop.title.toLowerCase().includes(cat)) :
        prop.title.toLowerCase().includes(activeCategory));
    
    const sportMatch = activeSport === 'all' || prop.sport === activeSport;
    
    return categoryMatch && sportMatch;
  });

  if (loading) {
    return (
      <Card className="p-6 bg-slate-800/50 border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="grid gap-3">
            <div className="h-20 bg-slate-700 rounded"></div>
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
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold">Player Props</h2>
          <Badge variant="outline" className="text-xs">
            {filteredProps.length} picks
          </Badge>
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

      {/* Sport Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sports.map((sport) => (
          <Button
            key={sport}
            size="sm"
            variant={activeSport === sport ? "default" : "outline"}
            onClick={() => setActiveSport(sport)}
          >
            {sport}
          </Button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            size="sm"
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {filteredProps.length === 0 ? (
        <Card className="p-6 bg-slate-800/50 border-slate-700 text-center">
          <p className="text-slate-400">No props match your filter criteria.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filteredProps.map((prop) => (
            <Card
              key={prop.id}
              className="p-4 bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 
                       transition-all cursor-pointer"
              onClick={() => onPickSelect(prop)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {prop.sport}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {prop.edge.toFixed(1)}% edge
                      </Badge>
                    </div>
                    <h3 className="font-medium text-white">{prop.player}</h3>
                    <p className="text-sm text-slate-400">{prop.title}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-400">{prop.odds}</div>
                    <div className="text-xs text-slate-500">{prop.platform}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Line:</span>
                    <span className="text-white ml-1">{prop.line}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Proj:</span>
                    <span className="text-emerald-400 ml-1">{prop.projected?.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Conf:</span>
                    <span className="text-blue-400 ml-1">{prop.confidence * 20}%</span>
                  </div>
                </div>
                
                <p className="text-xs text-slate-400 line-clamp-2">{prop.insights}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 w-3 rounded-full ${
                          i < prop.confidence ? 'bg-emerald-400' : 'bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPickSelect(prop);
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
