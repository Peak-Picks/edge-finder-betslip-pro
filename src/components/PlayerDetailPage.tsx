
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TrendingUp, BarChart3, Target, Calendar } from 'lucide-react';

interface PlayerDetailPageProps {
  player: {
    name: string;
    team: string;
    matchup: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PlayerDetailPage = ({ player, open, onOpenChange }: PlayerDetailPageProps) => {
  const [selectedStat, setSelectedStat] = useState('PTS+REB+AST');
  
  if (!player) return null;

  const playerStats = {
    overview: {
      average: 30.9,
      median: 31,
      last10: '70%',
      l5: '80%',
      l20: '55%',
      h2h: '100%',
      season2025: '73%',
      season2024: '47%'
    },
    recentGames: [
      { opponent: 'vs LAL', total: 33, pts: 25, reb: 5, ast: 3, hit: true },
      { opponent: 'vs BOS', total: 26, pts: 17, reb: 9, ast: 0, hit: false },
      { opponent: 'vs MIA', total: 23, pts: 15, reb: 8, ast: 0, hit: false },
      { opponent: 'vs PHX', total: 31, pts: 23, reb: 8, ast: 0, hit: true },
      { opponent: 'vs DEN', total: 41, pts: 35, reb: 6, ast: 0, hit: true },
      { opponent: 'vs GSW', total: 35, pts: 28, reb: 5, ast: 2, hit: true },
      { opponent: 'vs SAC', total: 31, pts: 24, reb: 7, ast: 0, hit: true },
      { opponent: 'vs POR', total: 33, pts: 26, reb: 6, ast: 1, hit: true },
      { opponent: 'vs UTA', total: 25, pts: 18, reb: 6, ast: 1, hit: false },
      { opponent: 'vs OKC', total: 31, pts: 24, reb: 9, ast: -2, hit: true }
    ],
    matchupAnalysis: {
      overall: { rank: 9, value: 83.9 },
      vsGuards: { rank: 12, value: 36.3 },
      vsForwards: { rank: 12, value: 22.4 },
      vsCenters: { rank: 8, value: 45.2 }
    },
    teamRankings: {
      offense: { avg: 52.3, rank: 8, stat: 'Effective Field Goal', rankStat: 12, avgStat: 52.0 },
      defense: { avg: 48.1, rank: 15, stat: 'Opponent Points', rankStat: 20, avgStat: 110.5 }
    }
  };

  const statTabs = [
    'PTS+REB+AST', 'PTS', '1Q PTS', '1H PTS', 'AST', 'PTS+AST', 
    '3PTM', 'REB', '1H REB', 'PTS+REB', 'REB+AST'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl bg-slate-800 border-slate-700 text-white max-h-[95vh] overflow-y-auto p-0">
        <div className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onOpenChange(false)}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Props
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{player.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white mb-1">
                  {player.name}
                </DialogTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    {player.team}
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    {player.matchup}
                  </Badge>
                  <span className="text-slate-400">Today 5:00 PM</span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Stats Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stat Selection */}
              <Card className="bg-slate-700/50 border-slate-600 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-emerald-400">
                    {player.name} - Pts + Reb + Ast - Over 29.5
                  </h3>
                  <div className="flex gap-2">
                    <Button className="bg-emerald-600 hover:bg-emerald-700" size="sm">
                      Over 29.5 -108
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-600">
                      ALT LINES
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {statTabs.map((stat) => (
                    <button
                      key={stat}
                      onClick={() => setSelectedStat(stat)}
                      className={`px-3 py-1 text-sm rounded border-b-2 transition-colors ${
                        selectedStat === stat
                          ? 'border-emerald-400 text-emerald-400 bg-slate-600/50'
                          : 'border-transparent text-slate-400 hover:text-white'
                      }`}
                    >
                      {stat}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Performance Stats */}
              <Card className="bg-slate-700/50 border-slate-600 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-emerald-400">{player.name} - Pts + Reb + Ast</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-slate-400">Last 10</p>
                    <p className="text-2xl font-bold text-emerald-400">{playerStats.overview.last10}</p>
                    <p className="text-xs text-slate-500">7 of 10</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">L5</p>
                    <p className="text-xl font-bold text-emerald-400">{playerStats.overview.l5}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">H2H</p>
                    <p className="text-xl font-bold text-emerald-400">{playerStats.overview.h2h}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">2024</p>
                    <p className="text-xl font-bold text-red-400">{playerStats.overview.season2024}</p>
                  </div>
                </div>

                <div className="flex gap-4 text-sm text-slate-400 mb-4">
                  <span>Average: <span className="text-white font-medium">{playerStats.overview.average}</span></span>
                  <span>Median: <span className="text-white font-medium">{playerStats.overview.median}</span></span>
                </div>

                {/* Chart representation */}
                <div className="h-48 bg-slate-600/30 rounded-lg flex items-end justify-center p-4">
                  <div className="flex items-end gap-1 h-full">
                    {playerStats.recentGames.slice(0, 10).map((game, index) => (
                      <div
                        key={index}
                        className={`w-8 flex flex-col items-center justify-end ${
                          game.hit ? 'bg-emerald-500' : 'bg-red-500'
                        } rounded-t relative`}
                        style={{ height: `${(game.total / 45) * 100}%` }}
                      >
                        <span className="text-xs text-white font-bold absolute -top-6">
                          {game.total}
                        </span>
                        <div className="text-xs text-white p-1">
                          <div>{game.pts}</div>
                          <div>{game.reb}</div>
                          <div>{game.ast}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Line Movement */}
              <Card className="bg-slate-700/50 border-slate-600 p-4">
                <h3 className="font-semibold text-pink-400 mb-4">Line movement</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-400">Updated</p>
                      <p className="text-sm text-white">8:59 AM Today</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Line</p>
                      <p className="text-sm text-red-400">29.5 ▼-1</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-white">10:26 PM Jun 14</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white">30.5</p>
                      <p className="text-xs text-slate-400">Open</p>
                    </div>
                  </div>
                </div>
                <Button variant="link" className="text-slate-400 text-sm p-0 mt-2">
                  SHOW MORE
                </Button>
              </Card>

              {/* Matchup Analysis */}
              <Card className="bg-slate-700/50 border-slate-600 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-5 h-5 text-orange-400" />
                  <h3 className="font-semibold text-orange-400">Key LVA Pts + Reb + Ast defense</h3>
                </div>
                
                <Tabs defaultValue="overall" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-600/50 text-xs">
                    <TabsTrigger value="overall">Overall</TabsTrigger>
                    <TabsTrigger value="vsg">vs G</TabsTrigger>
                    <TabsTrigger value="vsf">vs F</TabsTrigger>
                    <TabsTrigger value="vsc">vs C</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overall" className="mt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Points</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">{playerStats.matchupAnalysis.overall.rank}</span>
                          <span className="text-white">{playerStats.matchupAnalysis.overall.value}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Rebounds</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">{playerStats.matchupAnalysis.vsGuards.rank}</span>
                          <span className="text-white">{playerStats.matchupAnalysis.vsGuards.value}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Assists</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">{playerStats.matchupAnalysis.vsForwards.rank}</span>
                          <span className="text-white">{playerStats.matchupAnalysis.vsForwards.value}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Team Rankings */}
              <Card className="bg-slate-700/50 border-slate-600 p-4">
                <h3 className="font-semibold text-blue-400 mb-4">Team Rankings (2025)</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-gradient-to-r from-orange-400 to-red-400"></div>
                      <span className="text-sm text-white">Offense</span>
                    </div>
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Avg.</p>
                      <p className="text-white font-medium">{playerStats.teamRankings.offense.avg}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Rank</p>
                      <p className="text-white font-medium">#{playerStats.teamRankings.offense.rank}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Stat</p>
                      <p className="text-white font-medium">{playerStats.teamRankings.offense.stat}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
