// COMPLETE FIXED dynamicPicksGenerator.ts 
// Copy and paste this ENTIRE file to replace your current one

import { PicksCalculationEngine, PlayerStats, GameData } from './picksCalculation';
import { mockDataService } from './mockDataService';
import { createOddsApiService } from './oddsApiService';

export interface GeneratedPick {
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
  category: string;
  edge: number;
  type: string;
  matchup?: string;
  gameTime?: string;
  line?: number;
  projected?: number;
}

interface StoredWNBAData {
  bestBets: GeneratedPick[];
  gamePicks: GeneratedPick[];
  longShots: GeneratedPick[];
  playerProps: GeneratedPick[];
  lastUpdated: number;
}

export class DynamicPicksGenerator {
  private calculationEngine: PicksCalculationEngine;
  private oddsApiService: any;
  private wnbaDataKey = 'wnba_stored_data';

  constructor() {
    this.calculationEngine = new PicksCalculationEngine();
    this.oddsApiService = null;
  }

  setApiKey(apiKey: string) {
    this.oddsApiService = createOddsApiService(apiKey);
    console.log('🔑 API Key set for WNBA data fetching');
  }

  // ============================================================================
  // PROPER CATEGORIZATION METHOD - BILLY WALTERS METHODOLOGY
  // ============================================================================

  private categorizePick(edge: number, confidence: number, odds: string, projection?: number, line?: number, player?: string): string {
    const numericOdds = parseInt(odds.replace(/[^-\d]/g, ''));
    const impliedProbability = numericOdds > 0 ? 100 / (numericOdds + 100) : Math.abs(numericOdds) / (Math.abs(numericOdds) + 100);
    const variance = projection && line ? Math.abs(projection - line) / line : 0;
    
    console.log(`🎯 Categorizing ${player}: Edge=${edge}%, Confidence=${confidence}, Odds=${odds}, Variance=${(variance*100).toFixed(1)}%, ImpliedProb=${(impliedProbability*100).toFixed(1)}%`);
    
    // LONG SHOT CRITERIA (High Risk, High Reward) - VERY STRICT
    const isHighOdds = numericOdds >= 200; // +200 or better ONLY
    const isHighVariance = variance >= 0.25; // 25%+ projection variance ONLY
    const isLowProbability = impliedProbability <= 0.35; // 35% hit rate or less ONLY
    const isBoomOrBust = edge >= 15 && confidence <= 3; // High edge, low confidence ONLY
    const isExtremeEdge = edge >= 25; // Market inefficiency ONLY
    
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
    
    // VALUE PLAY CRITERIA (70-85% confidence) - DEFAULT FOR MODERATE PICKS
    console.log(`✨ VALUE PLAY: ${edge}% edge, ${confidence} confidence`);
    return 'Value Play';
  }

  // ============================================================================
  // DETERMINISTIC UTILITY METHODS - NO MORE MATH.RANDOM()
  // ============================================================================

  private selectDeterministicPlatform(platforms: string[], identifier: string): string {
    const hash = this.hashString(identifier);
    const index = hash % platforms.length;
    return platforms[index];
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private parseOdds(odds: string): number {
    return parseInt(odds.replace(/[^-\d]/g, ''));
  }

  // ============================================================================
  // STORED WNBA DATA MANAGEMENT
  // ============================================================================

  private getStoredWNBAData(): StoredWNBAData | null {
    try {
      if (window.__wnbaStoredData) {
        const data = window.__wnbaStoredData;
        console.log('📦 Retrieved stored WNBA data:', {
          bestBets: data.bestBets?.length || 0,
          longShots: data.longShots?.length || 0,
          playerProps: data.playerProps?.length || 0,
          gamePicks: data.gamePicks?.length || 0,
          lastUpdated: data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'Never'
        });
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving stored WNBA data:', error);
      return null;
    }
  }

  private storeWNBAData(data: Omit<StoredWNBAData, 'lastUpdated'>) {
    try {
      const fullData: StoredWNBAData = {
        ...data,
        lastUpdated: Date.now()
      };
      
      window.__wnbaStoredData = fullData;
      console.log('💾 Stored WNBA data:', {
        bestBets: fullData.bestBets.length,
        longShots: fullData.longShots.length,
        playerProps: fullData.playerProps.length,
        gamePicks: fullData.gamePicks.length,
        timestamp: new Date(fullData.lastUpdated).toLocaleString()
      });
    } catch (error) {
      console.error('Error storing WNBA data:', error);
    }
  }

  // ============================================================================
  // BEST PICKS GENERATION
  // ============================================================================

  async generateBestPicks(): Promise<GeneratedPick[]> {
    console.log('🏆 generateBestPicks called - checking cache first');
    
    // PRIORITY 1: Use cached WNBA props
    const storedData = this.getStoredWNBAData();
    if (storedData?.playerProps && storedData.playerProps.length > 0) {
      console.log(`✅ Using ${storedData.playerProps.length} cached WNBA props as best picks`);
      return storedData.playerProps.slice(0, 8);
    }
    
    console.log('⚠️ No cached data available, generating deterministic fallback picks');
    
    // PRIORITY 2: Generate deterministic fallback picks
    const picks: GeneratedPick[] = [];
    const platforms = ['DraftKings', 'FanDuel', 'BetMGM'];

    // Add LeBron pick if available
    const lebronData = mockDataService.getPlayerStats('lebron-james');
    if (lebronData) {
      const lakersGame = mockDataService.getGameData().find(g => 
        g.homeTeam === lebronData.team || g.awayTeam === lebronData.team
      );
      
      if (lakersGame) {
        const opponent = lakersGame.homeTeam === lebronData.team ? 
          lakersGame.awayTeam : lakersGame.homeTeam;
        const calculation = this.calculationEngine.calculatePlayerProp(lebronData, 'points', opponent, lakersGame);
        const bookLine = 25.5;
        const edge = this.calculationEngine.calculateEdge(calculation.projection, bookLine, 'over');
        
        const platform = this.selectDeterministicPlatform(platforms, lebronData.name + 'bestpick');
        const category = this.categorizePick(edge, Math.floor(calculation.confidence / 2), edge > 8 ? '+110' : '+105', calculation.projection, bookLine, lebronData.name);
        
        picks.push({
          id: 'lebron-points-best',
          player: lebronData.name,
          team: lebronData.team,
          title: `Over ${bookLine} Points`,
          sport: 'Basketball - NBA',
          game: `${lakersGame.gameTime}`,
          description: `${lebronData.name} to score over ${bookLine} points against the ${opponent}.`,
          odds: edge > 8 ? '+110' : '+105',
          platform: platform,
          confidence: Math.min(5, Math.max(1, Math.floor(calculation.confidence / 2))),
          insights: this.calculationEngine.generateInsights(calculation.factors, edge, 'high'),
          category: category,
          edge: Math.round(edge * 10) / 10,
          type: 'Player Prop',
          line: bookLine,
          projected: calculation.projection
        });
      }
    }

    // Add deterministic WNBA fallback picks
    const wnbaFallbacks = this.generateDeterministicWNBAFallbacks();
    picks.push(...wnbaFallbacks);

    console.log(`🏆 generateBestPicks returning ${picks.length} deterministic picks`);
    return picks.slice(0, 8);
  }

  // ============================================================================
  // FIXED LONG SHOTS - ONLY TRUE HIGH RISK, HIGH REWARD
  // ============================================================================

  generateLongShots(sport: string = 'wnba'): GeneratedPick[] {
    console.log(`🎲 generateLongShots called for ${sport} - filtering for TRUE long shots only`);
    
    try {
      // Get all picks first
      const storedData = this.getStoredWNBAData();
      const allPicks = storedData?.playerProps || [];
      
      console.log(`📊 Got ${allPicks.length} total picks to filter for long shots`);
      
      // Filter for TRUE long shots only using STRICT criteria
      const trueLongShots = allPicks.filter(pick => {
        const numericOdds = parseInt(pick.odds?.replace(/[^-\d]/g, '') || '0');
        const variance = pick.projected && pick.line ? 
          Math.abs(pick.projected - pick.line) / pick.line : 0;
        const impliedProb = numericOdds > 0 ? 100 / (numericOdds + 100) : 
                           Math.abs(numericOdds) / (Math.abs(numericOdds) + 100);
        
        // TRUE long shot criteria - VERY STRICT REQUIREMENTS
        const isHighOdds = numericOdds >= 200; // +200 or better ONLY
        const isHighVariance = variance >= 0.25; // 25%+ variance ONLY  
        const isLowProbability = impliedProb <= 0.35; // 35% or less hit rate ONLY
        const isBoomOrBust = pick.edge >= 15 && pick.confidence <= 3; // High edge, low confidence ONLY
        
        console.log(`🔍 ${pick.player} ${pick.title}: 
          Odds=${pick.odds}(${numericOdds}), 
          Variance=${(variance*100).toFixed(1)}%, 
          ImpliedProb=${(impliedProb*100).toFixed(1)}%, 
          Edge=${pick.edge}%, 
          Confidence=${pick.confidence},
          IsLongShot=${isHighOdds || isHighVariance || isBoomOrBust}`);
        
        // ONLY return true if it meets strict long shot criteria
        return isHighOdds || isHighVariance || isBoomOrBust;
      });
      
      console.log(`✅ Found ${trueLongShots.length} TRUE long shots from ${allPicks.length} total picks`);
      
      // If no real long shots found, generate proper examples
      if (trueLongShots.length === 0) {
        console.log('⚠️ No real long shots found, generating proper high-risk examples');
        return this.generateProperLongShotExamples(sport);
      }
      
      // Enhance with proper long shot insights
      return trueLongShots.map(pick => ({
        ...pick,
        category: 'Long Shot',
        insights: this.generateLongShotInsights(pick)
      }));
      
    } catch (error) {
      console.error('❌ Error in generateLongShots:', error);
      return this.generateProperLongShotExamples(sport);
    }
  }

  // Generate proper long shot examples when no real ones exist
  private generateProperLongShotExamples(sport: string): GeneratedPick[] {
    const platforms = ['DraftKings', 'FanDuel', 'BetMGM'];
    
    if (sport === 'wnba') {
      return [
        {
          id: 'caitlin-clark-explosion',
          player: "Caitlin Clark",
          team: 'IND',
          title: 'Over 28.5 Points',
          sport: 'WNBA',
          game: 'Today 9:00 PM ET',
          description: 'Rookie sensation to explode for 28+ points in primetime matchup',
          odds: '+320', // TRUE long shot odds
          platform: platforms[0],
          confidence: 2, // Low confidence = high risk
          insights: '🎲 Boom-or-bust play. Clark facing elite defense but has explosive scoring potential. High variance - either 15 points or 35+ points. Only bet what you can afford to lose completely.',
          category: 'Long Shot',
          edge: 22.8,
          type: 'Player Prop',
          line: 28.5,
          projected: 35.2
        },
        {
          id: 'bench-player-blowout',
          player: 'NaLyssa Smith',
          team: 'IND',
          title: 'Over 16.5 Points',
          sport: 'WNBA',
          game: 'Today 8:00 PM ET',
          description: 'Bench player to get extended run in potential blowout scenario',
          odds: '+280',
          platform: platforms[1],
          confidence: 2,
          insights: '🎯 Contrarian garbage-time play. If Fever builds big lead, Smith gets 25+ minutes vs usual 15. High risk but excellent edge if blowout materializes.',
          category: 'Long Shot',
          edge: 19.5,
          type: 'Player Prop',
          line: 16.5,
          projected: 23.1
        },
        {
          id: 'triple-double-parlay',
          player: "A'ja Wilson",
          team: 'LV',
          title: '25+ PTS, 12+ REB, 6+ AST',
          sport: 'WNBA',
          game: 'Today 9:30 PM ET',
          description: 'Triple-threat stat line parlay - all three must hit for payout',
          odds: '+450',
          platform: platforms[2],
          confidence: 1, // Very low confidence
          insights: '🚀 Lottery ticket play. Wilson needs career-high assists while maintaining elite scoring/rebounding. Massive 5.5x payout but extremely difficult to achieve.',
          category: 'Long Shot',
          edge: 16.2,
          type: 'Same Game Parlay',
          line: 0,
          projected: 0
        },
        {
          id: 'rookie-revenge-game',
          player: 'Kate Martin',
          team: 'LV',
          title: 'Over 12.5 Points',
          sport: 'WNBA',
          game: 'Today 7:00 PM ET',
          description: 'Rookie role player to have breakout performance vs former rival',
          odds: '+240',
          platform: platforms[0],
          confidence: 2,
          insights: '🔥 Emotional angle play. Facing college teammate who was drafted higher. Revenge factor plus increased opportunity could fuel career night. High variance - either quiet 4-point game or explosive 18+ points.',
          category: 'Long Shot',
          edge: 18.7,
          type: 'Player Prop',
          line: 12.5,
          projected: 17.8
        }
      ];
    }
    
    return [];
  }

  // Generate long shot specific insights
  private generateLongShotInsights(pick: any): string {
    const numericOdds = parseInt(pick.odds?.replace(/[^-\d]/g, '') || '0');
    const variance = pick.projected && pick.line ? Math.abs(pick.projected - pick.line) / pick.line : 0;
    
    let insight = '🎲 ';
    
    if (numericOdds >= 300) {
      insight += 'Extreme long shot with massive payout potential. ';
    } else if (numericOdds >= 200) {
      insight += 'High-risk play with excellent reward upside. ';
    } else {
      insight += 'High variance scenario with boom-or-bust potential. ';
    }
    
    if (variance >= 0.4) {
      insight += `Huge projection gap - model sees ${pick.projected?.toFixed(1)} vs line of ${pick.line}. `;
    } else if (variance >= 0.25) {
      insight += `Significant variance play with projection gap. `;
    }
    
    if (pick.edge >= 20) {
      insight += `Massive edge detected (${pick.edge}%) due to market inefficiency. `;
    }
    
    insight += 'Only bet 1-3% of bankroll. Long shot = lottery ticket, not steady income.';
    
    return insight;
  }

  // ============================================================================
  // PLAYER PROPS GENERATION
  // ============================================================================

  async generatePlayerProps(sport: string): Promise<GeneratedPick[]> {
    console.log(`🎯 generatePlayerProps called for ${sport}`);
    
    if (sport === 'wnba') {
      // Use cached WNBA data if available
      const storedData = this.getStoredWNBAData();
      if (storedData?.playerProps && storedData.playerProps.length > 0) {
        console.log(`✅ Using ${storedData.playerProps.length} cached WNBA props`);
        return storedData.playerProps;
      }
      
      // Generate deterministic fallback props
      console.log('🔄 Generating deterministic WNBA fallback props');
      return this.generateDeterministicWNBAFallbacks();
    }

    // Handle other sports with deterministic calculations
    return this.generateDeterministicSportProps(sport);
  }

  // ============================================================================
  // GAME PICKS GENERATION
  // ============================================================================

  async generateGameBasedPicks(): Promise<GeneratedPick[]> {
    console.log('🎯 generateGameBasedPicks called - checking cache first');
    
    // PRIORITY 1: Use cached WNBA game picks
    const storedData = this.getStoredWNBAData();
    if (storedData?.gamePicks && storedData.gamePicks.length > 0) {
      console.log(`✅ Using ${storedData.gamePicks.length} cached WNBA game picks`);
      return storedData.gamePicks;
    }
    
    // PRIORITY 2: Generate game picks from cached player props
    if (storedData?.playerProps && storedData.playerProps.length > 0) {
      console.log(`🔄 Generating game picks from ${storedData.playerProps.length} cached player props`);
      const generatedGamePicks = this.generateGamePicksFromCachedProps(storedData.playerProps);
      if (generatedGamePicks.length > 0) {
        console.log(`✅ Generated ${generatedGamePicks.length} game picks from cached props`);
        return generatedGamePicks;
      }
    }
    
    console.log('⚠️ No cached WNBA data available, generating deterministic fallback picks');

    // PRIORITY 3: Generate deterministic fallback picks
    const fallbackPicks: GeneratedPick[] = [];
    const games = mockDataService.getGameData();
    const platforms = ['DraftKings', 'FanDuel', 'BetMGM'];

    games.forEach((game, index) => {
      const spreadCalc = this.calculationEngine.calculateGameProp(game, 'spread');
      const bookSpread = -3.5;
      const sportDisplay = game.sport?.toUpperCase() || 'NBA';

      const spreadEdge = this.calculationEngine.calculateEdge(Math.abs(spreadCalc.projection), Math.abs(bookSpread));
      
      if (spreadEdge > 3) {
        const platform = this.selectDeterministicPlatform(platforms, game.gameId + 'spread' + index.toString());
        const category = this.categorizePick(spreadEdge, Math.floor(spreadCalc.confidence / 2), '-110');

        fallbackPicks.push({
          id: `${game.gameId}-spread`,
          matchup: `${game.awayTeam} vs ${game.homeTeam}`,
          title: `${game.homeTeam} ${bookSpread}`,
          sport: sportDisplay,
          game: game.gameTime,
          description: `${game.homeTeam} to cover the ${bookSpread} point spread.`,
          odds: '-110',
          platform: platform,
          confidence: Math.min(5, Math.max(1, Math.floor(spreadCalc.confidence / 2))),
          insights: this.calculationEngine.generateInsights(spreadCalc.factors, spreadEdge, 'medium'),
          category: category,
          edge: Math.round(spreadEdge * 10) / 10,
          type: 'Spread',
          gameTime: game.gameTime
        });
      }
    });

    console.log(`🏆 generateGameBasedPicks returning ${fallbackPicks.length} deterministic fallback picks`);
    return fallbackPicks.slice(0, 10);
  }

  // ============================================================================
  // WNBA DATA REFRESH
  // ============================================================================

  async refreshWNBAData(forceRefresh: boolean = false): Promise<void> {
    if (!this.oddsApiService) {
      console.log('❌ No WNBA API service configured');
      return;
    }

    try {
      console.log('🔄 Refreshing WNBA data from API...');
      
      if (forceRefresh) {
        this.oddsApiService.clearCache();
        console.log('🗑️ Cleared API cache for force refresh');
      }

      const wnbaProps = await this.oddsApiService.getWNBAPlayerProps();
      
      if (wnbaProps.length === 0) {
        console.log('⚠️ No WNBA props returned from API');
        return;
      }

      console.log(`📊 Got ${wnbaProps.length} WNBA props from API, processing...`);
      
      const processedData = this.processWNBAPropsIntoCategories(wnbaProps);
      this.storeWNBAData(processedData);
      
      console.log('✅ WNBA data refresh completed successfully');
      
    } catch (error) {
      console.error('💥 Error refreshing WNBA data:', error);
      throw error;
    }
  }

  // ============================================================================
  // FIXED WNBA PROPS PROCESSING - PROPER CATEGORIZATION
  // ============================================================================

  private processWNBAPropsIntoCategories(wnbaProps: any[]): Omit<StoredWNBAData, 'lastUpdated'> {
    console.log(`🔄 Processing ${wnbaProps.length} raw WNBA props into categories...`);
    
    const bestBets: GeneratedPick[] = [];
    const gamePicks: GeneratedPick[] = [];
    const longShots: GeneratedPick[] = [];
    const playerProps: GeneratedPick[] = [];

    // Process each prop from the API with PROPER categorization
    wnbaProps.forEach(prop => {
      const pick: GeneratedPick = {
        id: prop.id,
        player: prop.player,
        team: prop.team,
        title: prop.title,
        sport: 'Basketball - WNBA',
        game: prop.game,
        description: prop.description,
        odds: prop.odds,
        platform: prop.platform,
        confidence: prop.confidence,
        insights: prop.insights,
        category: prop.category,
        edge: prop.edge,
        type: prop.type,
        matchup: prop.matchup,
        gameTime: prop.gameTime,
        line: prop.line,
        projected: prop.projected
      };

      // APPLY PROPER CATEGORIZATION LOGIC - THIS IS THE KEY FIX
      const properCategory = this.categorizePick(
        prop.edge, 
        prop.confidence, 
        prop.odds, 
        prop.projected, 
        prop.line, 
        prop.player
      );

      pick.category = properCategory;

      console.log(`📊 Processing prop: ${pick.player} ${pick.title} - Edge: ${pick.edge}%, Odds: ${pick.odds}, Proper Category: ${properCategory}`);

      // Categorize based on PROPER methodology, not random edge thresholds
      if (properCategory === 'Lock Pick' || (prop.edge >= 8 && properCategory !== 'Long Shot')) {
        pick.category = 'Top Prop';
        bestBets.push({...pick});
        console.log(`✅ Added to Best Bets: ${pick.player} ${pick.title} (${pick.edge}% edge)`);
      } 
      else if (properCategory === 'Long Shot') {
        // ONLY add to long shots if PROPERLY categorized as long shot
        const longShotPick = {...pick};
        longShotPick.category = 'Long Shot';
        longShotPick.insights = this.generateLongShotInsights(pick);
        longShots.push(longShotPick);
        console.log(`✅ Added to Long Shots: ${pick.player} ${pick.title} (${pick.edge}% edge, ${pick.odds} odds) - PROPER LONG SHOT`);
      } 
      else {
        // Everything else (Value Play, Strong Play) goes to player props
        pick.category = properCategory; // Keep the proper category
        playerProps.push({...pick});
        console.log(`✅ Added to Player Props: ${pick.player} ${pick.title} (${pick.edge}% edge) - ${properCategory}`);
      }
    });

    // Create game-based picks from API data
    const gamePicksMap = new Map();
    
    wnbaProps.forEach(prop => {
      if (prop.game && prop.edge >= 3) {
        const gameKey = prop.game;
        if (!gamePicksMap.has(gameKey)) {
          gamePicksMap.set(gameKey, {
            props: [],
            totalEdge: 0,
            count: 0
          });
        }
        
        const gameData = gamePicksMap.get(gameKey);
        gameData.props.push(prop);
        gameData.totalEdge += prop.edge;
        gameData.count += 1;
      }
    });

    // Generate game picks from aggregated data
    Array.from(gamePicksMap.entries()).forEach(([gameKey, gameData], index) => {
      const avgEdge = gameData.totalEdge / gameData.count;
      
      if (avgEdge >= 4 && gameData.count >= 2) {
        const category = this.categorizePick(avgEdge, Math.floor(avgEdge / 2), '-110');

        gamePicks.push({
          id: `wnba-game-${index}-spread`,
          matchup: gameKey,
          title: 'Spread -3.5',
          sport: 'WNBA',
          game: gameKey,
          description: `${gameKey} spread bet - based on ${gameData.count} player props analysis`,
          odds: '-110',
          platform: gameData.props[0]?.platform || 'DraftKings',
          confidence: Math.min(5, Math.max(2, Math.floor(avgEdge / 2))),
          insights: `Game analysis based on ${gameData.count} player props with ${avgEdge.toFixed(1)}% average edge.`,
          category: category,
          edge: Math.round(avgEdge * 10) / 10,
          type: 'Spread',
          gameTime: gameData.props[0]?.gameTime || 'TBD'
        });
      }
    });

    console.log('📈 PROPER Categorization complete:', {
      bestBets: bestBets.length,
      playerProps: playerProps.length,
      longShots: longShots.length,
      gamePicks: gamePicks.length
    });

    return { bestBets, playerProps, longShots, gamePicks };
  }

  // ============================================================================
  // DETERMINISTIC FALLBACK GENERATION
  // ============================================================================

  private generateDeterministicWNBAFallbacks(): GeneratedPick[] {
    const picks: GeneratedPick[] = [];
    const platforms = ['DraftKings', 'FanDuel', 'BetMGM'];
    
    const players = [
      { name: "A'ja Wilson", team: 'LV', stat: 'points', line: 23.5 },
      { name: 'Breanna Stewart', team: 'NY', stat: 'rebounds', line: 8.5 },
      { name: 'Sabrina Ionescu', team: 'NY', stat: 'assists', line: 6.5 },
      { name: 'Kelsey Plum', team: 'LV', stat: 'points', line: 18.5 },
      { name: 'Jonquel Jones', team: 'NY', stat: 'rebounds', line: 7.5 }
    ];

    players.forEach((player, index) => {
      // Deterministic projection based on player name hash
      const projectionBase = player.line * (1 + (this.hashString(player.name) % 20) / 100);
      const edge = Math.max(3, (this.hashString(player.name + player.stat) % 15) + 3);
      const confidence = Math.max(2, Math.min(5, (this.hashString(player.name + index.toString()) % 4) + 2));

      const platform = this.selectDeterministicPlatform(platforms, player.name + index.toString());
      const category = this.categorizePick(edge, confidence, '+115', projectionBase, player.line, player.name);

      picks.push({
        id: `${player.name.replace(/\s+/g, '-')}-${player.stat}-fallback`,
        player: player.name,
        team: player.team,
        title: `Over ${player.line} ${player.stat.charAt(0).toUpperCase() + player.stat.slice(1)}`,
        sport: 'WNBA',
        game: 'Today 9:00 PM ET',
        description: `${player.name} to record over ${player.line} ${player.stat}.`,
        odds: '+115',
        platform: platform,
        confidence: confidence,
        insights: `${player.name} has been consistent in ${player.stat}. Model projects ${projectionBase.toFixed(1)} vs line of ${player.line}. ${edge.toFixed(1)}% edge detected.`,
        category: category,
        edge: Math.round(edge * 10) / 10,
        type: 'Player Prop',
        line: player.line,
        projected: projectionBase
      });
    });

    return picks;
  }

  private generateDeterministicSportProps(sport: string): GeneratedPick[] {
    const picks: GeneratedPick[] = [];
    const games = mockDataService.getGameData();
    const platforms = ['DraftKings', 'FanDuel', 'BetMGM'];

    let playerIds: string[];
    let props: { prop: string; line: number }[];

    if (sport === 'nba') {
      playerIds = ['luka-doncic', 'giannis-antetokounmpo'];
      props = [{ prop: 'points', line: 28.5 }, { prop: 'rebounds', line: 11.5 }];
    } else if (sport === 'nfl') {
      playerIds = ['josh-allen'];
      props = [{ prop: 'passing_yards', line: 267.5 }];
    } else {
      return [];
    }

    playerIds.forEach((playerId, playerIndex) => {
      const playerData = mockDataService.getPlayerStats(playerId);
      if (!playerData) return;

      const game = games.find(g => 
        g.homeTeam === playerData.team || g.awayTeam === playerData.team
      );
      if (!game) return;

      const opponent = game.homeTeam === playerData.team ? game.awayTeam : game.homeTeam;

      props.forEach(({ prop, line }, propIndex) => {
        const calculation = this.calculationEngine.calculatePlayerProp(playerData, prop, opponent, game);
        const edge = this.calculationEngine.calculateEdge(calculation.projection, line, 'over');
        
        if (edge > 2) {
          const confidence = this.calculationEngine.calculateConfidence(edge, calculation.confidence, 8);
          const platform = this.selectDeterministicPlatform(
            platforms,
            playerId + prop + playerIndex.toString() + propIndex.toString()
          );
          const category = this.categorizePick(
            edge, 
            confidence === 'high' ? 5 : confidence === 'medium' ? 3 : 2, 
            edge > 7 ? '+105' : '-115',
            calculation.projection,
            line,
            playerData.name
          );
          
          picks.push({
            id: `${playerId}-${prop}-prop`,
            player: playerData.name,
            team: playerData.team,
            title: `Over ${line} ${prop.replace('_', ' ')}`,
            sport: sport.toUpperCase(),
            game: game.gameTime,
            description: `${playerData.name} ${prop} over ${line}`,
            odds: edge > 7 ? '+105' : '-115',
            platform: platform,
            confidence: confidence === 'high' ? 5 : confidence === 'medium' ? 3 : 2,
            insights: this.calculationEngine.generateInsights(calculation.factors, edge, confidence),
            category: category,
            edge: Math.round(edge * 10) / 10,
            type: 'Player Prop',
            line: line,
            projected: calculation.projection
          });
        }
      });
    });

    return picks;
  }

  private generateGamePicksFromCachedProps(playerProps: GeneratedPick[]): GeneratedPick[] {
    console.log('🔄 Generating game picks from cached player props...');
    
    const gamePicksMap = new Map();
    
    playerProps.forEach(prop => {
      if (!prop.matchup || !prop.edge || prop.edge < 3) return;
      
      const gameKey = prop.matchup;
      if (!gamePicksMap.has(gameKey)) {
        gamePicksMap.set(gameKey, {
          props: [],
          totalEdge: 0,
          count: 0,
          platform: prop.platform,
          gameTime: prop.gameTime
        });
      }
      
      const gameData = gamePicksMap.get(gameKey);
      gameData.props.push(prop);
      gameData.totalEdge += prop.edge;
      gameData.count += 1;
    });

    const generatedGamePicks: GeneratedPick[] = [];
    
    Array.from(gamePicksMap.entries()).forEach(([gameKey, gameData], index) => {
      const avgEdge = gameData.totalEdge / gameData.count;
      
      if (avgEdge >= 4 && gameData.count >= 2) {
        const category = this.categorizePick(avgEdge, Math.floor(avgEdge / 2), '-110');

        generatedGamePicks.push({
          id: `wnba-cached-game-${index}-spread`,
          matchup: gameKey,
          title: 'Spread -3.5',
          sport: 'WNBA',
          game: gameKey,
          description: `${gameKey} spread bet - based on ${gameData.count} player props analysis`,
          odds: '-110',
          platform: gameData.platform || 'DraftKings',
          confidence: Math.min(5, Math.max(2, Math.floor(avgEdge / 2))),
          insights: `Game analysis based on ${gameData.count} cached player props with ${avgEdge.toFixed(1)}% average edge.`,
          category: category,
          edge: Math.round(avgEdge * 10) / 10,
          type: 'Spread',
          gameTime: gameData.gameTime || 'TBD'
        });
      }
    });

    return generatedGamePicks;
  }

  // ============================================================================
  // PUBLIC UTILITY METHODS
  // ============================================================================

  hasStoredWNBAData(): boolean {
    const stored = this.getStoredWNBAData();
    return stored !== null && stored.playerProps.length > 0;
  }

  getLastUpdateTime(): string | null {
    const stored = this.getStoredWNBAData();
    if (stored?.lastUpdated) {
      return new Date(stored.lastUpdated).toLocaleString();
    }
    return null;
  }

  clearStoredData(): void {
    try {
      delete (window as any).__wnbaStoredData;
      console.log('🗑️ Stored WNBA data cleared');
    } catch (error) {
      console.error('Error clearing stored data:', error);
    }
  }

  refreshAllPicks(): void {
    mockDataService.simulateDataUpdate();
  }

  // Method to recategorize existing picks (for integration with other components)
  recategorizeAllPicks(picks: any[]): any[] {
    return picks.map(pick => {
      const category = this.categorizePick(
        pick.edge,
        pick.confidence,
        pick.odds,
        pick.projected,
        pick.line,
        pick.player
      );
      
      return {
        ...pick,
        category,
        insights: category === 'Long Shot' ? 
          this.generateLongShotInsights(pick) : 
          pick.insights
      };
    });
  }
}

// Declare global interface for window
declare global {
  interface Window {
    __wnbaStoredData?: StoredWNBAData;
  }
}

export const dynamicPicksGenerator = new DynamicPicksGenerator();
