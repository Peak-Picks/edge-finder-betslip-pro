import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Target } from 'lucide-react';
import { professionalPicksService } from '@/services/professional/picksService';
import { FormatAdapter } from '@/services/professional/adapter';

interface PropsProps {
  onPickSelect: (pick: any) => void;
}

export function Props({ onPickSelect }: PropsProps) {
  const [playerProps, setPlayerProps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    const loadProps = async () => {
      try {
        setLoading(true);
        const props = await professionalPicksService.getPlayerProps();
        const convertedProps = FormatAdapter.toGeneratedPicks(props);
        setPlayerProps(convertedProps);
      } catch (error) {
        console.error('Error loading props:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProps();
  }, []);

  const categories = ['all', 'points', 'rebounds', 'assists', 'other'];
  
  const filteredProps = activeCategory === 'all' 
    ? playerProps 
    : playerProps.filter(prop => {
        const title = prop.title.toLowerCase();
        if (activeCategory === 'other') {
          return !title.includes('points') && 
                 !title.includes('rebounds') && 
                 !title.includes('assists');
        }
        return title.includes(activeCategory);
      });

  if (loading) {
    return (
      <Card className="p-6 bg-slate-800/50 border-slate-700">
        <div className="animate-pulse text-center text-slate-400">
          Loading player props...
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-semibold">Player Props</h2>
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
              </div>
              
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
