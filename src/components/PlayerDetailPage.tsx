
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

interface GameData {
  opponent: string;
  total: number;
  hit: boolean;
  pts?: number;
  reb?: number;
  ast?: number;
}

interface StatData {
  overview: {
    average: number;
    median: number;
    last10: string;
    l5: string;
    l20: string;
    h2h: string;
    season2025: string;
    season2024: string;
  };
  recentGames: GameData[];
}

export const PlayerDetailPage = ({ player, open, onOpenChange }: PlayerDetailPageProps) => {
  const [selectedStat, setSelectedStat] = useState('PTS+REB+AST');
  const [showAltLines, setShowAltLines] = useState(false);
  
  if (!player) return null;

  // Generate dynamic data based on the player and selected stat
  const getPlayerStats = (playerName: string, stat: string): StatData => {
    const baseStats = {
      'Luka Dončić': {
        'PTS+REB+AST': {
          overview: { average: 30.9, median: 31, last10: '70%', l5: '80%', l20: '55%', h2h: '100%', season2025: '73%', season2024: '47%' },
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
          ]
        },
        'PTS': {
          overview: { average: 28.5, median: 29, last10: '60%', l5: '60%', l20: '65%', h2h: '75%', season2025: '68%', season2024: '52%' },
          recentGames: [
            { opponent: 'vs LAL', total: 25, hit: false },
            { opponent: 'vs BOS', total: 17, hit: false },
            { opponent: 'vs MIA', total: 15, hit: false },
            { opponent: 'vs PHX', total: 23, hit: false },
            { opponent: 'vs DEN', total: 35, hit: true },
            { opponent: 'vs GSW', total: 28, hit: false },
            { opponent: 'vs SAC', total: 24, hit: false },
            { opponent: 'vs POR', total: 26, hit: false },
            { opponent: 'vs UTA', total: 18, hit: false },
            { opponent: 'vs OKC', total: 24, hit: false }
          ]
        },
        'REB': {
          overview: { average: 8.5, median: 8, last10: '80%', l5: '100%', l20: '70%', h2h: '67%', season2025: '76%', season2024: '58%' },
          recentGames: [
            { opponent: 'vs LAL', total: 5, hit: false },
            { opponent: 'vs BOS', total: 9, hit: true },
            { opponent: 'vs MIA', total: 8, hit: false },
            { opponent: 'vs PHX', total: 8, hit: false },
            { opponent: 'vs DEN', total: 6, hit: false },
            { opponent: 'vs GSW', total: 5, hit: false },
            { opponent: 'vs SAC', total: 7, hit: false },
            { opponent: 'vs POR', total: 6, hit: false },
            { opponent: 'vs UTA', total: 6, hit: false },
            { opponent: 'vs OKC', total: 9, hit: true }
          ]
        },
        'AST': {
          overview: { average: 8.5, median: 8, last10: '50%', l5: '40%', l20: '60%', h2h: '50%', season2025: '55%', season2024: '45%' },
          recentGames: [
            { opponent: 'vs LAL', total: 3, hit: false },
            { opponent: 'vs BOS', total: 0, hit: false },
            { opponent: 'vs MIA', total: 0, hit: false },
            { opponent: 'vs PHX', total: 0, hit: false },
            { opponent: 'vs DEN', total: 0, hit: false },
            { opponent: 'vs GSW', total: 2, hit: false },
            { opponent: 'vs SAC', total: 0, hit: false },
            { opponent: 'vs POR', total: 1, hit: false },
            { opponent: 'vs UTA', total: 1, hit: false },
            { opponent: 'vs OKC', total: -2, hit: false }
          ]
        }
      },
      'Jayson Tatum': {
        'PTS+REB+AST': {
          overview: {
            average: 27.4,
            median: 28,
            last10: '60%',
            l5: '60%',
            l20: '65%',
            h2h: '75%',
            season2025: '68%',
            season2024: '52%'
          },
          recentGames: [
            { opponent: 'vs MIA', total: 29, pts: 22, reb: 4, ast: 3, hit: true },
            { opponent: 'vs PHI', total: 24, pts: 18, reb: 6, ast: 0, hit: false },
            { opponent: 'vs NYK', total: 31, pts: 24, reb: 5, ast: 2, hit: true },
            { opponent: 'vs BRK', total: 28, pts: 21, reb: 7, ast: 0, hit: true },
            { opponent: 'vs ATL', total: 26, pts: 19, reb: 4, ast: 3, hit: false },
            { opponent: 'vs CHA', total: 32, pts: 26, reb: 3, ast: 3, hit: true },
            { opponent: 'vs WAS', total: 30, pts: 23, reb: 5, ast: 2, hit: true },
            { opponent: 'vs ORL', total: 25, pts: 17, reb: 6, ast: 2, hit: false },
            { opponent: 'vs DET', total: 33, pts: 27, reb: 4, ast: 2, hit: true },
            { opponent: 'vs TOR', total: 27, pts: 20, reb: 5, ast: 2, hit: true }
          ]
        }
      },
      'Giannis Antetokounmpo': {
        'PTS+REB+AST': {
          overview: {
            average: 32.8,
            median: 33,
            last10: '80%',
            l5: '100%',
            l20: '70%',
            h2h: '67%',
            season2025: '76%',
            season2024: '58%'
          },
          recentGames: [
            { opponent: 'vs PHI', total: 36, pts: 28, reb: 8, ast: 0, hit: true },
            { opponent: 'vs CHI', total: 34, pts: 26, reb: 7, ast: 1, hit: true },
            { opponent: 'vs IND', total: 31, pts: 23, reb: 6, ast: 2, hit: true },
            { opponent: 'vs CLE', total: 38, pts: 30, reb: 6, ast: 2, hit: true },
            { opponent: 'vs TOR', total: 35, pts: 27, reb: 8, ast: 0, hit: true },
            { opponent: 'vs DET', total: 29, pts: 21, reb: 6, ast: 2, hit: false },
            { opponent: 'vs ATL', total: 37, pts: 31, reb: 5, ast: 1, hit: true },
            { opponent: 'vs BRK', total: 33, pts: 25, reb: 7, ast: 1, hit: true },
            { opponent: 'vs NYK', total: 32, pts: 24, reb: 6, ast: 2, hit: true },
            { opponent: 'vs MIA', total: 30, pts: 22, reb: 6, ast: 2, hit: false }
          ]
        }
      }
    };

    // Get player data or use default
    const playerData = baseStats[playerName as keyof typeof baseStats];
    if (!playerData) {
      return {
        overview: { average: 25.5, median: 26, last10: '50%', l5: '40%', l20: '60%', h2h: '50%', season2025: '55%', season2024: '45%' },
        recentGames: Array(10).fill(null).map((_, i) => ({ opponent: 'vs OPP', total: 20 + Math.floor(Math.random() * 10), hit: Math.random() > 0.5 }))
      };
    }

    const statData = playerData[stat as keyof typeof playerData];
    if (!statData) {
      return {
        overview: { average: 25.5, median: 26, last10: '50%', l5: '40%', l20: '60%', h2h: '50%', season2025: '55%', season2024: '45%' },
        recentGames: Array(10).fill(null).map((_, i) => ({ opponent: 'vs OPP', total: 20 + Math.floor(Math.random() * 10), hit: Math.random() > 0.5 }))
      };
    }

    return statData;
  };

  const playerStats = getPlayerStats(player.name, selectedStat);
  
  const matchupAnalysis = {
    overall: { rank: 9, value: 83.9 },
    vsGuards: { rank: 12, value: 36.3 },
    vsForwards: { rank: 12, value: 22.4 },
    vsCenters: { rank: 8, value: 45.2 }
  };

  const teamRankings = {
    offense: { avg: 52.3, rank: 8, stat: 'Effective Field Goal', rankStat: 12, avgStat: 52.0 },
    defense: { avg: 48.1, rank: 15, stat: 'Opponent Points', rankStat: 20, avgStat: 110.5 }
  };

  const statTabs = [
    'PTS+REB+AST', 'PTS', '1Q PTS', '1H PTS', 'AST', 'PTS+AST', 
    '3PTM', 'REB', '1H REB', 'PTS+REB', 'REB+AST'
  ];

  const getStatDisplayName = (stat: string) => {
    const displayNames = {
      'PTS+REB+AST': 'Pts + Reb + Ast',
      'PTS': 'Points',
      'REB': 'Rebounds', 
      'AST': 'Assists',
      '1Q PTS': '1st Quarter Points',
      '1H PTS': '1st Half Points',
      'PTS+AST': 'Points + Assists',
      '3PTM': '3-Pointers Made',
      '1H REB': '1st Half Rebounds',
      'PTS+REB': 'Points + Rebounds',
      'REB+AST': 'Rebounds + Assists'
    };
    return displayNames[stat as keyof typeof displayNames] || stat;
  };

  const getCurrentLine = (stat: string) => {
    const lines = {
      'PTS+REB+AST': '29.5',
      'PTS': '28.5',
      'REB': '8.5',
      'AST': '8.5',
      '1Q PTS': '7.5',
      '1H PTS': '15.5',
      'PTS+AST': '37.5',
      '3PTM': '3.5',
      '1H REB': '4.5',
      'PTS+REB': '37.5',
      'REB+AST': '17.5'
    };
    return lines[stat as keyof typeof lines] || '25.5';
  };

  const getAltLines = (stat: string) => {
    const currentLine = parseFloat(getCurrentLine(stat));
    return [
      { line: currentLine - 1, odds: '+125' },
      { line: currentLine - 0.5, odds: '+110' },
      { line: currentLine, odds: '-108' },
      { line: currentLine + 0.5, odds: '-115' },
      { line: currentLine + 1, odds: '-130' }
    ];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-slate-800 border-slate-700 text-white max-h-[95vh] overflow-y-auto p-0">
        <div className="p-4">
          <DialogHeader className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onOpenChange(false)}
                className="text-slate-400 hover:text-white p-1 h-auto"
              >
                <ArrowLeft className="w-3 h-3 mr-1" />
                Back
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{player.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white mb-1">
                  {player.name}
                </DialogTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs px-1.5 py-0.5">
                    {player.team}
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs px-1.5 py-0.5">
                    {player.matchup}
                  </Badge>
                  <span className="text-slate-400 text-xs">Today 5:00 PM</span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Stats Section */}
            <div className="lg:col-span-2 space-y-4">
              {/* Stat Selection */}
              <Card className="bg-slate-700/50 border-slate-600 p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-emerald-400">
                    {player.name} - {getStatDisplayName(selectedStat)} - Over {getCurrentLine(selectedStat)}
                  </h3>
                  <div className="flex gap-2">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 h-7 text-xs" size="sm">
                      Over {getCurrentLine(selectedStat)} -108
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-slate-600 h-7 text-xs px-2"
                      onClick={() => setShowAltLines(!showAltLines)}
                    >
                      ALT LINES
                    </Button>
                  </div>
                </div>
                
                {showAltLines && (
                  <div className="mb-3 p-2 bg-slate-800/50 rounded-lg">
                    <h4 className="text-xs font-semibold text-slate-300 mb-2">Alternative Lines</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {getAltLines(selectedStat).map((altLine, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                          <span className="text-white text-sm">Over {altLine.line}</span>
                          <Button size="sm" variant="outline" className="border-slate-600 text-emerald-400 h-6 text-xs">
                            {altLine.odds}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {statTabs.map((stat) => (
                    <button
                      key={stat}
                      onClick={() => setSelectedStat(stat)}
                      className={`px-2 py-1 text-xs rounded border-b-2 transition-colors ${
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
              <Card className="bg-slate-700/50 border-slate-600 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-semibold text-emerald-400 text-sm">{player.name} - {getStatDisplayName(selectedStat)}</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-slate-400">Last 10</p>
                    <p className="text-lg font-bold text-emerald-400">{playerStats.overview.last10}</p>
                    <p className="text-xs text-slate-500">7 of 10</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">L5</p>
                    <p className="text-lg font-bold text-emerald-400">{playerStats.overview.l5}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">H2H</p>
                    <p className="text-lg font-bold text-emerald-400">{playerStats.overview.h2h}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">2024</p>
                    <p className="text-lg font-bold text-red-400">{playerStats.overview.season2024}</p>
                  </div>
                </div>

                <div className="flex gap-4 text-xs text-slate-400 mb-3">
                  <span>Average: <span className="text-white font-medium">{playerStats.overview.average}</span></span>
                  <span>Median: <span className="text-white font-medium">{playerStats.overview.median}</span></span>
                </div>

                {/* Chart representation */}
                <div className="h-32 bg-slate-600/30 rounded-lg flex items-end justify-center p-2">
                  <div className="flex items-end gap-1 h-full">
                    {playerStats.recentGames.slice(0, 10).map((game, index) => (
                      <div
                        key={index}
                        className={`w-6 flex flex-col items-center justify-end ${
                          game.hit ? 'bg-emerald-500' : 'bg-red-500'
                        } rounded-t relative`}
                        style={{ height: `${Math.min((game.total / (selectedStat.includes('PTS+REB+AST') ? 45 : selectedStat.includes('PTS') ? 35 : 15)) * 100, 100)}%` }}
                      >
                        <span className="text-xs text-white font-bold absolute -top-4">
                          {game.total}
                        </span>
                        {selectedStat === 'PTS+REB+AST' && game.pts !== undefined && (
                          <div className="text-xs text-white p-0.5">
                            <div>{game.pts}</div>
                            <div>{game.reb || 0}</div>
                            <div>{game.ast || 0}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Line Movement */}
              <Card className="bg-slate-700/50 border-slate-600 p-3">
                <h3 className="font-semibold text-pink-400 mb-3 text-sm">Line movement</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-400">Updated</p>
                      <p className="text-xs text-white">8:59 AM Today</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Line</p>
                      <p className="text-xs text-red-400">{getCurrentLine(selectedStat)} ▼-1</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-white">10:26 PM Jun 14</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white">{parseFloat(getCurrentLine(selectedStat)) + 1}</p>
                      <p className="text-xs text-slate-400">Open</p>
                    </div>
                  </div>
                </div>
                <Button variant="link" className="text-slate-400 text-xs p-0 mt-2 h-auto">
                  SHOW MORE
                </Button>
              </Card>

              {/* Matchup Analysis */}
              <Card className="bg-slate-700/50 border-slate-600 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-orange-400" />
                  <h3 className="font-semibold text-orange-400 text-sm">Key {player.team} {getStatDisplayName(selectedStat)} defense</h3>
                </div>
                
                <Tabs defaultValue="overall" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-600/50 text-xs h-7">
                    <TabsTrigger value="overall" className="text-xs">Overall</TabsTrigger>
                    <TabsTrigger value="vsg" className="text-xs">vs G</TabsTrigger>
                    <TabsTrigger value="vsf" className="text-xs">vs F</TabsTrigger>
                    <TabsTrigger value="vsc" className="text-xs">vs C</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overall" className="mt-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-xs">Points</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold text-xs">{matchupAnalysis.overall.rank}</span>
                          <span className="text-white text-xs">{matchupAnalysis.overall.value}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-xs">Rebounds</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold text-xs">{matchupAnalysis.vsGuards.rank}</span>
                          <span className="text-white text-xs">{matchupAnalysis.vsGuards.value}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-xs">Assists</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold text-xs">{matchupAnalysis.vsForwards.rank}</span>
                          <span className="text-white text-xs">{matchupAnalysis.vsForwards.value}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Team Rankings */}
              <Card className="bg-slate-700/50 border-slate-600 p-3">
                <h3 className="font-semibold text-blue-400 mb-3 text-sm">Team Rankings (2025)</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gradient-to-r from-orange-400 to-red-400"></div>
                      <span className="text-xs text-white">Offense</span>
                    </div>
                    <TrendingUp className="w-3 h-3 text-slate-400" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-slate-400">Avg.</p>
                      <p className="text-white font-medium">{teamRankings.offense.avg}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Rank</p>
                      <p className="text-white font-medium">#{teamRankings.offense.rank}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Stat</p>
                      <p className="text-white font-medium text-xs">{teamRankings.offense.stat}</p>
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
