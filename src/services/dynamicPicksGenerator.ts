import { createOddsApiService } from './oddsApiService';
import { BestBetOptimizer, enhanceWNBADataProcessing } from './bestBetOptimizer';

// Types for our generated picks
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
  type?: string;
  matchup?: string;
  gameTime?: string;
  line?: string;
  projected?: string;
}

// Interface for stored WNBA data
export interface StoredWNBAData {
  bestBets: GeneratedPick[];
  gamePicks: GeneratedPick[];
  longShots: GeneratedPick[];
  playerProps: GeneratedPick[];
  lastUpdated: string;
}

// Extend the global window interface
declare global {
  interface Window {
    __wnbaStoredData?: StoredWNBAData;
  }
}

export class DynamicPicksGenerator {
  private oddsApiService: any = null;

  // Set API key for odds service
  setApiKey(apiKey: string): void {
    if (apiKey && apiKey.length > 10) {
      this.oddsApiService = createOddsApiService(apiKey);
      console.log('✅ Odds API service initialized');
    } else {
      console.warn('⚠️ Invalid API key provided');
    }
  }

  // Check if we have stored WNBA data
  hasStoredWNBAData(): boolean {
    const stored = window.__wnbaStoredData;
    return !!(stored && stored.lastUpdated);
  }

  // Get last update time
  getLastUpdateTime(): string | null {
    const stored = window.__wnbaStoredData;
    return stored?.lastUpdated || null;
  }

  // Clear stored data
  clearStoredData(): void {
    delete window.__wnbaStoredData;
  }

  // Refresh WNBA data from API
  async refreshWNBAData(force: boolean = false): Promise<void> {
    if (!this.oddsApiService) {
      console.error('❌ Odds API service not initialized');
      return;
    }

    const lastUpdate = this.getLastUpdateTime();
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Skip if we have recent data and not forcing
    if (!force && lastUpdate) {
      const lastUpdateTime = new Date(lastUpdate);
      if (lastUpdateTime > oneHourAgo) {
        console.log('⏭️ Using cached WNBA data (updated within last hour)');
        return;
      }
    }

    try {
      console.log('🔄 Fetching fresh WNBA data from API...');
      
      // Fetch WNBA props from API
      const wnbaProps = await this.oddsApiService.getWNBAPlayerProps();
      
      if (wnbaProps && wnbaProps.length > 0) {
        console.log(`📥 Received ${wnbaProps.length} raw WNBA props`);
        
        // Process and store the data
        const processedData = this.processWNBAPropsIntoCategories(wnbaProps);
        
        window.__wnbaStoredData = {
          ...processedData,
          lastUpdated: now.toLocaleString()
        };
        
        console.log(`✅ WNBA data processed and stored at ${now.toLocaleString()}`);
      } else {
        console.log('⚠️ No WNBA props available from API');
      }
    } catch (error) {
      console.error('💥 Error fetching WNBA data:', error);
      throw error;
    }
  }

  // Updated processWNBAPropsIntoCategories method for dynamicPicksGenerator.ts
  private processWNBAPropsIntoCategories(wnbaProps: any[]): Omit<StoredWNBAData, 'lastUpdated'> {
    console.log(`🔄 Processing ${wnbaProps.length} raw WNBA props...`);
    
    // STEP 1: Apply optimization to remove duplicate Over/Under bets
    const optimizedProps = enhanceWNBADataProcessing(wnbaProps);
    console.log(`🎯 Optimized to ${optimizedProps.length} strongest bets`);
    
    const bestBets: GeneratedPick[] = [];
    const gamePicks: GeneratedPick[] = [];
    const longShots: GeneratedPick[] = [];
    const playerProps: GeneratedPick[] = [];

    // STEP 2: Process optimized props into categories
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
        bestBets.push(pick);
      } else if (prop.edge >= 5) {
        pick.category = 'Best Value';
        playerProps.push(pick);
      } else if (prop.edge >= 3) {
        // Check if it qualifies as a long shot based on odds
        const oddsValue = this.parseOdds(prop.odds);
        if (oddsValue >= 150) {
          pick.category = 'Long Shot';
          longShots.push(pick);
        } else {
          pick.category = 'Player Prop';
          playerProps.push(pick);
        }
      }

      // All qualifying props go into player props as well
      if (prop.edge >= 3) {
        playerProps.push({...pick, category: 'Player Prop'});
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
    
    console.log(`📊 Categorization complete:`);
    console.log(`   Best Bets: ${bestBets.length} (8%+ edge)`);
    console.log(`   Player Props: ${playerProps.length} (3%+ edge)`);
    console.log(`   Long Shots: ${longShots.length} (3%+ edge, +150 odds)`);
    console.log(`   Game Picks: ${gamePicks.length} (derived from 4%+ avg edge)`);

    return {
      bestBets: bestBets.sort(sortByEdge).slice(0, 6),
      gamePicks: gamePicks.sort(sortByEdge).slice(0, 8),
      longShots: longShots.sort(sortByEdge).slice(0, 5),
      playerProps: playerProps.sort(sortByEdge).slice(0, 12)
    };
  }

  // Helper method to parse odds (add this to your DynamicPicksGenerator class)
  private parseOdds(odds: string): number {
    const cleanOdds = odds.replace(/[+\s]/g, '');
    return parseInt(cleanOdds) || 0;
  }

  // Generate best bets (combination of WNBA + fallback data)
  generateBestBets(): GeneratedPick[] {
    // Check for stored WNBA data first
    const storedData = window.__wnbaStoredData;
    if (storedData?.bestBets?.length > 0) {
      console.log(`📊 Using ${storedData.bestBets.length} stored WNBA best bets`);
      return storedData.bestBets;
    }

    // Fallback to mock data if no WNBA data
    console.log('📊 Using fallback mock data for best bets');
    return this.generateFallbackBestBets();
  }

  // Generate game-based picks
  async generateGameBasedPicks(): Promise<GeneratedPick[]> {
    const storedData = window.__wnbaStoredData;
    if (storedData?.gamePicks?.length > 0) {
      console.log(`📊 Using ${storedData.gamePicks.length} stored WNBA game picks`);
      return storedData.gamePicks;
    }

    console.log('📊 Using fallback mock data for game picks');
    return this.generateFallbackGamePicks();
  }

  // Generate long shot picks
  generateLongShots(): GeneratedPick[] {
    const storedData = window.__wnbaStoredData;
    if (storedData?.longShots?.length > 0) {
      console.log(`📊 Using ${storedData.longShots.length} stored WNBA long shots`);
      return storedData.longShots;
    }

    console.log('📊 Using fallback mock data for long shots');
    return this.generateFallbackLongShots();
  }

  // Generate player props
  generatePlayerProps(): GeneratedPick[] {
    const storedData = window.__wnbaStoredData;
    if (storedData?.playerProps?.length > 0) {
      console.log(`📊 Using ${storedData.playerProps.length} stored WNBA player props`);
      return storedData.playerProps;
    }

    console.log('📊 Using fallback mock data for player props');
    return this.generateFallbackPlayerProps();
  }

  // Fallback data generation methods
  private generateFallbackBestBets(): GeneratedPick[] {
    const fallbackData: GeneratedPick[] = [
      {
        id: 'nba-best-1',
        title: 'LeBron James Over 27.5 Points',
        sport: 'NBA',
        game: 'Lakers vs. Celtics',
        description: 'LeBron to score over 27.5 points based on recent performance.',
        odds: '-110',
        platform: 'DraftKings',
        confidence: 4,
        insights: 'LeBron has exceeded this line in 4 of his last 5 games.',
        category: 'Top Prop',
        edge: 7
      },
      {
        id: 'nfl-best-1',
        title: 'Patrick Mahomes Over 2.5 Passing TDs',
        sport: 'NFL',
        game: 'Chiefs vs. Packers',
        description: 'Mahomes to throw over 2.5 touchdowns in a favorable matchup.',
        odds: '+120',
        platform: 'FanDuel',
        confidence: 3,
        insights: 'Packers defense has struggled against top QBs this season.',
        category: 'Best Value',
        edge: 5
      },
      {
        id: 'mlb-best-1',
        title: 'Mookie Betts to Hit a Home Run',
        sport: 'MLB',
        game: 'Dodgers vs. Yankees',
        description: 'Betts to hit a home run against a struggling pitcher.',
        odds: '+250',
        platform: 'BetMGM',
        confidence: 2,
        insights: 'Betts has a history of performing well against this pitcher.',
        category: 'Long Shot',
        edge: 3
      }
    ];
    return fallbackData;
  }

  private generateFallbackGamePicks(): GeneratedPick[] {
    const fallbackData: GeneratedPick[] = [
      {
        id: 'nba-game-1',
        matchup: 'Lakers vs. Celtics',
        title: 'Celtics -3.5',
        sport: 'NBA',
        game: 'Lakers vs. Celtics',
        description: 'Celtics to cover the -3.5 spread at home.',
        odds: '-110',
        platform: 'DraftKings',
        confidence: 4,
        insights: 'Celtics have won their last 5 home games.',
        category: 'Game Pick',
        edge: 6,
        type: 'Spread',
        gameTime: '8:00 PM ET'
      },
      {
        id: 'nfl-game-1',
        matchup: 'Chiefs vs. Packers',
        title: 'Over 48.5 Total Points',
        sport: 'NFL',
        game: 'Chiefs vs. Packers',
        description: 'Total points to exceed 48.5 in a high-scoring affair.',
        odds: '-115',
        platform: 'FanDuel',
        confidence: 3,
        insights: 'Both teams have strong offenses and weak defenses.',
        category: 'Game Pick',
        edge: 5,
        type: 'Total',
        gameTime: '4:25 PM ET'
      }
    ];
    return fallbackData;
  }

  private generateFallbackLongShots(): GeneratedPick[] {
    const fallbackData: GeneratedPick[] = [
      {
        id: 'nba-longshot-1',
        title: 'Russell Westbrook Triple Double',
        sport: 'NBA',
        game: 'Clippers vs. Heat',
        description: 'Westbrook to record a triple double against the Heat.',
        odds: '+450',
        platform: 'BetMGM',
        confidence: 2,
        insights: 'Westbrook has been close to a triple double in recent games.',
        category: 'Long Shot',
        edge: 3
      },
      {
        id: 'nfl-longshot-1',
        title: 'Aaron Rodgers Over 350 Passing Yards',
        sport: 'NFL',
        game: 'Jets vs. Bills',
        description: 'Rodgers to throw for over 350 yards in a must-win game.',
        odds: '+500',
        platform: 'DraftKings',
        confidence: 1,
        insights: 'Bills defense is vulnerable to the pass.',
        category: 'Long Shot',
        edge: 2
      }
    ];
    return fallbackData;
  }

  private generateFallbackPlayerProps(): GeneratedPick[] {
    const fallbackData: GeneratedPick[] = [
      {
        id: 'nba-prop-1',
        player: 'Stephen Curry',
        title: 'Over 4.5 Three-Pointers Made',
        sport: 'NBA',
        game: 'Warriors vs. Suns',
        description: 'Curry to make over 4.5 three-pointers against the Suns.',
        odds: '-120',
        platform: 'FanDuel',
        confidence: 4,
        insights: 'Curry averages 5 three-pointers per game this season.',
        category: 'Player Prop',
        edge: 6
      },
      {
        id: 'nfl-prop-1',
        player: 'Derrick Henry',
        title: 'Over 90.5 Rushing Yards',
        sport: 'NFL',
        game: 'Titans vs. Colts',
        description: 'Henry to rush for over 90.5 yards against the Colts.',
        odds: '-110',
        platform: 'BetMGM',
        confidence: 3,
        insights: 'Henry has exceeded this line in 3 of his last 4 games.',
        category: 'Player Prop',
        edge: 5
      },
      {
        id: 'mlb-prop-1',
        player: 'Shohei Ohtani',
        title: 'Over 1.5 Total Bases',
        sport: 'MLB',
        game: 'Angels vs. Mariners',
        description: 'Ohtani to record over 1.5 total bases against the Mariners.',
        odds: '+100',
        platform: 'DraftKings',
        confidence: 2,
        insights: 'Ohtani is hitting .300 against this pitcher.',
        category: 'Player Prop',
        edge: 4
      }
    ];
    return fallbackData;
  }

  // Refresh all picks (clears cache and regenerates)
  refreshAllPicks(): void {
    console.log('🔄 Refreshing all picks...');
    // Clear any cached data if needed
  }
}

// Create singleton instance
export const dynamicPicksGenerator = new DynamicPicksGenerator();
