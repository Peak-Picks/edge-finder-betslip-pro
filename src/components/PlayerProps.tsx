
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Filter, TrendingUp, RefreshCw } from 'lucide-react';
import { PlayerPropInsights } from './PlayerPropInsights';
import { useBetSlipContext } from './BetSlipContext';
import { dynamicPicksGenerator, GeneratedPick } from '../services/dynamicPicksGenerator';

export const PlayerProps = () => {
  const [selectedSport, setSelectedSport] = useState('nba');
  const [selectedProp, setSelectedProp] = useState<any>(null);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [playerProps, setPlayerProps] = useState<{nba: GeneratedPick[], nfl: GeneratedPick[]}>({nba: [], nfl: []});
  const [loading, setLoading] = useState(true);

  const { addToBetSlip, betSlip } = useBetSlipContext();

  useEffect(() => {
    loadPlayerProps();
  }, []);

  const loadPlayerProps = () => {
    setLoading(true);
    try {
      const nbaProps = dynamicPicksGenerator.generatePlayerProps('nba');
      const nflProps = dynamicPicksGenerator.generatePlayerProps('nfl');
      setPlayerProps({ nba: nbaProps, nfl: nflProps });
    } catch (error) {
      console.error('Error loading player props:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshPicks = () => {
    dynamicPicksGenerator.refreshAllPicks();
    loadPlayerProps();
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const extractPropFromTitle = (title: string): string => {
    // Extract prop type from title like "Over 28.5 Points" -> "Points"
    const match = title.match(/Over \d+\.?\d* (.+)/);
    return match ? match[1] : title;
  };

  const handlePropClick = (prop: GeneratedPick) => {
    setSelectedProp({
      player: prop.player,
      team: prop.team,
      prop: extractPropFromTitle(prop.title),
      line: prop.line,
      type: "Over",
      odds: prop.odds,
      edge: prop.edge,
      projected: prop.projected,
      confidence: prop.confidence >= 4 ? "high" : prop.confidence >= 2 ? "medium" : "low"
    });
    setInsightsOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Loading Player Props...</h2>
        </div>
        <div className="space-y-3">
          {[1, 2].map(i => (
            <Card key={i} className="bg-slate-800/50 border-slate-700/50 p-4 animate-pulse">
              <div className="h-20 bg-slate-700/50 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Player Props</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshPicks}
              className="border-slate-600 text-slate-300"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
          </div>
        </div>

        <Tabs value={selectedSport} onValueChange={setSelectedSport}>
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger 
              value="nba" 
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
            >
              NBA
            </TabsTrigger>
            <TabsTrigger 
              value="nfl" 
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
            >
              NFL
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedSport} className="mt-4">
            <div className="space-y-3">
              {playerProps[selectedSport as keyof typeof playerProps].map((prop, index) => {
                const betId = `${prop.id}-${index}`;
                const alreadyAdded = betSlip.some(b => b.id === betId);
                const propType = extractPropFromTitle(prop.title);
                return (
                  <Card 
                    key={index} 
                    className="bg-slate-800/50 border-slate-700/50 p-4 cursor-pointer hover:bg-slate-800/70 transition-colors"
                    onClick={() => handlePropClick(prop)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{prop.player}</h3>
                          <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                            {prop.team}
                          </Badge>
                        </div>
                        <p className="text-emerald-400 font-medium">
                          {prop.type} {prop.line} {propType}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getConfidenceColor(prop.confidence.toString())}>
                          {prop.edge}% Edge
                        </Badge>
                        <div className="text-lg font-bold text-white mt-1">{prop.odds}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-slate-400">Our Projection</p>
                        <p className="text-white font-medium">{prop.projected}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Book Line</p>
                        <p className="text-white font-medium">{prop.line}</p>
                      </div>
                    </div>

                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        size="sm"
                        disabled={alreadyAdded}
                        onClick={() => addToBetSlip({
                          id: betId,
                          type: 'Player Prop',
                          player: prop.player,
                          team: prop.team,
                          description: `${prop.type} ${prop.line} ${propType}`,
                          odds: prop.odds,
                          edge: prop.edge,
                          line: prop.line,
                        })}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        {alreadyAdded ? "Added" : "Add to Betslip"}
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
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <PlayerPropInsights 
        prop={selectedProp}
        open={insightsOpen}
        onOpenChange={setInsightsOpen}
      />
    </>
  );
};
