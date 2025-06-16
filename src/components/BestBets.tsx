import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Plus, Star, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useBetSlipContext } from './BetSlipContext';
import { dynamicPicksGenerator, GeneratedPick } from '../services/dynamicPicksGenerator';
import { LeagueTabsHeader } from './LeagueTabsHeader';

export const BestBets = () => {
  const { addToBetSlip, betSlip } = useBetSlipContext();
  const [bestBets, setBestBets] = useState<GeneratedPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState('nba');
  const [error, setError] = useState<string | null>(null);

  const API_KEY = '70f59ac60558d2b4dee1200bdaa2f2f3';

  useEffect(() => {
    // Set API key and load best bets
    dynamicPicksGenerator.setApiKey(API_KEY);
    loadBestBets();
  }, []);

  const loadBestBets = () => {
    setLoading(true);
    setError(null);
    try {
      const picks = dynamicPicksGenerator.generateBestBets();
      setBestBets(picks);
    } catch (error) {
      console.error('Error loading best bets:', error);
      setError('Failed to load best bets');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      await dynamicPicksGenerator.refreshWNBAData(true);
      loadBestBets();
    } catch (error) {
      console.error('Error refreshing WNBA data:', error);
      setError('Failed to refresh WNBA data');
    } finally {
      setRefreshing(false);
    }
  };

  const getConfidenceStars = (confidence: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < confidence ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
      />
    ));
  };

  const getOddsColor = (odds: string) => {
    const isPositive = odds.startsWith('+');
    return isPositive ? 'text-emerald-400' : 'text-red-400';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Top Prop': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Best Value': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'Trending': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getLeagueName = (league: string) => {
    switch (league) {
      case 'nba': return 'Basketball - NBA';
      case 'nfl': return 'Football - NFL';
      case 'mlb': return 'Baseball - MLB';
      case 'wnba': return 'Basketball - WNBA';
      default: return league;
    }
  };

  const filteredBets = bestBets.filter(bet => {
    const targetLeague = getLeagueName(selectedLeague);
    return bet.sport === targetLeague;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Loading Best Bets...</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-slate-800/50 border-slate-700/50 p-4 animate-pulse">
              <div className="h-20 bg-slate-700/50 rounded"></div>
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
          <Star className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-semibold">Today's Best Bets</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
            {filteredBets.length} Available
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
        {filteredBets.map((bet) => (
          <Card key={bet.id} className="bg-slate-800/50 border-slate-700/50 p-4 hover:bg-slate-800/70 transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-white text-lg">{bet.player} {bet.title}</h3>
                  <Badge className={getCategoryColor(bet.category)}>
                    {bet.category}
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                    {bet.edge}% Edge
                  </Badge>
                  {bet.sport === 'Basketball - WNBA' && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                      Live WNBA
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-slate-400 mb-1">
                  {bet.sport} | Game: {bet.game}
                </div>
                <p className="text-slate-300 text-sm mb-3">{bet.description}</p>
              </div>
              <div className={`text-2xl font-bold ${getOddsColor(bet.odds)}`}>
                {bet.odds}
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-3 mb-3">
              <h4 className="text-emerald-400 font-medium text-sm mb-2">AI Insights:</h4>
              <p className="text-xs text-slate-300">{bet.insights}</p>
              {bet.projected && bet.line && (
                <div className="flex justify-between mt-2 text-xs">
                  <span className="text-slate-400">Our Projection: <span className="text-emerald-400">{bet.projected}</span></span>
                  <span className="text-slate-400">Book Line: <span className="text-white">{bet.line}</span></span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-slate-400 text-xs">Platform:</p>
                  <p className="text-white font-medium text-sm">{bet.platform}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Confidence:</p>
                  <div className="flex items-center gap-1">
                    {getConfidenceStars(bet.confidence)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                size="sm"
                onClick={() => addToBetSlip({
                  id: bet.id,
                  type: bet.type,
                  description: `${bet.player} ${bet.title}`,
                  odds: bet.odds,
                  edge: bet.edge
                })}
                disabled={betSlip.some(b => b.id === bet.id)}
              >
                <Plus className="w-4 h-4 mr-1" />
                {betSlip.some(b => b.id === bet.id) ? "Added" : "Add to Betslip"}
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
        ))}
      </div>

      {selectedLeague === 'wnba' && filteredBets.length === 0 && !loading && (
        <div className="text-center p-6 bg-slate-800/30 border border-slate-700 rounded-lg">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-400 mb-2">No WNBA data available</p>
          <p className="text-sm text-slate-500 mb-4">
            Click the refresh button to fetch live WNBA props from the Odds API
          </p>
          <Button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Fetching...' : 'Fetch WNBA Data'}
          </Button>
        </div>
      )}
    </div>
  );
};
