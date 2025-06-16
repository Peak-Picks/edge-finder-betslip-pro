import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Plus, BarChart3, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { useBetSlipContext } from './BetSlipContext';
import { dynamicPicksGenerator, GeneratedPick } from '../services/dynamicPicksGenerator';
import { LeagueTabsHeader } from './LeagueTabsHeader';

export const GameBasedPicks = () => {
  const { addToBetSlip, betSlip } = useBetSlipContext();
  const [gamePicks, setGamePicks] = useState<GeneratedPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState('nba');
  const [error, setError] = useState<string | null>(null);

  const API_KEY = '15439ae06549fa60c219cc8dd7bf8cc6';

  useEffect(() => {
    console.log('🔄 GameBasedPicks component initializing...');
    dynamicPicksGenerator.setApiKey(API_KEY);
    loadGamePicks();
  }, []);

  const loadGamePicks = async () => {
    console.log('🔄 GameBasedPicks loadGamePicks called');
    setLoading(true);
    setError(null);
    try {
      const picks = await dynamicPicksGenerator.generateGameBasedPicks();
      console.log(`📊 GameBasedPicks loaded ${picks.length} picks`);
      setGamePicks(picks);
    } catch (error) {
      console.error('❌ Error loading game picks:', error);
      setError('Failed to load game picks');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    console.log('🔄 GameBasedPicks handleRefresh called');
    setRefreshing(true);
    setError(null);
    try {
      await dynamicPicksGenerator.refreshWNBAData(true);
      console.log('✅ GameBasedPicks WNBA data refreshed, reloading picks...');
      await loadGamePicks();
    } catch (error) {
      console.error('❌ Error refreshing WNBA data in GameBasedPicks:', error);
      setError('Failed to refresh WNBA data');
    } finally {
      setRefreshing(false);
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getLeagueName = (league: string) => {
    switch (league) {
      case 'nba': return 'NBA';
      case 'nfl': return 'NFL';
      case 'mlb': return 'MLB';
      case 'wnba': return 'WNBA';
      default: return league.toUpperCase();
    }
  };

  const getOddsColor = (odds: string) => {
    const isPositive = odds.startsWith('+');
    return isPositive ? 'text-emerald-400' : 'text-red-400';
  };

  const filteredGamePicks = gamePicks.filter(pick => {
    const targetLeague = getLeagueName(selectedLeague);
    return pick.sport === targetLeague;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Loading Game Picks...</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-slate-800/50 border-slate-700/50 p-4 animate-pulse">
              <div className="h-28 bg-slate-700/50 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold">Game-Based AI Picks</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300">
            {filteredGamePicks.length} Available
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      <LeagueTabsHeader 
        selectedLeague={selectedLeague}
        onLeagueChange={setSelectedLeague}
      />

      <div className="space-y-3">
        {filteredGamePicks.map((pick) => {
          const alreadyAdded = betSlip.some(b => b.id === pick.id);
          
          return (
            <Card key={pick.id} className="bg-slate-800/50 border-slate-700/50 p-4 hover:bg-slate-800/70 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-white text-lg">{pick.matchup}</h3>
                    {pick.sport === 'WNBA' && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        Live WNBA
                      </Badge>
                    )}
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                      {pick.edge}% Edge
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                    <Clock className="w-3 h-3" />
                    <span>{pick.gameTime}</span>
                  </div>
                  <p className="text-cyan-300 font-medium">
                    {pick.type}: {pick.title}
                  </p>
                </div>
                <div className={`text-2xl font-bold ${getOddsColor(pick.odds)}`}>
                  {pick.odds}
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-3 mb-3">
                <h4 className="text-cyan-400 font-medium text-sm mb-2">Game Analysis:</h4>
                <p className="text-xs text-slate-300">{pick.insights}</p>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-slate-400 text-xs">Sportsbook:</p>
                  <p className="text-white font-medium text-sm">{pick.platform}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                  size="sm"
                  onClick={() => addToBetSlip({
                    id: pick.id,
                    type: pick.type,
                    description: pick.title,
                    odds: pick.odds,
                    edge: pick.edge
                  })}
                  disabled={alreadyAdded}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {alreadyAdded ? "Added to Betslip" : "Add to Betslip"}
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

      {selectedLeague === 'wnba' && filteredGamePicks.length === 0 && !loading && (
        <div className="text-center p-6 bg-slate-800/30 border border-slate-700 rounded-lg">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-400 mb-2">No WNBA game picks available</p>
          <p className="text-sm text-slate-500 mb-4">
            Click the refresh button to fetch live WNBA props from the Odds API
          </p>
          <Button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Fetching...' : 'Fetch WNBA Data'}
          </Button>
        </div>
      )}
    </div>
  );
};
