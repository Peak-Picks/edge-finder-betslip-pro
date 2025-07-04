import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Filter, TrendingUp, RefreshCw, AlertCircle, Star } from 'lucide-react';
import { PlayerPropInsights } from './PlayerPropInsights';
import { useBetSlipContext } from './BetSlipContext';
import { dynamicPicksGenerator, GeneratedPick } from '../services/dynamicPicksGenerator';
import { createOddsApiService, ProcessedProp } from '../services/oddsApiService';

interface PlayerPropsProps {
  onRefreshData?: () => void;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds (until manual refresh)
const WNBA_CACHE_KEY = 'wnba_props_cache';

export const PlayerProps = ({ onRefreshData }: PlayerPropsProps) => {
  const [selectedSport, setSelectedSport] = useState('wnba');
  const [selectedProp, setSelectedProp] = useState<any>(null);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [playerProps, setPlayerProps] = useState<{nba: GeneratedPick[], nfl: GeneratedPick[], wnba: ProcessedProp[]}>({nba: [], nfl: [], wnba: []});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wnbaDataSource, setWnbaDataSource] = useState<'live' | 'unavailable'>('unavailable');

  const { addToBetSlip, betSlip } = useBetSlipContext();

  const API_KEY = '70f59ac60558d2b4dee1200bdaa2f2f3';

  // Check if we have valid cached WNBA data
  const getWNBACachedData = (): ProcessedProp[] | null => {
    try {
      const cached = localStorage.getItem(WNBA_CACHE_KEY);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      // Only clear cache if it's older than 24 hours (very long duration)
      if (now - timestamp > CACHE_DURATION) {
        localStorage.removeItem(WNBA_CACHE_KEY);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error reading WNBA cache:', error);
      localStorage.removeItem(WNBA_CACHE_KEY);
      return null;
    }
  };

  // Save WNBA data to cache
  const setWNBACachedData = (data: ProcessedProp[]) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(WNBA_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving WNBA cache:', error);
    }
  };

  // Initialize with NBA/NFL data and check for cached WNBA data
  useEffect(() => {
    console.log('🎬 PlayerProps component initialized');
    const nbaProps = dynamicPicksGenerator.generatePlayerProps('nba');
    const nflProps = dynamicPicksGenerator.generatePlayerProps('nfl');
    
    // Check for cached WNBA data first
    const cachedWNBAData = getWNBACachedData();
    if (cachedWNBAData && cachedWNBAData.length > 0) {
      console.log('📦 Using cached WNBA data, skipping API call');
      setPlayerProps({ nba: nbaProps, nfl: nflProps, wnba: cachedWNBAData });
      setWnbaDataSource('live');
    } else {
      console.log('💾 No valid cached WNBA data found, will load from API');
      setPlayerProps({ nba: nbaProps, nfl: nflProps, wnba: [] });
      loadWNBAProps();
    }
  }, []);

  const loadWNBAProps = async (forceRefresh: boolean = false) => {
    console.log('🎯 loadWNBAProps function called, forceRefresh:', forceRefresh);
    
    // If not forcing refresh, check cache first
    if (!forceRefresh) {
      const cachedData = getWNBACachedData();
      if (cachedData && cachedData.length > 0) {
        console.log('📦 Found valid cached data, using cache instead of API');
        setPlayerProps(prev => ({ ...prev, wnba: cachedData }));
        setWnbaDataSource('live');
        return;
      }
    }
    
    setLoading(true);
    setError(null);
    console.log('Loading WNBA props from live API...');
    console.log('🔑 Using API key:', API_KEY ? `Present (${API_KEY.length} chars)` : 'Missing');
    
    try {
      console.log('🏗️ Creating OddsApiService instance...');
      const oddsService = createOddsApiService(API_KEY);
      console.log('✅ OddsApiService created, calling getWNBAProps...');
      
      const wnbaProps = await oddsService.getWNBAProps(forceRefresh);
      console.log('📬 getWNBAProps returned:', wnbaProps.length, 'props');
      
      if (wnbaProps.length > 0) {
        console.log('✅ Successfully received WNBA props, updating state and cache...');
        setPlayerProps(prev => ({ ...prev, wnba: wnbaProps }));
        setWnbaDataSource('live');
        setWNBACachedData(wnbaProps); // Cache the data
        console.log(`Successfully loaded ${wnbaProps.length} live WNBA props`);
      } else {
        console.log('⚠️ No WNBA props returned from API');
        setPlayerProps(prev => ({ ...prev, wnba: [] }));
        setWnbaDataSource('unavailable');
        setError('No WNBA player props found. This could be due to no games today or props not yet available.');
        console.log('No WNBA player props found');
      }
    } catch (error) {
      console.error('💥 Failed to load WNBA props:', error);
      setError('WNBA data is currently unavailable. Please try again later.');
      setPlayerProps(prev => ({ ...prev, wnba: [] }));
      setWnbaDataSource('unavailable');
    } finally {
      console.log('🏁 WNBA props loading complete, setting loading to false');
      setLoading(false);
    }
  };

  const loadPlayerProps = async () => {
    setLoading(true);
    setError(null);
    try {
      const nbaProps = dynamicPicksGenerator.generatePlayerProps('nba');
      const nflProps = dynamicPicksGenerator.generatePlayerProps('nfl');
      
      // Load WNBA props separately with proper error handling
      await loadWNBAProps(true); // Force refresh when manually loading
      
      setPlayerProps(prev => ({ ...prev, nba: nbaProps, nfl: nflProps }));
      
      // Call parent refresh callback if provided
      if (onRefreshData) {
        onRefreshData();
      }
    } catch (error) {
      console.error('Error loading player props:', error);
      setError('Failed to load some player props.');
    } finally {
      setLoading(false);
    }
  };

  const refreshPicks = () => {
    if (selectedSport === 'wnba') {
      loadWNBAProps(true); // Force refresh for WNBA
    } else {
      dynamicPicksGenerator.refreshAllPicks();
      const nbaProps = dynamicPicksGenerator.generatePlayerProps('nba');
      const nflProps = dynamicPicksGenerator.generatePlayerProps('nfl');
      setPlayerProps(prev => ({ ...prev, nba: nbaProps, nfl: nflProps }));
    }
  };

  const getWinPercentage = (edge: number, odds: string): number => {
    // Convert odds to implied probability
    const oddsNumber = parseInt(odds.replace(/[+-]/g, ''));
    let impliedProb = 0;
    
    if (odds.startsWith('+')) {
      impliedProb = 100 / (oddsNumber + 100);
    } else {
      impliedProb = oddsNumber / (oddsNumber + 100);
    }
    
    // Add edge to get our estimated win probability
    const adjustedProb = impliedProb + (edge / 100);
    return Math.min(95, Math.max(5, Math.round(adjustedProb * 100)));
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
      case 'Player Prop': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
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

  const extractPropFromTitle = (title: string): string => {
    // Handle titles that already have clean prop names
    if (title.includes('Points') || title.includes('Rebounds') || title.includes('Assists')) {
      const match = title.match(/(Points|Rebounds|Assists)/);
      return match ? match[1] : title;
    }
    
    // Handle legacy format "Over X.X PropType"
    const match = title.match(/Over \d+\.?\d* (.+)/);
    return match ? match[1] : title;
  };

  const getBetType = (prop: GeneratedPick | ProcessedProp): string => {
    // Check if the title explicitly mentions "Under"
    if (prop.title.toLowerCase().includes('under')) {
      return 'Under';
    }
    
    // Check if it's a ProcessedProp with outcome property
    if ('outcome' in prop && prop.outcome) {
      return prop.outcome === 'over' ? 'Over' : 'Under';
    }
    
    // For GeneratedPick, check if type property exists
    if ('type' in prop && prop.type) {
      return prop.type;
    }
    
    // Default to Over if no clear indicator
    return 'Over';
  };

  const handlePropClick = (prop: GeneratedPick | ProcessedProp) => {
    const betType = getBetType(prop);
    setSelectedProp({
      player: prop.player,
      team: prop.team,
      prop: extractPropFromTitle(prop.title),
      line: prop.line,
      type: betType,
      odds: prop.odds,
      edge: prop.edge,
      projected: prop.projected,
      confidence: typeof prop.confidence === 'number' && prop.confidence >= 4 ? "high" : typeof prop.confidence === 'number' && prop.confidence >= 2 ? "medium" : "low"
    });
    setInsightsOpen(true);
  };

  const getGameDetails = (prop: GeneratedPick | ProcessedProp): string => {
    // For WNBA props with matchup details
    if (selectedSport === 'wnba' && 'matchup' in prop && prop.matchup) {
      return ` (${prop.matchup})`;
    }
    
    // For WNBA props with game details in various formats
    if (selectedSport === 'wnba' && 'game' in prop && prop.game) {
      const gameInfo = prop.game;
      
      // Handle different game info formats
      if (gameInfo.includes('vs')) {
        const parts = gameInfo.split(' vs ');
        if (parts.length === 2) {
          return ` (vs ${parts[1].trim()})`;
        }
      } else if (gameInfo.includes('@')) {
        const parts = gameInfo.split(' @ ');
        if (parts.length === 2) {
          return ` (@ ${parts[1].trim()})`;
        }
      }
      
      // If game info exists but doesn't match expected format, return it as is
      if (gameInfo && gameInfo !== 'Today' && gameInfo !== 'TBD') {
        return ` (${gameInfo})`;
      }
    }
    
    // For other sports with game property
    if ('game' in prop && prop.game && prop.game !== 'Today' && prop.game !== 'TBD') {
      return ` (${prop.game})`;
    }
    
    // Return empty string if no valid game details found
    return '';
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
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
          </div>
        </div>

        {error && selectedSport === 'wnba' && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        <Tabs value={selectedSport} onValueChange={setSelectedSport}>
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger 
              value="wnba" 
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
            >
              WNBA {wnbaDataSource === 'live' ? '(Live)' : '(Unavailable)'}
            </TabsTrigger>
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
                const betType = getBetType(prop);
                const gameDetails = getGameDetails(prop);
                const confidence = typeof prop.confidence === 'number' 
                  ? Math.min(5, Math.max(1, Math.floor(prop.confidence)))
                  : 3;
                const winPercentage = getWinPercentage(prop.edge, prop.odds);
                
                return (
                  <Card 
                    key={index} 
                    className="bg-slate-800/50 border-slate-700/50 p-6 cursor-pointer hover:bg-slate-800/70 transition-colors"
                    onClick={() => handlePropClick(prop)}
                  >
                    {/* Header with player name, badges, and odds */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-white text-xl">
                            {prop.player} {betType} {prop.line} {propType}
                          </h3>
                          <Badge className={getCategoryColor(prop.category || 'Player Prop')}>
                            {prop.category || 'Player Prop'}
                          </Badge>
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            {prop.edge}% Edge
                          </Badge>
                          {selectedSport === 'wnba' && wnbaDataSource === 'live' && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Live WNBA
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-slate-400 mb-1">
                          {prop.sport || selectedSport.toUpperCase()} | Game: {gameDetails || prop.game || 'Today'}
                        </div>
                        <p className="text-slate-300 text-sm">{prop.description}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getOddsColor(prop.odds)}`}>
                          {prop.odds}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">
                          {winPercentage}% Win Prob
                        </div>
                      </div>
                    </div>

                    {/* AI Insights Section */}
                    <div className="bg-slate-700/30 rounded-lg p-4 mb-4">
                      <h4 className="text-emerald-400 font-medium text-sm mb-2">AI Insights:</h4>
                      <p className="text-sm text-slate-300 mb-3">
                        {prop.insights || `Optimal ${selectedSport.toUpperCase()} bet based on ${prop.projected} projection vs ${prop.line} line. ${prop.edge}% edge on ${betType}.`}
                      </p>
                      {prop.projected && prop.line && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Our Projection: <span className="text-emerald-400 font-medium">{prop.projected}</span></span>
                          <span className="text-slate-400">Book Line: <span className="text-white font-medium">{prop.line}</span></span>
                        </div>
                      )}
                    </div>

                    {/* Platform and Confidence */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-slate-400 text-xs mb-1">Platform:</p>
                          <p className="text-white font-semibold">{prop.platform}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs mb-1">Confidence:</p>
                          <div className="flex items-center gap-1">
                            {getConfidenceStars(confidence)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                        size="lg"
                        disabled={alreadyAdded}
                        onClick={() => addToBetSlip({
                          id: betId,
                          type: 'Player Prop',
                          player: prop.player,
                          team: prop.team,
                          description: `${prop.player} ${betType} ${prop.line} ${propType}${gameDetails}`,
                          odds: prop.odds,
                          edge: prop.edge,
                          line: prop.line,
                        })}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {alreadyAdded ? "Added to Betslip" : "Add to Betslip"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <TrendingUp className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
              
              {selectedSport === 'wnba' && playerProps.wnba.length === 0 && !loading && (
                <Card className="bg-slate-800/50 border-slate-700/50 p-6 text-center">
                  <div className="space-y-2">
                    <p className="text-slate-400">
                      No WNBA player props available.
                    </p>
                    <p className="text-slate-500 text-sm">
                      The API currently only provides game lines (spreads, moneylines, totals) for WNBA games. Player props (points, rebounds, assists) are not available at this time.
                    </p>
                  </div>
                </Card>
              )}
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
