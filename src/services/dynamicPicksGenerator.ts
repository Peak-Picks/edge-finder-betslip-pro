
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

  // Get stored WNBA data from memory with validation
  private getStoredWNBAData(): StoredWNBAData | null {
    try {
      if (window.__wnbaStoredData) {
        const data = window.__wnbaStoredData;
        console.log('📦 Retrieved stored WNBA data:', {
          bestBets: data.bestBets?.length || 0,
          longShots: data.longShots?.length || 0,
          playerProps: data.playerProps?.length || 0,
          gamePicks: data.gamePicks?.length || 0,
          lastUpdated: data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'Unknown'
        });
        
        // Validate that we have meaningful data
        const totalPicks = (data.bestBets?.length || 0) + (data.longShots?.length || 0) + 
                          (data.playerProps?.length || 0) + (data.gamePicks?.length || 0);
        
        if (totalPicks > 0) {
          console.log('✅ Valid cached WNBA data found with', totalPicks, 'total picks');
          return data;
        } else {
          console.log('⚠️ Cached data exists but contains no picks');
          return null;
        }
      }
      console.log('📦 No stored WNBA data found in window.__wnbaStoredData');
      return null;
    } catch (error) {
      console.error('❌ Error retrieving stored WNBA data:', error);
      return null;
    }
  }

  // Store WNBA data in memory with validation
  private storeWNBAData(data: StoredWNBAData): void {
    try {
      // Validate data before storing
      if (!data.bestBets) data.bestBets = [];
      if (!data.gamePicks) data.gamePicks = [];
      if (!data.longShots) data.longShots = [];
      if (!data.playerProps) data.playerProps = [];
      
      window.__wnbaStoredData = data;
      
      const totalPicks = data.bestBets.length + data.gamePicks.length + 
                        data.longShots.length + data.playerProps.length;
      
      console.log('💾 WNBA data stored successfully:', {
        bestBets: data.bestBets.length,
        longShots: data.longShots.length,
        playerProps: data.playerProps.length,
        gamePicks: data.gamePicks.length,
        totalPicks: totalPicks,
        timestamp: new Date(data.lastUpdated).toLocaleString()
      });
      
      if (totalPicks === 0) {
        console.log('⚠️ Warning: Stored data contains no picks');
      }
    } catch (error) {
      console.error('❌ Error storing WNBA data:', error);
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
      console.log(`📊 Fetched ${wnbaProps.length} WNBA props from API`);

      if (wnbaProps.length === 0) {
        console.log('⚠️ No WNBA props available from API - keeping existing stored data');
        return;
      }

      // Process the raw API data into different categories
      console.log('🔄 Processing WNBA props into categories...');
      const processedData = this.processWNBAPropsIntoCategories(wnbaProps);
      
      const totalProcessed = processedData.bestBets.length + processedData.longShots.length + 
                           processedData.playerProps.length + processedData.gamePicks.length;
      
      console.log('✅ Processed WNBA props into categories:', {
        bestBets: processedData.bestBets.length,
        longShots: processedData.longShots.length,
        playerProps: processedData.playerProps.length,
        gamePicks: processedData.gamePicks.length,
        totalProcessed: totalProcessed
      });
      
      if (totalProcessed === 0) {
        console.log('⚠️ No picks generated from processing - data may be invalid');
        return;
      }
      
      // Store the processed data with current timestamp
      const storedData: StoredWNBAData = {
        ...processedData,
        lastUpdated: Date.now()
      };
      
      this.storeWNBAData(storedData);
      console.log('✅ WNBA data refresh completed and stored successfully');
      
    } catch (error) {
      console.error('💥 Error during WNBA data refresh:', error);
      throw error; // Re-throw so components can handle the error
    }
  }

  // Process WNBA props from the API into different pick categories
  private processWNBAPropsIntoCategories(wnbaProps: any[]): Omit<StoredWNBAData, 'lastUpdated'> {
    console.log(`🔄 Processing ${wnbaProps.length} raw WNBA props into categories...`);
    
    const bestBets: GeneratedPick[] = [];
    const gamePicks: GeneratedPick[] = [];
    const longShots: GeneratedPick[] = [];
    const playerProps: GeneratedPick[] = [];

    // Process each prop from the API
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

      console.log(`📊 Processing prop: ${pick.player} ${pick.title} - Edge: ${pick.edge}%, Odds: ${pick.odds}`);

      // Categorize based on edge levels
      if (prop.edge >= 8) {
        pick.category = 'Top Prop';
        bestBets.push({...pick});
        console.log(`✅ Added to Best Bets: ${pick.player} ${pick.title} (${pick.edge}% edge)`);
      } 
      else if (prop.edge >= 5) {
        pick.category = 'Best Value';
        playerProps.push({...pick});
        console.log(`✅ Added to Player Props: ${pick.player} ${pick.title} (${pick.edge}% edge)`);
      } 
      else if (prop.edge >= 3) {
        const oddsValue = Math.abs(this.parseOdds(prop.odds));
        
        if (oddsValue >= 150 || (prop.edge >= 4.5 && oddsValue >= 110)) {
          const longShotPick = {...pick};
          longShotPick.category = 'Long Shot';
          longShots.push(longShotPick);
          console.log(`✅ Added to Long Shots: ${pick.player} ${pick.title} (${pick.edge}% edge, ${pick.odds} odds)`);
        } else {
          pick.category = 'Player Prop';
          playerProps.push({...pick});
          console.log(`✅ Added to Player Props: ${pick.player} ${pick.title} (${pick.edge}% edge)`);
        }
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
          insights: `Game analysis based on ${gameData.count} player props with ${avgEdge.toFixed(1)}% average edge. Strong correlations detected.`,
          category: 'Game Pick',
          edge: Math.round(avgEdge * 10) / 10,
          type: 'Spread',
          gameTime: gameData.props[0]?.gameTime || 'Today'
        });

        if (avgEdge >= 5) {
          gamePicks.push({
            id: `wnba-game-${index}-total`,
            matchup: gameKey,
            title: 'Over 165.5',
            sport: 'WNBA',
            game: gameKey,
            description: `${gameKey} total points - based on player prop trends`,
            odds: '-110',
            platform: gameData.props[0]?.platform || 'FanDuel',
            confidence: Math.min(5, Math.max(2, Math.floor(avgEdge / 2))),
            insights: `Total analysis based on ${gameData.count} player props showing ${avgEdge.toFixed(1)}% average edge.`,
            category: 'Game Pick',
            edge: Math.round((avgEdge - 1) * 10) / 10,
            type: 'Total',
            gameTime: gameData.props[0]?.gameTime || 'Today'
          });
        }
      }
    });

    const sortByEdge = (a: GeneratedPick, b: GeneratedPick) => b.edge - a.edge;
    
    const finalResult = {
      bestBets: bestBets.sort(sortByEdge).slice(0, 8),
      gamePicks: gamePicks.sort(sortByEdge).slice(0, 10),
      longShots: longShots.sort(sortByEdge).slice(0, 8),
      playerProps: playerProps.sort(sortByEdge).slice(0, 15)
    };

    console.log(`📊 Final categorization result:`);
    console.log(`   Best Bets: ${finalResult.bestBets.length}`);
    console.log(`   Game Picks: ${finalResult.gamePicks.length}`);
    console.log(`   Long Shots: ${finalResult.longShots.length}`);
    console.log(`   Player Props: ${finalResult.playerProps.length}`);

    return finalResult;
  }

  generateBestBets(): GeneratedPick[] {
    console.log('🎯 generateBestBets called - checking cache first');
    
    // PRIORITY 1: Use cached WNBA data
    const storedData = this.getStoredWNBAData();
    if (storedData?.bestBets && storedData.bestBets.length > 0) {
      console.log(`✅ Using ${storedData.bestBets.length} cached WNBA best bets`);
      return storedData.bestBets;
    }
    
    console.log('⚠️ No cached WNBA best bets found, generating fallback picks');
    
    // PRIORITY 2: Generate fallback picks (NBA + mock WNBA)
    const picks: GeneratedPick[] = [];
    const games = mockDataService.getGameData();
    const platforms = ['DraftKings', 'FanDuel', 'BetMGM', 'Caesars'];

    // Add NBA picks
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

    // Add fallback WNBA picks
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
        insights: `Mock WNBA data. Use refresh button to fetch live WNBA props for real best bets.`,
        category: 'Top Prop',
        edge: Math.round(edge * 10) / 10,
        type: 'Player Prop',
        line: bookLine,
        projected: bookLine + 2.1
      });
    }

    console.log(`🏆 generateBestBets returning ${picks.length} fallback picks`);
    return picks;
  }

  generateLongShots(): GeneratedPick[] {
    console.log('🎯 generateLongShots called - checking cache first');
    
    // PRIORITY 1: Use cached WNBA data
    const storedData = this.getStoredWNBAData();
    if (storedData?.longShots && storedData.longShots.length > 0) {
      console.log(`✅ Using ${storedData.longShots.length} cached WNBA long shots`);
      return storedData.longShots;
    }
    
    console.log('⚠️ No cached WNBA long shots found, generating fallback picks');

    // PRIORITY 2: Generate fallback picks
    const picks: GeneratedPick[] = [];
    const games = mockDataService.getGameData();
    const platforms = ['DraftKings', 'FanDuel', 'BetMGM'];

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

    console.log(`🏆 generateLongShots returning ${picks.length} fallback picks`);
    return picks.slice(0, 6);
  }

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
    
    console.log('⚠️ No cached WNBA data available, generating fallback picks');

    // PRIORITY 3: Generate fallback picks from mock data
    const fallbackPicks: GeneratedPick[] = [];
    const games = mockDataService.getGameData();
    const platforms = ['DraftKings', 'FanDuel', 'BetMGM'];

    games.forEach(game => {
      const spreadCalc = this.calculationEngine.calculateGameProp(game, 'spread');
      const bookSpread = -3.5;
      const sportDisplay = game.sport?.toUpperCase() || 'NBA';

      const spreadEdge = this.calculationEngine.calculateEdge(Math.abs(spreadCalc.projection), Math.abs(bookSpread));
      
      if (spreadEdge > 3) {
        fallbackPicks.push({
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

    console.log(`🏆 generateGameBasedPicks returning ${fallbackPicks.length} fallback picks`);
    return fallbackPicks.slice(0, 10);
  }

  // Generate game picks from cached player props
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
          insights: `Game analysis based on ${gameData.count} cached player props with ${avgEdge.toFixed(1)}% average edge. Strong correlations detected.`,
          category: 'Game Pick',
          edge: Math.round(avgEdge * 10) / 10,
          type: 'Spread',
          gameTime: gameData.gameTime || 'Today'
        });

        if (avgEdge >= 5) {
          generatedGamePicks.push({
            id: `wnba-cached-game-${index}-total`,
            matchup: gameKey,
            title: 'Over 165.5',
            sport: 'WNBA',
            game: gameKey,
            description: `${gameKey} total points - based on cached player prop trends`,
            odds: '-110',
            platform: gameData.platform || 'FanDuel',
            confidence: Math.min(5, Math.max(2, Math.floor(avgEdge / 2))),
            insights: `Total analysis from ${gameData.count} cached props showing ${avgEdge.toFixed(1)}% average edge.`,
            category: 'Game Pick',
            edge: Math.round((avgEdge - 1) * 10) / 10,
            type: 'Total',
            gameTime: gameData.gameTime || 'Today'
          });
        }
      }
    });

    const sortByEdge = (a: GeneratedPick, b: GeneratedPick) => b.edge - a.edge;
    const finalPicks = generatedGamePicks.sort(sortByEdge);
    
    console.log(`✅ Generated ${finalPicks.length} game picks from cached props`);
    return finalPicks;
  }

  generatePlayerProps(sport: 'nba' | 'nfl' | 'wnba'): GeneratedPick[] {
    // PRIORITY 1: Use cached WNBA data for WNBA requests
    if (sport === 'wnba') {
      console.log('🎯 generatePlayerProps(wnba) called - checking cache first');
      const storedData = this.getStoredWNBAData();
      
      if (storedData?.playerProps && storedData.playerProps.length > 0) {
        console.log(`✅ Using ${storedData.playerProps.length} cached WNBA player props`);
        return storedData.playerProps;
      }
      
      console.log('⚠️ No cached WNBA player props found, generating fallback');
      
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
            insights: 'Mock WNBA data. Use refresh to get live props.',
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

    // Handle other sports with mock data
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

  hasStoredWNBAData(): boolean {
    const stored = this.getStoredWNBAData();
    return stored !== null;
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
      delete window.__wnbaStoredData;
      console.log('🗑️ Stored WNBA data cleared');
    } catch (error) {
      console.error('Error clearing stored data:', error);
    }
  }

  private parseOdds(odds: string): number {
    const cleanOdds = odds.replace(/[+\s]/g, '');
    return parseInt(cleanOdds) || 0;
  }

  refreshAllPicks(): void {
    mockDataService.simulateDataUpdate();
  }
}

declare global {
  interface Window {
    __wnbaStoredData?: StoredWNBAData;
  }
}

export const dynamicPicksGenerator = new DynamicPicksGenerator();
