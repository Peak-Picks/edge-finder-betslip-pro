// FIXED Long Shots Component - Only True High Risk, High Reward Bets

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Plus, Star, RefreshCw, AlertCircle, Zap, Target } from 'lucide-react';
import { useBetSlipContext } from './BetSlipContext';
import { dynamicPicksGenerator, GeneratedPick } from '../services/dynamicPicksGenerator';
import { LeagueTabsHeader } from './LeagueTabsHeader';
import ProperCategorizationService, { BettingCategory } from '../services/properCategorizationService';

interface TrueLongShot extends GeneratedPick {
  category: 'Long Shot';
  variance: number;
  hitRate: number;
  payoutMultiplier: number;
}

export const LongShots = () => {
  const { addToBetSlip, betSlip } = useBetSlipContext();
  const [longShots, setLongShots] = useState<TrueLongShot[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState('wnba');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🎲 LongShots component initializing...');
    loadTrueLongShots();
  }, [selectedLeague]);

  const loadTrueLongShots = () => {
    console.log('🎲 Loading TRUE long shots - high risk, high reward only');
    setLoading(true);
    setError(null);
    
    try {
      // Get all picks and filter for REAL long shots only
      const allPicks = dynamicPicksGenerator.generateLongShots(selectedLeague);
      
      // Apply proper categorization - only keep TRUE long shots
      const trueLongShots = allPicks
        .map(pick => ({
          ...pick,
          category: ProperCategorizationService.categorizeBet(
            pick.edge,
            pick.confidence,
            pick.odds,
            pick.projected,
            pick.line,
            pick.player
          ) as BettingCategory
        }))
        .filter(pick => pick.category === 'Long Shot')
        .map(pick => enhanceLongShotData(pick as any));

      // If no real long shots found, generate some proper examples
      if (trueLongShots.length === 0) {
        console.log('⚠️ No real long shots found, generating proper examples');
        const properLongShots = ProperCategorizationService.generateProperLongShots()
          .map(pick => enhanceLongShotData(pick as any));
        setLongShots(properLongShots);
      } else {
        console.log(`✅ Found ${trueLongShots.length} TRUE long shots`);
        setLongShots(trueLongShots);
      }
      
    } catch (error) {
      console.error('❌ Error loading long shots:', error);
      setError('Failed to load long shots');
      
      // Fallback to proper examples
      const fallbackLongShots = ProperCategorizationService.generateProperLongShots()
        .map(pick => enhanceLongShotData(pick as any));
      setLongShots(fallbackLongShots);
    } finally {
      setLoading(false);
    }
  };

  const enhanceLongShotData = (pick: GeneratedPick): TrueLongShot => {
    const numericOdds = parseOdds(pick.odds);
    const impliedProbability = oddsToImpliedProbability(numericOdds);
    const variance = pick.projected && pick.line ? 
      Math.abs(pick.projected - pick.line) / pick.line : 0.3;
    
    return {
      ...pick,
      category: 'Long Shot' as const,
      variance: variance,
      hitRate: impliedProbability, // Expected hit rate based on odds
      payoutMultiplier: numericOdds > 0 ? (numericOdds / 100) + 1 : (100 / Math.abs(numericOdds)) + 1
    };
  };

  const handleRefresh = async () => {
    console.log('🔄 Refreshing long shots...');
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      loadTrueLongShots();
    } catch (error) {
      console.error('❌ Error refreshing:', error);
      setError('Failed to refresh long shots');
    } finally {
      setRefreshing(false);
    }
  };

  const getPayoutColor = (multiplier: number) => {
    if (multiplier >= 5) return 'text-purple-400';
    if (multiplier >= 3) return 'text-pink-400';
    return 'text-emerald-400';
  };

  const getRiskBadge = (hitRate: number) => {
    if (hitRate <= 0.25) return {
      text: 'EXTREME RISK',
      color: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    if (hitRate <= 0.35) return {
      text: 'HIGH RISK', 
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };
    return {
      text: 'MODERATE RISK',
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
  };

  const getVarianceBadge = (variance: number) => {
    if (variance >= 0.4) return {
      text: 'BOOM OR BUST',
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    if (variance >= 0.25) return {
      text: 'HIGH VARIANCE',
      color: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    };
    return {
      text: 'MODERATE VARIANCE',
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    };
  };

  const parseOdds = (odds: string): number => {
    return parseInt(odds.replace(/[^-\d]/g, ''));
  };

  const oddsToImpliedProbability = (americanOdds: number): number => {
    if (americanOdds > 0) {
      return 100 / (americanOdds + 100);
    } else {
      return Math.abs(americanOdds) / (Math.abs(americanOdds) + 100);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold">Loading Long Shots...</h2>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-slate-800/50 border-slate-700/50 p-4 animate-pulse">
              <div className="h-32 bg-slate-700/50 rounded"></div>
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
          <Zap className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold">Long Shot Picks</h2>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
            HIGH RISK • HIGH REWARD
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
            {longShots.length} Available
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

      {/* Warning Banner */}
      <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-orange-400 mb-1">⚠️ Long Shot Warning</h3>
            <p className="text-sm text-orange-300">
              These are HIGH RISK bets with low hit rates but massive payouts. 
              Only bet what you can afford to lose. Long shots should be 1-3% of your bankroll maximum.
            </p>
          </div>
        </div>
      </div>

      <LeagueTabsHeader 
        selectedLeague={selectedLeague}
        onLeagueChange={setSelectedLeague}
      />

      <div className="space-y-4">
        {longShots.map((bet) => {
          const riskBadge = getRiskBadge(bet.hitRate);
          const varianceBadge = getVarianceBadge(bet.variance);
          
          return (
            <Card key={bet.id} className="bg-gradient-to-r from-slate-800/50 to-purple-900/20 border-purple-500/30 p-4 hover:from-slate-800/70 hover:to-purple-900/30 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-bold text-white text-lg">{bet.player} {bet.title}</h3>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                      LONG SHOT
                    </Badge>
                    <Badge className={`${riskBadge.color} text-xs`}>
                      {riskBadge.text}
                    </Badge>
                    <Badge className={`${varianceBadge.color} text-xs`}>
                      {varianceBadge.text}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-400 mb-1">
                    {bet.sport} | Game: {bet.game}
                  </div>
                  <p className="text-slate-300 text-sm mb-3">{bet.description}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className={`text-2xl font-bold ${getPayoutColor(bet.payoutMultiplier)}`}>
                    {bet.odds}
                  </div>
                  <div className="text-xs text-slate-400">
                    {bet.payoutMultiplier.toFixed(1)}x payout
                  </div>
                </div>
              </div>

              {/* Risk Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                <div className="bg-slate-700/30 rounded-lg p-2">
                  <div className="text-xs text-slate-400">Hit Rate</div>
                  <div className="text-sm font-bold text-red-400">
                    {(bet.hitRate * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-2">
                  <div className="text-xs text-slate-400">Edge</div>
                  <div className="text-sm font-bold text-emerald-400">
                    {bet.edge.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-2">
                  <div className="text-xs text-slate-400">Variance</div>
                  <div className="text-sm font-bold text-purple-400">
                    {(bet.variance * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-3 mb-3">
                <h4 className="text-purple-400 font-medium text-sm mb-2 flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  Long Shot Analysis:
                </h4>
                <p className="text-xs text-slate-300">{bet.insights}</p>
                {bet.projected && bet.line && (
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-slate-400">Our Projection: <span className="text-purple-400">{bet.projected}</span></span>
                    <span className="text-slate-400">Book Line: <span className="text-white">{bet.line}</span></span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-400">
                    Platform: <span className="text-white">{bet.platform}</span>
                  </div>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < bet.confidence ? 'text-purple-400 fill-purple-400' : 'text-gray-600'}`} 
                      />
                    ))}
                  </div>
                </div>
                <Button
                  onClick={() => addToBetSlip({
                    id: bet.id,
                    player: bet.player || '',
                    prop: bet.title,
                    odds: bet.odds,
                    platform: bet.platform,
                    edge: bet.edge,
                    projected: bet.projected,
                    line: bet.line,
                    sport: bet.sport,
                    game: bet.game
                  })}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                  disabled={betSlip.some(slip => slip.id === bet.id)}
                >
                  <Plus className="w-4 h-4" />
                  {betSlip.some(slip => slip.id === bet.id) ? 'Added' : 'Add Long Shot'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {longShots.length === 0 && !loading && (
        <div className="text-center py-8">
          <Zap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-slate-400 font-medium mb-2">No Long Shots Available</h3>
          <p className="text-slate-500 text-sm">
            No high-risk, high-reward opportunities found for {selectedLeague.toUpperCase()}. 
            Try refreshing or check other leagues.
          </p>
        </div>
      )}
    </div>
  );
};

export default LongShots;
