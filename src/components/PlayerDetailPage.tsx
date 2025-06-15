import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TrendingUp, BarChart3, Target, Calendar, Bandage } from 'lucide-react';

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
  
  // Get player position based on name (in real app this would come from data)
  const getPlayerPosition = (playerName: string) => {
    const positions = {
      'Luka Dončić': 'PG',
      'Jayson Tatum': 'SF', 
      'Giannis Antetokounmpo': 'PF',
      'LeBron James': 'SF',
      'Stephen Curry': 'PG',
      'Kevin Durant': 'SF',
      'Nikola Jokić': 'C',
      'Joel Embiid': 'C'
    };
    return positions[playerName as keyof typeof positions] || 'PG';
  };

  const playerPosition = getPlayerPosition(player.name);

  // Get relevant defensive stats based on selected stat
  const getRelevantDefensiveStats = (stat: string) => {
    if (stat.includes('PTS')) {
      return [
        { label: 'Opp PPG', rank: 9, value: '108.2' },
        { label: 'Def Rating', rank: 15, value: '112.3' }
      ];
    } else if (stat.includes('REB')) {
      return [
        { label: 'Opp RPG', rank: 12, value: '45.1' },
        { label: 'Reb Rate', rank: 8, value: '78.9%' }
      ];
    } else if (stat.includes('AST')) {
      return [
        { label: 'Opp APG', rank: 18, value: '26.4' },
        { label: 'TOV Rate', rank: 11, value: '14.2%' }
      ];
    } else if (stat.includes('3PTM')) {
      return [
        { label: 'Opp 3P%', rank: 22, value: '37.8%' },
        { label: '3P Def', rank: 28, value: '12.1' }
      ];
    } else {
      // For combo stats like PTS+REB+AST
      return [
        { label: 'Opp PPG', rank: 9, value: '108.2' },
        { label: 'Opp RPG', rank: 12, value: '45.1' },
        { label: 'Opp APG', rank: 18, value: '26.4' }
      ];
    }
  };

  const relevantDefensiveStats = getRelevantDefensiveStats(selectedStat);

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
      <DialogContent className="max-w-6xl bg-slate-800 border-slate-700 text-white max-h-[95vh] overflow-y-auto p-0">
        <div className="p-3">
          <DialogHeader className="mb-3">
            <div className="flex items-center gap-2 mb-2">
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
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{player.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-white mb-1">
                  {player.name}
                </DialogTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs px-1 py-0.5">
                    {player.team}
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs px-1 py-0.5">
                    {playerPosition}
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs px-1 py-0.5">
                    {player.matchup}
                  </Badge>
                  <span className="text-slate-400 text-xs">Today 5:00 PM</span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            {/* Main Stats Section - Takes 3 columns */}
            <div className="lg:col-span-3 space-y-3">
              {/* Stat Selection */}
              <Card className="bg-slate-700/50 border-slate-600 p-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-emerald-400">
                    {player.name} - {getStatDisplayName(selectedStat)} - Over {getCurrentLine(selectedStat)}
                  </h3>
                  <div className="flex gap-1">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 h-6 text-xs px-2" size="sm">
                      Over {getCurrentLine(selectedStat)} -108
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-slate-600 h-6 text-xs px-2"
                      onClick={() => setShowAltLines(!showAltLines)}
                    >
                      ALT LINES
                    </Button>
                  </div>
                </div>
                
                {showAltLines && (
                  <div className="mb-2 p-2 bg-slate-800/50 rounded-lg">
                    <h4 className="text-xs font-semibold text-slate-300 mb-1">Alternative Lines</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {getAltLines(selectedStat).map((altLine, index) => (
                        <div key={index} className="flex justify-between items-center p-1 bg-slate-700/30 rounded">
                          <span className="text-white text-xs">Over {altLine.line}</span>
                          <Button size="sm" variant="outline" className="border-slate-600 text-emerald-400 h-5 text-xs px-1">
                            {altLine.odds}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1 mb-2">
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

              {/* Performance Stats - 2 Column Layout */}
              <Card className="bg-slate-700/50 border-slate-600 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-semibold text-emerald-400 text-sm">{player.name} - {getStatDisplayName(selectedStat)}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column - Performance Metrics */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-300 mb-2">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-2 mb-3">
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

                    <div className="flex gap-4 text-xs text-slate-400">
                      <span>Average: <span className="text-white font-medium">{playerStats.overview.average}</span></span>
                      <span>Median: <span className="text-white font-medium">{playerStats.overview.median}</span></span>
                    </div>
                  </div>

                  {/* Right Column - Recent Games Chart */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-300 mb-2">Recent Games</h4>
                    <div className="h-32 bg-slate-600/30 rounded-lg flex items-end justify-center p-2">
                      <div className="flex items-end gap-1 h-full">
                        {playerStats.recentGames.slice(0, 10).map((game, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div
                              className={`w-4 flex flex-col items-center justify-end ${
                                game.hit ? 'bg-emerald-500' : 'bg-red-500'
                              } rounded-t relative`}
                              style={{ height: `${Math.min((game.total / (selectedStat.includes('PTS+REB+AST') ? 45 : selectedStat.includes('PTS') ? 35 : 15)) * 100, 100)}%` }}
                            >
                              <span className="text-xs text-white font-bold absolute -top-4">
                                {game.total}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 mt-1 transform -rotate-45 origin-center">
                              {game.opponent.replace('vs ', '').slice(0, 3)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar - Takes 1 column */}
            <div className="space-y-3">
              {/* Line Movement and Key Defense - Side by Side */}
              <div className="grid grid-cols-2 gap-2">
                {/* Line Movement */}
                <Card className="bg-slate-700/50 border-slate-600 p-2">
                  <h3 className="font-semibold text-pink-400 mb-2 text-xs">Line movement</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs text-slate-400">Updated</p>
                        <p className="text-xs text-white">8:59 AM Today</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Line</p>
                        <p className="text-xs text-red-400">{getCurrentLine(selectedStat)} ▼-1</p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs text-white">10:26 PM Jun 14</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white">{parseFloat(getCurrentLine(selectedStat)) + 1}</p>
                        <p className="text-xs text-slate-400">Open</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="link" className="text-slate-400 text-xs p-0 mt-1 h-auto">
                    SHOW MORE
                  </Button>
                </Card>

                {/* Key Defense */}
                <Card className="bg-slate-700/50 border-slate-600 p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-orange-400" />
                    <h3 className="font-semibold text-orange-400 text-xs">Key defense</h3>
                  </div>
                  
                  <div className="space-y-1">
                    {relevantDefensiveStats.map((stat, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-slate-400 text-xs">{stat.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold text-xs">#{stat.rank}</span>
                          <span className="text-white text-xs">{stat.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Supporting Stats - Now in 3 columns (2 rows) */}
              <div className="grid grid-cols-2 gap-2">
                {/* Team Rankings */}
                <Card className="bg-slate-700/50 border-slate-600 p-2">
                  <h3 className="font-semibold text-blue-400 mb-2 text-xs">Team Rankings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded bg-gradient-to-r from-orange-400 to-red-400"></div>
                        <span className="text-xs text-white">Offense</span>
                      </div>
                      <TrendingUp className="w-3 h-3 text-slate-400" />
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <p className="text-slate-400">Avg.</p>
                        <p className="text-white font-medium">{teamRankings.offense.avg}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-slate-400">Rank</p>
                        <p className="text-white font-medium">#{teamRankings.offense.rank}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Player Trends */}
                <Card className="bg-slate-700/50 border-slate-600 p-2">
                  <h3 className="font-semibold text-purple-400 mb-2 text-xs">Player Trends</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hot Streak</span>
                      <span className="text-emerald-400 font-bold">3 games</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Home/Away</span>
                      <span className="text-white">65%/58%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">B2B Games</span>
                      <span className="text-red-400">42%</span>
                    </div>
                  </div>
                </Card>

                {/* Team Injuries */}
                <Card className="bg-slate-700/50 border-slate-600 p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Bandage className="w-3 h-3 text-red-400" />
                    <h3 className="font-semibold text-red-400 text-xs">{player.team} Injuries</h3>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">K. Irving</span>
                      <span className="text-yellow-400">Questionable</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">D. Powell</span>
                      <span className="text-red-400">Out</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">M. Kleber</span>
                      <span className="text-red-400">Out</span>
                    </div>
                  </div>
                </Card>

                {/* Opponent Injuries */}
                <Card className="bg-slate-700/50 border-slate-600 p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Bandage className="w-3 h-3 text-orange-400" />
                    <h3 className="font-semibold text-orange-400 text-xs">Opponent Injuries</h3>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">J. Brown</span>
                      <span className="text-yellow-400">Probable</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">K. Porzingis</span>
                      <span className="text-red-400">Out</span>
                    </div>
                  </div>
                </Card>

                {/* Game Conditions */}
                <Card className="bg-slate-700/50 border-slate-600 p-2">
                  <h3 className="font-semibold text-cyan-400 mb-2 text-xs">Game Conditions</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rest Days</span>
                      <span className="text-white">2 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Time Zone</span>
                      <span className="text-emerald-400">Home</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">TV Game</span>
                      <span className="text-white">Yes</span>
                    </div>
                  </div>
                </Card>

                {/* Player Status */}
                <Card className="bg-slate-700/50 border-slate-600 p-2">
                  <h3 className="font-semibold text-yellow-400 mb-2 text-xs">Player Status</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Health</span>
                      <span className="text-emerald-400 font-bold">Healthy</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Minutes</span>
                      <span className="text-white">35.2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Usage</span>
                      <span className="text-white">31.8%</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
