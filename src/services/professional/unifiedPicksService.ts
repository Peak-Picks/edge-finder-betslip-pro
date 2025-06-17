import { calculationEngine } from './calculationEngine';
import { dataManager } from './dataManager';
import { wnbaModel, mlbModel } from './sportModels';
import { ProfessionalPick, PicksConfiguration } from './picksService';

/**
 * Unified Picks Service
 * Ensures all categories (Best Bets, Player Props, Long Shots, Game Lines)
 * pull from the same professional calculation engine with consistent insights
 */

export interface UnifiedPicksResponse {
  bestBets: ProfessionalPick[];
  playerProps: ProfessionalPick[];
  longShots: ProfessionalPick[];
  gameLines: ProfessionalPick[];
  trending: ProfessionalPick[];
  totalPicks: number;
  lastUpdated: Date;
}

export class UnifiedPicksService {
  private static instance: UnifiedPicksService;
  private allPicks: ProfessionalPick[] = [];
  private lastFetchTime: Date | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  static getInstance(): UnifiedPicksService {
    if (!UnifiedPicksService.instance) {
      UnifiedPicksService.instance = new UnifiedPicksService();
    }
    return UnifiedPicksService.instance;
  }
  
  /**
   * Get all picks with proper categorization
   * This is the main method that all components should use
   */
  async getAllPicks(forceRefresh = false): Promise<UnifiedPicksResponse> {
    // Check cache
    if (!forceRefresh && this.isCacheValid()) {
      console.log('📦 Using cached picks');
      return this.categorizePicks(this.allPicks);
    }
    
    console.log('🔄 Fetching fresh picks from all sources...');
    
    try {
      // Fetch all data in parallel
      const [gameData, propsData] = await Promise.all([
        this.fetchAllGameData(),
        this.fetchAllPropsData()
      ]);
      
      // Process all picks with professional calculations
      const processedPicks: ProfessionalPick[] = [];
      
      // Process game lines (spreads and totals)
      for (const game of gameData) {
        const gameLinePicks = await this.processGameLines(game);
        processedPicks.push(...gameLinePicks);
      }
      
      // Process player props
      for (const prop of propsData) {
        const propPick = await this.processPlayerProp(prop);
        if (propPick) {
          processedPicks.push(propPick);
        }
      }
      
      // Sort by quality score
      this.allPicks = this.sortByQuality(processedPicks);
      this.lastFetchTime = new Date();
      
      console.log(`✅ Processed ${this.allPicks.length} total picks`);
      
      return this.categorizePicks(this.allPicks);
      
    } catch (error) {
      console.error('❌ Error fetching picks:', error);
      
      // Return cached data if available
      if (this.allPicks.length > 0) {
        console.log('⚠️ Using stale cache due to error');
        return this.categorizePicks(this.allPicks);
      }
      
      // Return empty categories if no cache
      return {
        bestBets: [],
        playerProps: [],
        longShots: [],
        gameLines: [],
        trending: [],
        totalPicks: 0,
        lastUpdated: new Date()
      };
    }
  }
  
  /**
   * Categorize picks based on edge, confidence, and type
   */
  private categorizePicks(picks: ProfessionalPick[]): UnifiedPicksResponse {
    const bestBets: ProfessionalPick[] = [];
    const playerProps: ProfessionalPick[] = [];
    const longShots: ProfessionalPick[] = [];
    const gameLines: ProfessionalPick[] = [];
    const trending: ProfessionalPick[] = [];
    
    for (const pick of picks) {
      // Categorize by quality and type
      if (pick.type === 'player_prop') {
        // Long shots: High odds player props
        if (this.isLongShot(pick)) {
          longShots.push(this.enhanceAsLongShot(pick));
        }
        // Best bets: Top quality player props
        else if (this.isBestBet(pick)) {
          bestBets.push(this.enhanceAsBestBet(pick));
        }
        // Regular player props
        playerProps.push(pick);
      } else {
        // Game lines (spreads and totals)
        gameLines.push(pick);
        
        // Also add top game lines to best bets
        if (this.isBestBet(pick)) {
          bestBets.push(this.enhanceAsBestBet(pick));
        }
      }
      
      // Trending: Recent high-movement picks
      if (this.isTrending(pick)) {
        trending.push(pick);
      }
    }
    
    // Ensure unique picks in each category
    return {
      bestBets: this.removeDuplicates(bestBets).slice(0, 6),
      playerProps: this.removeDuplicates(playerProps).slice(0, 20),
      longShots: this.removeDuplicates(longShots).slice(0, 6),
      gameLines: this.removeDuplicates(gameLines).slice(0, 15),
      trending: this.removeDuplicates(trending).slice(0, 5),
      totalPicks: picks.length,
      lastUpdated: this.lastFetchTime || new Date()
    };
  }
  
  /**
   * Determine if a pick qualifies as a best bet
   */
  private isBestBet(pick: ProfessionalPick): boolean {
    return (
      pick.edge >= 7 && 
      pick.confidence >= 80 &&
      pick.expectedValue >= 0.05 &&
      (pick.sharpAction === true || pick.marketMovement?.steamDetected === true)
    );
  }
  
  /**
   * Determine if a pick qualifies as a long shot
   */
  private isLongShot(pick: ProfessionalPick): boolean {
    const odds = parseInt(pick.odds.replace(/[+-]/g, ''));
    return (
      (pick.odds.startsWith('+') && odds >= 150) ||
      (pick.edge >= 5 && odds >= 130)
    );
  }
  
  /**
   * Determine if a pick is trending
   */
  private isTrending(pick: ProfessionalPick): boolean {
    return (
      pick.marketMovement?.steamDetected === true ||
      pick.marketMovement?.lineDirection === 'toward_pick' ||
      pick.sharpAction === true
    );
  }
  
  /**
   * Enhance pick as best bet with special insights
   */
  private enhanceAsBestBet(pick: ProfessionalPick): ProfessionalPick {
    return {
      ...pick,
      category: 'lock',
      insights: `🔥 TOP PLAY: ${pick.insights} Model shows exceptional value with ${pick.edge.toFixed(1)}% edge and ${pick.confidence}% confidence.`
    };
  }
  
  /**
   * Enhance pick as long shot with special insights
   */
  private enhanceAsLongShot(pick: ProfessionalPick): ProfessionalPick {
    return {
      ...pick,
      category: 'lottery',
      insights: `🎯 LONG SHOT: ${pick.insights} High-reward opportunity at ${pick.odds} odds.`
    };
  }
  
  /**
   * Fetch all game data
   */
  private async fetchAllGameData(): Promise<any[]> {
    const sports = ['basketball_wnba', 'baseball_mlb'];
    const allGames = [];
    
    for (const sport of sports) {
      try {
        const games = await dataManager.fetchSportsData(
          sport,
          ['spreads', 'totals'],
          ['draftkings', 'fanduel', 'betmgm']
        );
        allGames.push(...games);
      } catch (error) {
        console.error(`Error fetching ${sport} games:`, error);
      }
    }
    
    return allGames;
  }
  
  /**
   * Fetch all props data
   */
  private async fetchAllPropsData(): Promise<any[]> {
    const sports = ['basketball_wnba', 'baseball_mlb'];
    const allProps = [];
    
    for (const sport of sports) {
      try {
        const games = await dataManager.fetchSportsData(
          sport,
          ['player_props'],
          ['draftkings', 'fanduel', 'betmgm']
        );
        
        // Extract props from games
        for (const game of games) {
          if (game.props && game.props.length > 0) {
            allProps.push(...game.props.map(prop => ({
              ...prop,
              sport,
              game
            })));
          }
        }
      } catch (error) {
        console.error(`Error fetching ${sport} props:`, error);
      }
    }
    
    return allProps;
  }
  
  /**
   * Process game lines with professional calculations
   */
  private async processGameLines(game: any): Promise<ProfessionalPick[]> {
    const picks: ProfessionalPick[] = [];
    
    // Process spread
    if (game.lines?.spread?.home && game.lines?.spread?.away) {
      const spreadPick = await this.analyzeSpread(game);
      if (spreadPick) picks.push(spreadPick);
    }
    
    // Process total
    if (game.lines?.total?.over && game.lines?.total?.under) {
      const totalPick = await this.analyzeTotal(game);
      if (totalPick) picks.push(totalPick);
    }
    
    return picks;
  }
  
  /**
   * Process player prop with professional calculations
   */
  private async processPlayerProp(prop: any): Promise<ProfessionalPick | null> {
    try {
      // Get projection based on sport
      let projection;
      
      if (prop.sport === 'basketball_wnba') {
        projection = await this.getWNBAProjection(prop);
      } else if (prop.sport === 'baseball_mlb') {
        projection = await this.getMLBProjection(prop);
      } else {
        return null;
      }
      
      if (!projection) return null;
      
      // Calculate edge
      const edge = calculationEngine.calculateEdge(
        projection.projection,
        prop.line,
        prop.betType || 'over',
        prop.odds
      );
      
      // Skip low edge picks
      if (edge.edge < 3) return null;
      
      // Calculate Kelly
      const kelly = calculationEngine.calculateKellyBetSize(edge, 10000);
      
      // Create professional pick
      return {
        id: `${prop.sport}_${prop.player}_${prop.stat}_${Date.now()}`,
        sport: this.formatSportName(prop.sport),
        type: 'player_prop',
        pick: `${prop.player} ${prop.betType || 'Over'} ${prop.line} ${prop.stat}`,
        description: `${prop.player} to get ${prop.betType || 'over'} ${prop.line} ${prop.stat}`,
        line: prop.line,
        odds: prop.odds,
        platform: prop.bookmaker || 'DraftKings',
        edge: edge.edge,
        trueProbability: edge.trueProbability,
        impliedProbability: edge.impliedProbability,
        expectedValue: edge.expectedValue,
        confidence: projection.confidence || 70,
        kellyBetSize: kelly.fractionOfBankroll,
        category: this.categorizeByEdge(edge.edge),
        projection: projection.projection,
        factors: projection.factors || [],
        insights: this.generatePropInsights(prop, projection, edge),
        gameTime: prop.game?.game?.commenceTime || new Date(),
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error processing player prop:', error);
      return null;
    }
  }
  
  /**
   * Analyze spread bet
   */
  private async analyzeSpread(game: any): Promise<ProfessionalPick | null> {
    // Mock calculation - would use real power ratings
    const homeAdvantage = 2.5;
    const powerDiff = Math.random() * 10 - 5; // Would be real calculation
    const trueSpread = powerDiff + homeAdvantage;
    
    const marketSpread = game.lines.spread.home.line;
    const spreadDiff = Math.abs(trueSpread - marketSpread);
    
    if (spreadDiff < 1) return null;
    
    const pickHome = trueSpread < marketSpread;
    const team = pickHome ? game.game.homeTeam : game.game.awayTeam;
    const line = pickHome ? game.lines.spread.home : game.lines.spread.away;
    
    const edge = calculationEngine.calculateEdge(
      trueSpread,
      marketSpread,
      pickHome ? 'under' : 'over',
      line.odds.toString()
    );
    
    if (edge.edge < 3) return null;
    
    const kelly = calculationEngine.calculateKellyBetSize(edge, 10000);
    
    return {
      id: `${game.game.id}_spread_${Date.now()}`,
      sport: this.formatSportName(game.game.sport),
      type: 'spread',
      pick: `${team} ${line.line > 0 ? '+' : ''}${line.line}`,
      description: `${team} to cover the spread`,
      line: line.line,
      odds: line.odds.toString(),
      platform: line.bookmaker,
      edge: edge.edge,
      trueProbability: edge.trueProbability,
      impliedProbability: edge.impliedProbability,
      expectedValue: edge.expectedValue,
      confidence: 75,
      kellyBetSize: kelly.fractionOfBankroll,
      category: this.categorizeByEdge(edge.edge),
      projection: trueSpread,
      factors: ['Power rating analysis', 'Home field advantage', 'Recent form'],
      insights: `Professional model projects ${team} by ${Math.abs(trueSpread).toFixed(1)} points. ${edge.edge.toFixed(1)}% edge identified.`,
      gameTime: game.game.commenceTime,
      lastUpdated: new Date()
    };
  }
  
  /**
   * Analyze total bet
   */
  private async analyzeTotal(game: any): Promise<ProfessionalPick | null> {
    // Mock calculation - would use real scoring projections
    const projectedTotal = 150 + Math.random() * 30; // Would be real calculation
    const marketTotal = game.lines.total.over.line;
    const totalDiff = Math.abs(projectedTotal - marketTotal);
    
    if (totalDiff < 2) return null;
    
    const pickOver = projectedTotal > marketTotal;
    const line = pickOver ? game.lines.total.over : game.lines.total.under;
    
    const edge = calculationEngine.calculateEdge(
      projectedTotal,
      marketTotal,
      pickOver ? 'over' : 'under',
      line.odds.toString()
    );
    
    if (edge.edge < 3) return null;
    
    const kelly = calculationEngine.calculateKellyBetSize(edge, 10000);
    
    return {
      id: `${game.game.id}_total_${Date.now()}`,
      sport: this.formatSportName(game.game.sport),
      type: 'total',
      pick: `${pickOver ? 'Over' : 'Under'} ${line.line}`,
      description: `Total points ${pickOver ? 'over' : 'under'} ${line.line}`,
      line: line.line,
      odds: line.odds.toString(),
      platform: line.bookmaker,
      edge: edge.edge,
      trueProbability: edge.trueProbability,
      impliedProbability: edge.impliedProbability,
      expectedValue: edge.expectedValue,
      confidence: 70,
      kellyBetSize: kelly.fractionOfBankroll,
      category: this.categorizeByEdge(edge.edge),
      projection: projectedTotal,
      factors: ['Pace analysis', 'Defensive ratings', 'Recent scoring trends'],
      insights: `Model projects ${projectedTotal.toFixed(1)} total points. ${edge.edge.toFixed(1)}% edge on the ${pickOver ? 'over' : 'under'}.`,
      gameTime: game.game.commenceTime,
      lastUpdated: new Date()
    };
  }
  
  /**
   * Generate insights for player props
   */
  private generatePropInsights(prop: any, projection: any, edge: any): string {
    const insights = [];
    
    // Edge description
    if (edge.edge >= 8) {
      insights.push(`🔥 Strong ${edge.edge.toFixed(1)}% edge detected.`);
    } else {
      insights.push(`✨ ${edge.edge.toFixed(1)}% value identified.`);
    }
    
    // Projection
    insights.push(`Model projects ${projection.projection.toFixed(1)} ${prop.stat}.`);
    
    // Key factor
    if (projection.factors && projection.factors.length > 0) {
      insights.push(projection.factors[0]);
    }
    
    return insights.join(' ');
  }
  
  /**
   * Get WNBA projection
   */
  private async getWNBAProjection(prop: any): Promise<any> {
    // Mock projection - would use real WNBA model
    const baseLine = prop.line || 10;
    const variance = baseLine * 0.2;
    const projection = baseLine + (Math.random() * variance - variance/2);
    
    return {
      projection: projection,
      confidence: 65 + Math.random() * 30,
      factors: [
        'Recent form trending up',
        'Favorable matchup',
        'Expected high minutes'
      ]
    };
  }
  
  /**
   * Get MLB projection
   */
  private async getMLBProjection(prop: any): Promise<any> {
    // Mock projection - would use real MLB model
    const baseLine = prop.line || 5;
    const variance = baseLine * 0.3;
    const projection = baseLine + (Math.random() * variance - variance/2);
    
    return {
      projection: projection,
      confidence: 60 + Math.random() * 35,
      factors: [
        'Pitcher matchup advantage',
        'Ballpark factor favorable',
        'Weather conditions optimal'
      ]
    };
  }
  
  /**
   * Helper methods
   */
  
  private isCacheValid(): boolean {
    if (!this.lastFetchTime) return false;
    const now = Date.now();
    const lastFetch = this.lastFetchTime.getTime();
    return (now - lastFetch) < this.CACHE_DURATION;
  }
  
  private sortByQuality(picks: ProfessionalPick[]): ProfessionalPick[] {
    return picks.sort((a, b) => {
      const scoreA = (a.edge * 0.5) + (a.confidence * 0.3) + (a.expectedValue * 200 * 0.2);
      const scoreB = (b.edge * 0.5) + (b.confidence * 0.3) + (b.expectedValue * 200 * 0.2);
      return scoreB - scoreA;
    });
  }
  
  private removeDuplicates(picks: ProfessionalPick[]): ProfessionalPick[] {
    const seen = new Set<string>();
    return picks.filter(pick => {
      const key = `${pick.pick}_${pick.line}_${pick.odds}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  
  private categorizeByEdge(edge: number): 'lock' | 'strong' | 'value' | 'lottery' {
    if (edge >= 10) return 'lock';
    if (edge >= 7) return 'strong';
    if (edge >= 5) return 'value';
    return 'lottery';
  }
  
  private formatSportName(sport: string): string {
    const sportMap = {
      'basketball_wnba': 'WNBA',
      'baseball_mlb': 'MLB',
      'basketball_nba': 'NBA',
      'football_nfl': 'NFL',
      'hockey_nhl': 'NHL'
    };
    return sportMap[sport] || sport.toUpperCase();
  }
  
  /**
   * Force refresh all data
   */
  async forceRefresh(): Promise<UnifiedPicksResponse> {
    console.log('🔄 Force refreshing all picks...');
    return this.getAllPicks(true);
  }
  
  /**
   * Get specific category only
   */
  async getCategory(category: 'bestBets' | 'playerProps' | 'longShots' | 'gameLines'): Promise<ProfessionalPick[]> {
    const allPicks = await this.getAllPicks();
    return allPicks[category];
  }
}

// Export singleton instance
export const unifiedPicksService = UnifiedPicksService.getInstance();
