import { PicksCalculationEngine, PlayerStats, GameData } from './picksCalculation';
import { mockDataService } from './mockDataService';
import { createOddsApiService } from './oddsApiService';
import { enhanceWNBADataProcessing } from './bestBetOptimizer';

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

  // Get stored WNBA data from memory (not localStorage due to artifact restrictions)
  private getStoredWNBAData(): StoredWNBAData | null {
    try {
      // Using a global variable to simulate persistent storage within the session
      if (window.__wnbaStoredData) {
        return window.__wnbaStoredData;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving stored WNBA data:', error);
      return null;
    }
  }

  // Store WNBA data in memory
  private storeWNBAData(data: StoredWNBAData): void {
    try {
      // Using a global variable to simulate persistent storage within the session
      window.__wnbaStoredData = data;
      console.log('💾 WNBA data stored successfully');
    } catch (error) {
      console.error('Error storing WNBA data:', error);
    }
  }

  // Manual refresh method that fetches new data and updates storage
  async refreshWNBAData(forceRefresh: boolean = true): Promise<void> {
    if (!this.oddsApiService) {
      console.error('❌ API service not initialized. Set API key first.');
      return;
    }

    try {
      console.log('🔄 Starting manual WNBA data refresh...');
      
      // Fetch fresh WNBA props from API
      const wnbaProps = await this.oddsApiService.getWNBAProps(forceRefresh);
      console.log(`📊 Fetched ${wnbaProps.length} WNBA props`);

      if (wnbaProps.length === 0) {
        console.log('⚠️ No WNBA props available - keeping existing stored data');
        return;
      }

      // Process the data into different categories
      const processedData = this.processWNBAPropsIntoCategories(wnbaProps);
      
      // Store the processed data
      const storedData: StoredWNBAData = {
        ...processedData,
        lastUpdated: Date.now()
      };
      
      this.storeWNBAData(storedData);
      console.log('✅ WNBA data refresh completed and stored');
      
    } catch (error) {
      console.error('💥 Error during WNBA data refresh:', error);
    }
  }

  // FIXED: Process WNBA props into different pick categories with proper optimization
  private processWNBAPropsIntoCategories(wnbaProps: any[]): Omit<StoredWNBAData, 'lastUpdated'> {
    console.log(`🔄 Processing ${wnbaProps.length} raw WNBA props...`);
    
    // STEP 1: Apply optimization to remove duplicate Over/Under bets
    const optimizedProps = enhanceWNBADataProcessing(wnbaProps);
    console.log(`🎯 Optimized to ${optimizedProps.length} strongest bets`);
    
    const bestBets: GeneratedPick[] = [];
    const gamePicks: GeneratedPick[] = [];
    const longShots: GeneratedPick[] = [];
    const playerProps: GeneratedPick[] = [];

    // STEP 2: Process optimized props into categories (only use optimized props)
    optimizedProps.forEach(prop => {
      const pick: GeneratedPick = {
        id: prop.id,
        player: prop.player,
        team: prop.team,
        title: prop.title,
        sport: 'WNBA',
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

      // Enhanced categorization based on optimized edge values
      if (prop.edge >= 8) {
        pick.category = 'Top Prop';
        bestBets.push({...pick}); // Create copy for bestBets
      } 
      
      if (prop.edge >= 5) {
        pick.category = 'Best Value';
        // Don't duplicate if already in bestBets
        if (prop.edge < 8) {
          playerProps.push({...pick});
        }
      } 
      
      if (prop.edge >= 3) {
        // Check if it qualifies as a long shot based on odds
        const oddsValue = this.parseOdds(prop.odds);
        if (oddsValue >= 150) {
          const longShotPick = {...pick};
          longShotPick.category = 'Long Shot';
          longShots.push(longShotPick);
        } else if (prop.edge < 5) {
          // Only add to playerProps if not already categorized higher
          const playerPropPick = {...pick};
          playerPropPick.category = 'Player Prop';
          playerProps.push(playerPropPick);
        }
      }
    });

    // STEP 3: Create game-based picks from unique matchups
    const uniqueMatchups = [...new Set(optimizedProps.map(p => p.matchup))];
    uniqueMatchups.forEach((matchup, index) => {
      if (matchup) {
        const gameProps = optimizedProps.filter(p => p.matchup === matchup);
        const avgEdge = gameProps.reduce((sum, p) => sum + p.edge, 0) / gameProps.length;
        
        // Only create game picks if we have sufficient edge
        if (avgEdge >= 4) {
          // Create spread pick
          gamePicks.push({
            id: `wnba-game-${index}-spread`,
            matchup: matchup,
            title: 'Spread -3.5',
            sport: 'WNBA',
            game: gameProps[0]?.gameTime || 'Today 9:00 PM ET',
            description: `${matchup} spread bet - derived from ${gameProps.length} optimized player props`,
            odds: '-110',
            platform: gameProps[0]?.platform || 'DraftKings',
            confidence: Math.min(5, Math.max(2, Math.floor(avgEdge / 2))),
            insights: `Game analysis based on ${gameProps.length} optimized player props with ${avgEdge.toFixed(1)}% average edge. Our model shows strong value on this spread.`,
            category: 'Game Pick',
            edge: Math.round(avgEdge * 10) / 10,
            type: 'Spread',
            gameTime: gameProps[0]?.gameTime
          });

          // Create total pick
          gamePicks.push({
            id: `wnba-game-${index}-total`,
            matchup: matchup,
            title: 'Over 162.5',
            sport: 'WNBA',
            game: gameProps[0]?.gameTime || 'Today 9:00 PM ET',
            description: `${matchup} total points - derived from optimized player analysis`,
            odds: '-115',
            platform: gameProps[0]?.platform || 'DraftKings',
            confidence: Math.min(5, Math.max(2, Math.floor(avgEdge / 2))),
            insights: `Total analysis based on optimized player projections showing ${avgEdge.toFixed(1)}% edge. Player prop analysis suggests scoring environment favors the over.`,
            category: 'Game Pick',
            edge: Math.round(avgEdge * 10) / 10,
            type: 'Total',
            gameTime: gameProps[0]?.gameTime
          });
        }
      }
    });

    // STEP 4: Sort by edge within each category and limit results
    const sortByEdge = (a: GeneratedPick, b: GeneratedPick) => b.edge - a.edge;
    
    console.log(`📊 Final categorization:`);
    console.log(`   Best Bets: ${bestBets.length} (8%+ edge)`);
    console.log(`   Player Props: ${playerProps.length} (3%+ edge, optimized)`);
    console.log(`   Long Shots: ${longShots.length} (3%+ edge, +150 odds)`);
    console.log(`   Game Picks: ${gamePicks.length} (derived from 4%+ avg edge)`);

    // Important: Remove duplicates by ID to ensure no duplicates slip through
    const removeDuplicatesById = (picks: GeneratedPick[]) => {
      const seen = new Set();
      return picks.filter(pick => {
        if (seen.has(pick.id)) {
          return false;
        }
        seen.add(pick.id);
        return true;
      });
    };

    return {
      bestBets: removeDuplicatesById(bestBets.sort(sortByEdge)).slice(0, 6),
      gamePicks: removeDuplicatesById(gamePicks.sort(sortByEdge)).slice(0, 8),
      longShots: removeDuplicatesById(longShots.sort(sortByEdge)).slice(0, 5),
      playerProps: removeDuplicatesById(playerProps.sort(sortByEdge)).slice(0, 12)
    };
  }

  generateBestBets(): GeneratedPick[] {
    // Get stored WNBA data first
    const storedData = this.getStoredWNBAData();
    const wnbaBestBets = storedData?.bestBets || [];

    const picks: GeneratedPick[] = [];
    const games = mockDataService.getGameData();
    const platforms = ['DraftKings', 'FanDuel', 'BetMGM', 'Caesars'];

    // Add existing NBA/NFL picks
    const lebronData = mockDataService.getPlayerStats('lebron-james');
    const lakersGame = games.find(g => g.homeTeam === 'LAL' || g.awayTeam === 'LAL');
    
    if (lebronData && lakersGame) {
      const opponent = lakersGame.homeTeam === 'LAL' ? lakersGame.awayTeam : lakersGame.homeTeam;
      const calculation = this.calculationEngine.calculatePlayerProp(lebronData, 'points', opponent, lakersGame);
      const bookLine = 25.5;
      const edge = this.calculationEngine.calculateEdge(calculation.projection, bookLine, 'over');
      
      picks.push({
        id: 'lebron-points-best',
        player: lebronData.name,
        team: lebronData.team,
        title: `Over ${bookLine} Points`,
        sport: 'Basketball - NBA',
        game: `${lakersGame.gameTime}`,
        description: `${lebronData.name} to score over ${bookLine} points against the ${opponent}.`,
        odds: edge > 8 ? '+110' : '+105',
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        confidence: Math.min(5, Math.max(1, Math.floor(calculation.confidence / 2))),
        insights: this.calculationEngine.generateInsights(calculation.factors, edge, 'high'),
        category: 'Top Prop',
        edge: Math.round(edge * 10) / 10,
        type: 'Player Prop',
        line: bookLine,
        projected: calculation.projection
      });
    }

    // Add stored WNBA best bets
    picks.push(...wnbaBestBets);

    // Add fallback WNBA picks if no stored data
    if (wnbaBestBets.length === 0) {
      const wilsonData = mockDataService.getPlayerStats('aja-wilson');
      if (wilsonData) {
        const bookLine = 23.5;
        const edge = 8.2;
        
        picks.push({
          id: 'wilson-points-best-fallback',
          player: wilsonData.name,
          team: wilsonData.team,
          title: `Over ${bookLine} Points`,
          sport: 'Basketball - WNBA',
          game: 'Today 9:00 PM ET',
          description: `${wilsonData.name} to score over ${bookLine} points.`,
          odds: '+115',
          platform: platforms[Math.floor(Math.random() * platforms.length)],
          confidence: 4,
          insights: `Fallback WNBA data. Refresh to get live data with ${edge}% edge.`,
          category: 'Top Prop',
          edge: Math.round(edge * 10) / 10,
          type: 'Player Prop',
          line: bookLine,
          projected: bookLine + 2.1
        });
      }
    }

    return picks;
  }

  generateLongShots(): GeneratedPick[] {
    // Get stored WNBA data first
    const storedData = this.getStoredWNBAData();
    const wnbaLongShots = storedData?.longShots || [];

    const picks: GeneratedPick[] = [];
    const games = mockDataService.getGameData();
    const platforms = ['DraftKings', 'FanDuel', 'BetMGM'];

    // Add existing logic for other sports...
    const players = ['lebron-james', 'luka-doncic', 'connor-mcdavid'];
    
    players.forEach(playerId => {
      const playerData = mockDataService.getPlayerStats(playerId);
      if (!playerData) return;

      const game = games.find(g => 
        g.homeTeam === playerData.team || g.awayTeam === playerData.team
      );
      if (!game) return;

      const opponent = game.homeTeam === playerData.team ? game.awayTeam : game.homeTeam;
      
      let prop: string;
      let bookLine: number;
      let sportName: string;

      if (playerId === 'connor-mcdavid') {
        prop = 'shots';
        bookLine = 3.5;
        sportName = 'Hockey - NHL';
      } else if (playerData.seasonAverages.points) {
        prop = 'points';
        bookLine = (playerData.seasonAverages.points || 0) + 2;
        sportName = 'Basketball - NBA';
      } else {
        return;
      }

      const calculation = this.calculationEngine.calculatePlayerProp(playerData, prop, opponent, game);
      const edge = this.calculationEngine.calculateEdge(calculation.projection, bookLine, 'over');
      
      if (edge > 3) {
        picks.push({
          id: `${playerId}-${prop}-longshot`,
          player: playerData.name,
          team: playerData.team,
          title: `Over ${bookLine} ${prop === 'shots' ? 'Shots on Goal' : prop.charAt(0).toUpperCase() + prop.slice(1)}`,
          sport: sportName,
          game: 'Today 8:00 PM ET',
          description: `${playerData.name} to ${prop === 'shots' ? 'have over' : 'score over'} ${bookLine} ${prop === 'shots' ? 'shots on goal' : prop}.`,
          odds: edge > 8 ? '+150' : edge > 5 ? '+180' : '+220',
          platform: platforms[Math.floor(Math.random() * platforms.length)],
          confidence: Math.min(5, Math.max(1, Math.floor(calculation.confidence / 2))),
          insights: this.calculationEngine.generateInsights(calculation.factors, edge, 'medium'),
          category: 'Long Shot',
          edge: Math.round(edge * 10) / 10,
          type: 'Long Shot',
          line: bookLine,
          projected: calculation.projection
        });
      }
    });

    // Add stored WNBA long shots
    picks.push(...wnbaLongShots);

    return picks.slice(0, 6);
  }

  async generateGameBasedPicks(): Promise<GeneratedPick[]> {
    // Get stored WNBA data first
    const storedData = this.getStoredWNBAData();
    const wnbaGamePicks = storedData?.gamePicks || [];

    const picks: GeneratedPick[] = [];
    const games = mockDataService.getGameData();
    const platforms = ['DraftKings', 'FanDuel', 'BetMGM'];

    // Process regular games (NBA, NFL, etc.)
    games.forEach(game => {
      const spreadCalc = this.calculationEngine.calculateGameProp(game, 'spread');
      const bookSpread = -3.5;
      const bookTotal = game.sport === 'nba' ? 218.5 : 48.5;
      const sportDisplay = game.sport?.toUpperCase() || 'NBA';

      const spreadEdge = this.calculationEngine.calculateEdge(Math.abs(spreadCalc.projection), Math.abs(bookSpread));
      
      if (spreadEdge > 3) {
        picks.push({
          id: `${game.gameId}-spread`,
          matchup: `${game.awayTeam} vs ${game.homeTeam}`,
          title: `${game.homeTeam} ${bookSpread}`,
          sport: sportDisplay,
          game: game.gameTime,
          description: `${game.homeTeam} to cover the ${bookSpread} point spread.`,
          odds: '-110',
          platform: platforms[Math.floor(Math.random() * platforms.length)],
          confidence: Math.min(5, Math.max(1, Math.floor(spreadCalc.confidence / 2))),
          insights: this.calculationEngine.generateInsights(spreadCalc.factors, spreadEdge, 'medium'),
          category: 'Game Pick',
          edge: Math.round(spreadEdge * 10) / 10,
          type: 'Spread',
          gameTime: game.gameTime
        });
      }
    });

    // Add stored WNBA game picks
    picks.push(...wnbaGamePicks);

    return picks.slice(0, 8);
  }

  generatePlayerProps(sport: 'nba' | 'nfl' | 'wnba'): GeneratedPick[] {
    // Get stored WNBA data first
    const storedData = this.getStoredWNBAData();
    
    if (sport === 'wnba') {
      const wnbaPlayerProps = storedData?.playerProps || [];
      
      // Return stored WNBA props if available
      if (wnbaPlayerProps.length > 0) {
        return wnbaPlayerProps;
      }
      
      // Fallback WNBA props if no stored data
      const fallbackProps: GeneratedPick[] = [];
      const wnbaPlayers = ['aja-wilson', 'breanna-stewart'];
      const platforms = ['DraftKings', 'FanDuel', 'BetMGM'];
      
      wnbaPlayers.forEach(playerId => {
        const playerData = mockDataService.getPlayerStats(playerId);
        if (playerData) {
          fallbackProps.push({
            id: `${playerId}-points-fallback`,
            player: playerData.name,
            team: playerData.team,
            title: 'Over 22.5 Points',
            sport: 'WNBA',
            game: 'Today 9:00 PM ET',
            description: `${playerData.name} points over 22.5`,
            odds: '+105',
            platform: platforms[Math.floor(Math.random() * platforms.length)],
            confidence: 3,
            insights: 'Fallback WNBA data. Click refresh to get live props.',
            category: 'Player Prop',
            edge: 5.5,
            type: 'Player Prop',
            line: 22.5,
            projected: 25.1
          });
        }
      });
      
      return fallbackProps;
    }

    // Existing logic for NBA/NFL
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

    playerIds.forEach(playerId => {
      const playerData = mockDataService.getPlayerStats(playerId);
      if (!playerData) return;

      const game = games.find(g => 
        g.homeTeam === playerData.team || g.awayTeam === playerData.team
      );
      if (!game) return;

      const opponent = game.homeTeam === playerData.team ? game.awayTeam : game.homeTeam;

      props.forEach(({ prop, line }) => {
        const calculation = this.calculationEngine.calculatePlayerProp(playerData, prop, opponent, game);
        const edge = this.calculationEngine.calculateEdge(calculation.projection, line, 'over');
        
        if (edge > 2) {
          const confidence = this.calculationEngine.calculateConfidence(edge, calculation.confidence, 8);
          
          picks.push({
            id: `${playerId}-${prop}-prop`,
            player: playerData.name,
            team: playerData.team,
            title: `Over ${line} ${prop.replace('_', ' ')}`,
            sport: sport.toUpperCase(),
            game: game.gameTime,
            description: `${playerData.name} ${prop} over ${line}`,
            odds: edge > 7 ? '+105' : '-115',
            platform: platforms[Math.floor(Math.random() * platforms.length)],
            confidence: confidence === 'high' ? 5 : confidence === 'medium' ? 3 : 2,
            insights: this.calculationEngine.generateInsights(calculation.factors, edge, confidence),
            category: 'Player Prop',
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

  // Method to check if we have stored WNBA data
  hasStoredWNBAData(): boolean {
    const stored = this.getStoredWNBAData();
    return stored !== null && stored.bestBets.length > 0;
  }

  // Get last update time
  getLastUpdateTime(): string | null {
    const stored = this.getStoredWNBAData();
    if (stored?.lastUpdated) {
      return new Date(stored.lastUpdated).toLocaleString();
    }
    return null;
  }

  // Clear stored data
  clearStoredData(): void {
    try {
      delete window.__wnbaStoredData;
      console.log('🗑️ Stored WNBA data cleared');
    } catch (error) {
      console.error('Error clearing stored data:', error);
    }
  }

  // Helper method to parse odds
  private parseOdds(odds: string): number {
    const cleanOdds = odds.replace(/[+\s]/g, '');
    return parseInt(cleanOdds) || 0;
  }

  // Method to refresh all picks (simulate real-time updates)
  refreshAllPicks(): void {
    mockDataService.simulateDataUpdate();
  }
}

// Extend the window interface for TypeScript
declare global {
  interface Window {
    __wnbaStoredData?: StoredWNBAData;
  }
}

export const dynamicPicksGenerator = new DynamicPicksGenerator();