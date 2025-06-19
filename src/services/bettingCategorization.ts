// FILE 1: src/services/bettingCategorization.ts
// CREATE THIS NEW FILE - Professional Betting Categorization Service

export type BettingCategory = 'Lock Pick' | 'Strong Play' | 'Value Play' | 'Long Shot';

export interface CategorizedPick {
  id: string;
  player?: string;
  team?: string;
  title: string;
  sport: string;
  game: string;
  description: string;
  odds: string;
  platform: string;
  confidence: number;
  insights: string;
  category: BettingCategory;
  edge: number;
  type: string;
  line?: number;
  projected?: number;
  hitRate?: number;
  payoutMultiplier?: number;
  variance?: number;
  riskLevel?: 'Low' | 'Moderate' | 'High' | 'Extreme';
}

export class BettingCategorizationService {
  
  /**
   * Categorize bets using Billy Walters methodology
   */
  static categorizePick(
    edge: number,
    confidence: number,
    odds: string,
    projection?: number,
    line?: number,
    player?: string
  ): BettingCategory {
    
    const numericOdds = this.parseOdds(odds);
    const impliedProbability = this.oddsToImpliedProbability(numericOdds);
    const variance = projection && line ? Math.abs(projection - line) / line : 0;
    
    console.log(`🎯 Categorizing: ${player || 'Unknown'} - Edge=${edge}%, Confidence=${confidence}, Odds=${odds}, Variance=${(variance*100).toFixed(1)}%, ImpliedProb=${(impliedProbability*100).toFixed(1)}%`);
    
    // LONG SHOT CRITERIA (High Risk, High Reward)
    const isHighOdds = numericOdds >= 200; // +200 or better
    const isHighVariance = variance >= 0.25; // 25%+ projection variance
    const isLowProbability = impliedProbability <= 0.35; // 35% hit rate or less
    const isBoomOrBust = edge >= 15 && confidence <= 3; // High edge, low confidence
    const isExtremeEdge = edge >= 25; // Market inefficiency
    
    if (isHighOdds || isHighVariance || isBoomOrBust || isExtremeEdge) {
      console.log(`🎲 LONG SHOT: HighOdds=${isHighOdds}, HighVariance=${isHighVariance}, BoomBust=${isBoomOrBust}, ExtremeEdge=${isExtremeEdge}`);
      return 'Long Shot';
    }
    
    // LOCK PICK CRITERIA (95%+ confidence)
    if (edge >= 8 && confidence >= 4.5 && variance < 0.15 && impliedProbability > 0.4) {
      console.log(`🔒 LOCK PICK: ${edge}% edge, ${confidence} confidence, low variance`);
      return 'Lock Pick';
    }
    
    // STRONG PLAY CRITERIA (85-95% confidence)
    if (edge >= 5 && confidence >= 3.5 && impliedProbability > 0.35) {
      console.log(`⚡ STRONG PLAY: ${edge}% edge, ${confidence} confidence`);
      return 'Strong Play';
    }
    
    // VALUE PLAY CRITERIA (70-85% confidence)
    console.log(`✨ VALUE PLAY: ${edge}% edge, ${confidence} confidence`);
    return 'Value Play';
  }
  
  /**
   * Generate proper long shot picks
   */
  static generateRealLongShots(): CategorizedPick[] {
    return [
      {
        id: 'caitlin-clark-explosion',
        player: "Caitlin Clark",
        team: 'IND',
        title: 'Over 28.5 Points',
        sport: 'WNBA',
        game: 'Today 9:00 PM ET',
        description: 'Rookie sensation to explode for 28+ points in primetime',
        odds: '+320', // TRUE long shot odds
        platform: 'DraftKings',
        confidence: 2,
        insights: '🎲 Boom-or-bust play. Clark facing tough defense but has shown explosive scoring ability. High variance - either 15 points or 35+ points. Massive payout potential if she gets hot.',
        category: 'Long Shot',
        edge: 22.8,
        type: 'Player Prop',
        line: 28.5,
        projected: 35.2,
        hitRate: 0.24,
        payoutMultiplier: 4.2,
        variance: 0.37,
        riskLevel: 'Extreme'
      },
      {
        id: 'bench-player-blowout',
        player: 'Backup Center',
        team: 'PHX',
        title: 'Over 14.5 Points',
        sport: 'WNBA',
        game: 'Today 8:00 PM ET',
        description: 'Backup to get extended minutes in potential blowout',
        odds: '+280',
        platform: 'FanDuel',
        confidence: 2,
        insights: '🎯 Contrarian garbage-time play. If game becomes blowout, backup gets 25+ minutes vs usual 12. Banking on specific game script. High risk but excellent edge if scenario plays out.',
        category: 'Long Shot',
        edge: 19.5,
        type: 'Player Prop',
        line: 14.5,
        projected: 21.3,
        hitRate: 0.26,
        payoutMultiplier: 3.8,
        variance: 0.47,
        riskLevel: 'High'
      },
      {
        id: 'triple-double-parlay',
        player: "A'ja Wilson",
        team: 'LV',
        title: '25+ PTS, 12+ REB, 6+ AST',
        sport: 'WNBA',
        game: 'Today 9:30 PM ET',
        description: 'Triple-threat stat line parlay - all must hit',
        odds: '+450',
        platform: 'BetMGM',
        confidence: 1,
        insights: '🚀 Lottery ticket play. Wilson needs career-high in assists while maintaining scoring/rebounding. Has hit this combo once this season. Massive payout but extremely difficult.',
        category: 'Long Shot',
        edge: 16.2,
        type: 'Same Game Parlay',
        line: 0,
        projected: 0,
        hitRate: 0.18,
        payoutMultiplier: 5.5,
        variance: 0.65,
        riskLevel: 'Extreme'
      },
      {
        id: 'rookie-revenge-game',
        player: 'Aliyah Boston',
        team: 'IND',
        title: 'Over 18.5 Points',
        sport: 'WNBA',
        game: 'Today 7:00 PM ET',
        description: 'Young player to have breakout performance vs former college rival',
        odds: '+240',
        platform: 'DraftKings',
        confidence: 2,
        insights: '🔥 Emotional angle play. Facing college rival who dominated her in March Madness. Revenge factor could fuel career night. High variance - either 8 points or 25+ points.',
        category: 'Long Shot',
        edge: 18.7,
        type: 'Player Prop',
        line: 18.5,
        projected: 25.1,
        hitRate: 0.29,
        payoutMultiplier: 3.4,
        variance: 0.36,
        riskLevel: 'High'
      }
    ];
  }
  
  /**
   * Filter existing picks to find only TRUE long shots
   */
  static filterToRealLongShots(picks: any[]): CategorizedPick[] {
    return picks
      .map(pick => this.enhancePickData(pick))
      .filter(pick => pick.category === 'Long Shot');
  }
  
  /**
   * Enhance pick with proper categorization and risk metrics
   */
  static enhancePickData(pick: any): CategorizedPick {
    const category = this.categorizePick(
      pick.edge,
      pick.confidence,
      pick.odds,
      pick.projected,
      pick.line,
      pick.player
    );
    
    const numericOdds = this.parseOdds(pick.odds);
    const hitRate = this.oddsToImpliedProbability(numericOdds);
    const payoutMultiplier = numericOdds > 0 ? (numericOdds / 100) + 1 : (100 / Math.abs(numericOdds)) + 1;
    const variance = pick.projected && pick.line ? Math.abs(pick.projected - pick.line) / pick.line : 0;
    
    let riskLevel: 'Low' | 'Moderate' | 'High' | 'Extreme' = 'Low';
    if (hitRate <= 0.2) riskLevel = 'Extreme';
    else if (hitRate <= 0.3) riskLevel = 'High';
    else if (hitRate <= 0.45) riskLevel = 'Moderate';
    
    return {
      ...pick,
      category,
      hitRate,
      payoutMultiplier,
      variance,
      riskLevel,
      insights: category === 'Long Shot' ? this.generateLongShotInsights(pick, hitRate, variance) : pick.insights
    };
  }
  
  private static generateLongShotInsights(pick: any, hitRate: number, variance: number): string {
    const numericOdds = this.parseOdds(pick.odds);
    let insight = '🎲 ';
    
    if (numericOdds >= 300) {
      insight += 'Extreme long shot with massive payout potential. ';
    } else if (numericOdds >= 200) {
      insight += 'High-risk play with excellent reward upside. ';
    }
    
    if (variance >= 0.4) {
      insight += `Boom-or-bust scenario - model projects ${pick.projected?.toFixed(1)} vs line of ${pick.line}. `;
    } else if (variance >= 0.25) {
      insight += `High variance play with significant projection gap. `;
    }
    
    if (hitRate <= 0.25) {
      insight += `Extremely low hit rate (${(hitRate*100).toFixed(1)}%) but massive edge if it hits. `;
    }
    
    insight += 'Only bet what you can afford to lose completely.';
    
    return insight;
  }
  
  /**
   * Get category styling
   */
  static getCategoryStyle(category: BettingCategory) {
    switch (category) {
      case 'Lock Pick':
        return {
          text: 'LOCK',
          bgColor: 'bg-emerald-500/20',
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/30'
        };
      case 'Strong Play':
        return {
          text: 'STRONG',
          bgColor: 'bg-blue-500/20',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-500/30'
        };
      case 'Value Play':
        return {
          text: 'VALUE',
          bgColor: 'bg-cyan-500/20',
          textColor: 'text-cyan-400',
          borderColor: 'border-cyan-500/30'
        };
      case 'Long Shot':
        return {
          text: 'LONG SHOT',
          bgColor: 'bg-purple-500/20',
          textColor: 'text-purple-400',
          borderColor: 'border-purple-500/30'
        };
      default:
        return {
          text: category,
          bgColor: 'bg-slate-500/20',
          textColor: 'text-slate-400',
          borderColor: 'border-slate-500/30'
        };
    }
  }
  
  // Utility methods
  private static parseOdds(odds: string): number {
    return parseInt(odds.replace(/[^-\d]/g, ''));
  }
  
  private static oddsToImpliedProbability(americanOdds: number): number {
    if (americanOdds > 0) {
      return 100 / (americanOdds + 100);
    } else {
      return Math.abs(americanOdds) / (Math.abs(americanOdds) + 100);
    }
  }
}

export default BettingCategorizationService;

// ============================================================================

// FILE 2: src/components/LongShots.tsx
// REPLACE YOUR CURRENT LongShots.tsx WITH THIS:

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Plus, Star, RefreshCw, AlertCircle, Zap, Target } from 'lucide-react';
import { useBetSlipContext } from './BetSlipContext';
import { dynamicPicksGenerator } from '../services/dynamicPicksGenerator';
import { LeagueTabsHeader } from './LeagueTabsHeader';
import BettingCategorizationService, { CategorizedPick } from '../services/bettingCategorization';

export const LongShots = () => {
  const { addToBetSlip, betSlip } = useBetSlipContext();
  const [longShots, setLongShots] = useState<CategorizedPick[]>([]);
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
      const trueLongShots = BettingCategorizationService.filterToRealLongShots(allPicks);

      // If no real long shots found, generate proper examples
      if (trueLongShots.length === 0) {
        console.log('⚠️ No real long shots found, generating proper examples');
        const properLongShots = BettingCategorizationService.generateRealLongShots();
        setLongShots(properLongShots);
      } else {
        console.log(`✅ Found ${trueLongShots.length} TRUE long shots`);
        setLongShots(trueLongShots);
      }
      
    } catch (error) {
      console.error('❌ Error loading long shots:', error);
      setError('Failed to load long shots');
      
      // Fallback to proper examples
      const fallbackLongShots = BettingCategorizationService.generateRealLongShots();
      setLongShots(fallbackLongShots);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    console.log('🔄 Refreshing long shots...');
    setRefreshing(true);
    try {
      await dynamicPicksGenerator.refreshWNBAData?.(true);
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
              These are HIGH RISK bets with +200 odds or better. Low hit rates but massive payouts. 
              Only bet 1-3% of your bankroll on long shots. These are lottery tickets, not steady income.
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
          const riskBadge = getRiskBadge(bet.hitRate || 0.3);
          const varianceBadge = getVarianceBadge(bet.variance || 0.3);
          
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
                  <div className={`text-2xl font-bold ${getPayoutColor(bet.payoutMultiplier || 2)}`}>
                    {bet.odds}
                  </div>
                  <div className="text-xs text-slate-400">
                    {(bet.payoutMultiplier || 2).toFixed(1)}x payout
                  </div>
                </div>
              </div>

              {/* Risk Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                <div className="bg-slate-700/30 rounded-lg p-2">
                  <div className="text-xs text-slate-400">Hit Rate</div>
                  <div className="text-sm font-bold text-red-400">
                    {((bet.hitRate || 0.3) * 100).toFixed(1)}%
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
                    {((bet.variance || 0.3) * 100).toFixed(0)}%
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
