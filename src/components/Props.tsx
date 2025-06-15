
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, TrendingUp } from 'lucide-react';
import { PlayerPropInsights } from './PlayerPropInsights';

export const Props = () => {
  const [selectedLeague, setSelectedLeague] = useState('nba');
  const [selectedProp, setSelectedProp] = useState(null);
  const [insightsOpen, setInsightsOpen] = useState(false);

  const propsByLeague = {
    nba: [
      {
        player: "Luka Dončić",
        team: "DAL",
        matchup: "vs LAL",
        props: [
          { type: "Points", line: 28.5, odds: "-110", edge: 11.2 },
          { type: "Rebounds", line: 8.5, odds: "+105", edge: 7.8 },
          { type: "Assists", line: 8.5, odds: "-115", edge: 5.4 }
        ]
      },
      {
        player: "Jayson Tatum",
        team: "BOS",
        matchup: "vs MIA",
        props: [
          { type: "Points", line: 26.5, odds: "-110", edge: 9.1 },
          { type: "3-Pointers", line: 3.5, odds: "+120", edge: 12.3 }
        ]
      },
      {
        player: "Giannis Antetokounmpo",
        team: "MIL",
        matchup: "vs PHI",
        props: [
          { type: "Points", line: 30.5, odds: "-105", edge: 8.7 },
          { type: "Rebounds", line: 11.5, odds: "+110", edge: 6.9 }
        ]
      }
    ],
    nfl: [
      {
        player: "Josh Allen",
        team: "BUF",
        matchup: "vs KC",
        props: [
          { type: "Passing Yards", line: 267.5, odds: "-115", edge: 9.4 },
          { type: "Passing TDs", line: 2.5, odds: "+105", edge: 7.2 }
        ]
      },
      {
        player: "Patrick Mahomes",
        team: "KC",
        matchup: "@ BUF",
        props: [
          { type: "Passing Yards", line: 275.5, odds: "-110", edge: 11.8 },
          { type: "Rushing Yards", line: 15.5, odds: "+125", edge: 8.3 }
        ]
      }
    ],
    mlb: [
      {
        player: "Mookie Betts",
        team: "LAD",
        matchup: "vs SF",
        props: [
          { type: "Hits", line: 1.5, odds: "+110", edge: 6.7 },
          { type: "Total Bases", line: 2.5, odds: "-105", edge: 4.9 }
        ]
      }
    ]
  };

  const getEdgeColor = (edge: number) => {
    if (edge >= 10) return 'text-emerald-400';
    if (edge >= 5) return 'text-yellow-400';
    return 'text-slate-400';
  };

  const handlePropClick = (playerData: any, propData: any) => {
    setSelectedProp({
      player: playerData.player,
      team: playerData.team,
      prop: propData.type,
      line: propData.line,
      type: "Over",
      odds: propData.odds,
      edge: propData.edge,
      projected: propData.line + (propData.edge * 0.1),
      confidence: propData.edge >= 10 ? "high" : propData.edge >= 5 ? "medium" : "low"
    });
    setInsightsOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 p-4">
          <h1 className="text-xl font-bold mb-4">All Player Props</h1>
          
          <Tabs value={selectedLeague} onValueChange={setSelectedLeague}>
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700/50">
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
              <TabsTrigger 
                value="mlb" 
                className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
              >
                MLB
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="p-4">
          <Tabs value={selectedLeague} className="w-full">
            <TabsContent value={selectedLeague} className="mt-0">
              <div className="space-y-4">
                {propsByLeague[selectedLeague as keyof typeof propsByLeague].map((playerData, playerIndex) => (
                  <Card key={playerIndex} className="bg-slate-800/50 border-slate-700/50 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{playerData.player}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                            {playerData.team}
                          </Badge>
                          <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                            {playerData.matchup}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {playerData.props.map((prop, propIndex) => (
                        <div 
                          key={propIndex} 
                          className="bg-slate-700/30 rounded-lg p-3 cursor-pointer hover:bg-slate-700/40 transition-colors"
                          onClick={() => handlePropClick(playerData, prop)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-white">{prop.type}</h4>
                              <p className="text-sm text-slate-400">O/U {prop.line}</p>
                            </div>
                            <div className="text-right">
                              <div className={`text-sm font-bold ${getEdgeColor(prop.edge)}`}>
                                {prop.edge}% Edge
                              </div>
                              <div className="text-sm font-bold text-white mt-1">{prop.odds}</div>
                            </div>
                          </div>

                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button 
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                              size="sm"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add to Betslip
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePropClick(playerData, prop);
                              }}
                            >
                              <TrendingUp className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <PlayerPropInsights 
        prop={selectedProp}
        open={insightsOpen}
        onOpenChange={setInsightsOpen}
      />
    </>
  );
};
