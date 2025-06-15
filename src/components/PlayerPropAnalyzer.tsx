
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Plus, TrendingUp } from 'lucide-react';

export const PlayerPropAnalyzer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');

  const playerProps = [
    {
      player: "LeBron James",
      team: "LAL",
      sport: "NBA",
      props: [
        { type: "Points", line: 25.5, odds: "-110", edge: 8.2, projected: 28.3, confidence: "high" },
        { type: "Rebounds", line: 7.5, odds: "+105", edge: 4.1, projected: 8.1, confidence: "medium" },
        { type: "Assists", line: 6.5, odds: "-115", edge: 2.3, projected: 6.9, confidence: "low" }
      ]
    },
    {
      player: "Patrick Mahomes",
      team: "KC",
      sport: "NFL",
      props: [
        { type: "Passing Yards", line: 275.5, odds: "-110", edge: 12.5, projected: 295.2, confidence: "high" },
        { type: "Passing TDs", line: 2.5, odds: "+115", edge: 9.1, projected: 2.9, confidence: "high" }
      ]
    }
  ];

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <h1 className="text-xl font-bold mb-4">Player Prop Analyzer</h1>
        
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
            />
          </div>
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger className="w-32 bg-slate-800/50 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All Sports</SelectItem>
              <SelectItem value="nba">NBA</SelectItem>
              <SelectItem value="nfl">NFL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {playerProps.map((player, playerIndex) => (
          <Card key={playerIndex} className="bg-slate-800/50 border-slate-700/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{player.player}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    {player.team}
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    {player.sport}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {player.props.map((prop, propIndex) => (
                <div key={propIndex} className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{prop.type}</h4>
                      <p className="text-sm text-slate-400">O/U {prop.line}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getConfidenceColor(prop.confidence)}>
                        {prop.edge}% Edge
                      </Badge>
                      <div className="text-sm font-bold text-white mt-1">{prop.odds}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <p className="text-slate-400">Our Projection</p>
                      <p className="text-white font-medium">{prop.projected}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Sportsbook Line</p>
                      <p className="text-white font-medium">{prop.line}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
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
    </div>
  );
};
