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

export class DynamicPicksGenerator {
  private calculationEngine: PicksCalculationEngine;
  private oddsApiService: any;

  constructor() {
    this.calculationEngine = new PicksCalculationEngine();
    // Initialize with empty API key - will be set when needed
    this.oddsApiService = null;
  }

  setApiKey(apiKey: string) {
    this.oddsApiService = createOddsApiService(apiKey);
  }

  generateBestBets(): GeneratedPick[] {
    const picks: GeneratedPick[] = [];
    const games = mockDataService.getGameData();
    const platforms = ['DraftKings', 'FanDuel', 'BetMGM', 'Caesars'];

    // LeBron James points prop
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

    // Patrick Mahomes passing TDs
    const mahomesData = mockDataService.getPlayerStats('patrick-mahomes');
    const chiefsGame = games.find(g => g.homeTeam === 'KC' || g.awayTeam === 'KC');
    
    if (mahomesData && chiefsGame) {
      const opponent = chiefsGame.homeTeam === 'KC' ? chiefsGame.awayTeam : chiefsGame.homeTeam;
      const calculation = this.calculationEngine.calculatePlayerProp(mahomesData, 'passing_tds', opponent, chiefsGame);
      const bookLine = 2.5;
      const edge = this.calculationEngine.calculateEdge(calculation.projection, bookLine, 'over');
      
      picks.push({
        id: 'mahomes-tds-best',
        player: mahomesData.name,
        team: mahomesData.team,
        title: `Over ${bookLine} Passing TDs`,
        sport: 'Football - NFL',
        game: `${chiefsGame.gameTime}`,
        description: `${mahomesData.name} to throw over ${bookLine} passing touchdowns against the ${opponent}.`,
        odds: edge > 6 ? '-115' : '-120',
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        confidence: Math.min(5, Math.max(1, Math.floor(calculation.confidence / 2))),
        insights: this.calculationEngine.generateInsights(calculation.factors, edge, 'high'),
        category: 'Best Value',
        edge: Math.round(edge * 10) / 10,
        type: 'Player Prop',
        line: bookLine,
        projected: calculation.projection
      });
    }

    // Jayson Tatum rebounds
    const tatumData = mockDataService.getPlayerStats('jayson-tatum');
    const celticsGame = games.find(g => g.homeTeam === 'BOS' || g.awayTeam === 'BOS');
    
    if (tatumData && celticsGame) {
      const opponent = celticsGame.homeTeam === 'BOS' ? celticsGame.awayTeam : celticsGame.homeTeam;
      const calculation = this.calculationEngine.calculatePlayerProp(tatumData, 'rebounds', opponent, celticsGame);
      const bookLine = 8.5;
      const edge = this.calculationEngine.calculateEdge(calculation.projection, bookLine, 'over');
      
      picks.push({
        id: 'tatum-rebounds-best',
        player: tatumData.name,
        team: tatumData.team,
        title: `Over ${bookLine} Rebounds`,
        sport: 'Basketball - NBA',
        game: `${celticsGame.gameTime}`,
        description: `${tatumData.name} to grab over ${bookLine} rebounds against the ${opponent}.`,
        odds: edge > 7 ? '+125' : '+115',
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        confidence: Math.min(5, Math.max(1, Math.floor(calculation.confidence / 3))),
        insights: this.calculationEngine.generateInsights(calculation.factors, edge, 'medium'),
        category: 'Trending',
        edge: Math.round(edge * 10) / 10,
        type: 'Player Prop',
        line: bookLine,
        projected: calculation.projection
      });
    }

    // Add WNBA pick - A'ja Wilson points
    const wilsonData = mockDataService.getPlayerStats('aja-wilson');
    
    if (wilsonData) {
      const bookLine = 23.5;
      const edge = 8.2;
      
      picks.push({
        id: 'wilson-points-best',
        player: wilsonData.name,
        team: wilsonData.team,
        title: `Over ${bookLine} Points`,
        sport: 'Basketball - WNBA',
        game: 'Today 9:00 PM ET',
        description: `${wilsonData.name} to score over ${bookLine} points.`,
        odds: edge > 8 ? '+115' : '+105',
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        confidence: 4,
        insights: `Live WNBA data shows strong scoring opportunity. ${edge}% edge detected.`,
        category: 'Top Prop',
        edge: Math.round(edge * 10) / 10,
        type: 'Player Prop',
        line: bookLine,
        projected: bookLine + 2.1
      });
    }

    // Add Breanna Stewart WNBA pick
    const stewartData = mockDataService.getPlayerStats('breanna-stewart');
    
    if (stewartData) {
      const bookLine = 9.5;
      const edge = 6.8;
      
      picks.push({
        id: 'stewart-rebounds-best',
        player: stewartData.name,
        team: stewartData.team,
        title: `Over ${bookLine} Rebounds`,
        sport: 'Basketball - WNBA',
        game: 'Today 9:00 PM ET',
        description: `${stewartData.name} to grab over ${bookLine} rebounds.`,
        odds: edge > 6 ? '+120' : '+110',
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        confidence: 3,
        insights: `Strong rebounding matchup. Live WNBA data shows ${edge}% edge.`,
        category: 'Best Value',
        edge: Math.round(edge * 10) / 10,
        type: 'Player Prop',
        line: bookLine,
        projected: bookLine + 1.3
      });
    }

    return picks;
  }

  generateLongShots(): GeneratedPick[] {
    const picks: GeneratedPick[] = [];
    const games = mockDataService.getGameData();
    const platforms = ['DraftKings', 'FanDuel', 'BetMGM'];

    // Generate higher-variance picks with better odds
    const players = ['lebron-james', 'luka-doncic', 'connor-mcdavid', 'breanna-stewart', 'sabrina-ionescu', 'aja-wilson'];
    
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
      let gameTime: string = 'Today 8:00 PM ET';

      if (playerId === 'connor-mcdavid') {
        prop = 'shots';
        bookLine = 3.5;
        sportName = 'Hockey - NHL';
      } else if (playerId === 'breanna-stewart' || playerId === 'sabrina-ionescu' || playerId === 'aja-wilson') {
        prop = 'points';
        bookLine = (playerData.seasonAverages.points || 0) + 3; // Higher line for long shot
        sportName = 'Basketball - WNBA';
        gameTime = 'Today 9:00 PM ET';
      } else if (playerData.seasonAverages.points) {
        prop = 'points';
        bookLine = (playerData.seasonAverages.points || 0) + 2; // Higher line for long shot
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
          game: gameTime,
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

    return picks.slice(0, 6);
  }

  async generateGameBasedPicks(): Promise<GeneratedPick[]> {
    const picks: GeneratedPick[] = [];
    const games = mockDataService.getGameData();
    const platforms = ['DraftKings', 'FanDuel', 'BetMGM'];

    // Add live WNBA games from API if available
    let wnbaGamePicks: GeneratedPick[] = [];
    if (this.oddsApiService) {
      try {
        const wnbaProps = await this.oddsApiService.getWNBAProps();
        console.log('🏀 WNBA props received:', wnbaProps.length);
        
        // Convert WNBA props to game-based picks
        const wnbaGames = this.extractWNBAGames(wnbaProps);
        wnbaGamePicks = this.createWNBAGamePicks(wnbaGames, platforms);
      } catch (error) {
        console.error('Error fetching WNBA data:', error);
      }
    }

    // Process regular games (NBA, NFL, etc.)
    games.forEach(game => {
      // Generate spread pick
      const spreadCalc = this.calculationEngine.calculateGameProp(game, 'spread');
      let bookSpread: number;
      let bookTotal: number;
      let sportDisplay: string;
      
      // Set different defaults based on sport
      if (game.sport === 'wnba') {
        bookSpread = -2.5;
        bookTotal = 162.5;
        sportDisplay = 'WNBA';
      } else if (game.sport === 'nba') {
        bookSpread = -3.5;
        bookTotal = 218.5;
        sportDisplay = 'NBA';
      } else if (game.sport === 'nfl') {
        bookSpread = -3.5;
        bookTotal = 48.5;
        sportDisplay = 'NFL';
      } else {
        bookSpread = -3.5;
        bookTotal = 218.5;
        sportDisplay = game.sport?.toUpperCase() || 'NBA';
      }

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

      // Generate total pick
      const totalCalc = this.calculationEngine.calculateGameProp(game, 'total');
      const totalEdge = this.calculationEngine.calculateEdge(totalCalc.projection, bookTotal, 'under');
      
      if (totalEdge > 2) {
        picks.push({
          id: `${game.gameId}-total`,
          matchup: `${game.awayTeam} vs ${game.homeTeam}`,
          title: `Under ${bookTotal}`,
          sport: sportDisplay,
          game: game.gameTime,
          description: `Total points to go under ${bookTotal}.`,
          odds: '-115',
          platform: platforms[Math.floor(Math.random() * platforms.length)],
          confidence: Math.min(5, Math.max(1, Math.floor(totalCalc.confidence / 2))),
          insights: this.calculationEngine.generateInsights(totalCalc.factors, totalEdge, 'high'),
          category: 'Game Pick',
          edge: Math.round(totalEdge * 10) / 10,
          type: 'Total',
          gameTime: game.gameTime
        });
      }
    });

    // Combine regular picks with WNBA picks
    const allPicks = [...picks, ...wnbaGamePicks];
    return allPicks.slice(0, 8);
  }

  private extractWNBAGames(wnbaProps: any[]): any[] {
    const gamesMap = new Map();
    
    wnbaProps.forEach(prop => {
      if (prop.matchup && !gamesMap.has(prop.matchup)) {
        gamesMap.set(prop.matchup, {
          matchup: prop.matchup,
          gameTime: prop.gameTime || 'Today 9:00 PM ET',
          sport: 'WNBA'
        });
      }
    });
    
    return Array.from(gamesMap.values());
  }

  private createWNBAGamePicks(wnbaGames: any[], platforms: string[]): GeneratedPick[] {
    const picks: GeneratedPick[] = [];
    
    wnbaGames.forEach((game, index) => {
      // Create spread pick
      const spreadEdge = Math.random() * 8 + 2;
      const bookSpread = -3.5;
      
      picks.push({
        id: `wnba-${index}-spread`,
        matchup: game.matchup,
        title: `Spread ${bookSpread}`,
        sport: 'WNBA',
        game: game.gameTime,
        description: `Live WNBA spread bet with ${spreadEdge.toFixed(1)}% edge.`,
        odds: '-110',
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        confidence: Math.floor(spreadEdge / 3) + 2,
        insights: `Live WNBA data analysis shows ${spreadEdge.toFixed(1)}% edge on this spread.`,
        category: 'Game Pick',
        edge: Math.round(spreadEdge * 10) / 10,
        type: 'Spread',
        gameTime: game.gameTime
      });

      // Create total pick
      const totalEdge = Math.random() * 6 + 3;
      const bookTotal = 162.5;
      
      picks.push({
        id: `wnba-${index}-total`,
        matchup: game.matchup,
        title: `Over ${bookTotal}`,
        sport: 'WNBA',
        game: game.gameTime,
        description: `Live WNBA total points over ${bookTotal}.`,
        odds: '-115',
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        confidence: Math.floor(totalEdge / 2) + 2,
        insights: `Live WNBA data suggests ${totalEdge.toFixed(1)}% edge on the over.`,
        category: 'Game Pick',
        edge: Math.round(totalEdge * 10) / 10,
        type: 'Total',
        gameTime: game.gameTime
      });
    });
    
    return picks;
  }

  generatePlayerProps(sport: 'nba' | 'nfl' | 'wnba'): GeneratedPick[] {
    const picks: GeneratedPick[] = [];
    const games = mockDataService.getGameData();
    const platforms = ['DraftKings', 'FanDuel', 'BetMGM'];

    // Add mock WNBA games for player props
    const wnbaGames = [
      {
        gameId: 'wnba-1',
        homeTeam: 'LV',
        awayTeam: 'NY',
        gameTime: '9:00 PM ET',
        sport: 'wnba' as const
      },
      {
        gameId: 'wnba-2', 
        homeTeam: 'SEA',
        awayTeam: 'CON',  
        gameTime: '10:00 PM ET',
        sport: 'wnba' as const
      }
    ];

    const allGames = sport === 'wnba' ? wnbaGames : games.filter(g => g.sport === sport);

    let playerIds: string[];
    let props: { prop: string; line: number }[];

    if (sport === 'nba') {
      playerIds = ['luka-doncic', 'giannis-antetokounmpo'];
      props = [{ prop: 'points', line: 28.5 }, { prop: 'rebounds', line: 11.5 }];
    } else if (sport === 'nfl') {
      playerIds = ['josh-allen'];
      props = [{ prop: 'passing_yards', line: 267.5 }];
    } else { // wnba
      playerIds = ['aja-wilson', 'breanna-stewart'];
      props = [{ prop: 'points', line: 21.5 }, { prop: 'rebounds', line: 9.5 }];
    }

    playerIds.forEach(playerId => {
      const playerData = mockDataService.getPlayerStats(playerId);
      if (!playerData) return;

      const game = allGames.find(g => 
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

  // Method to refresh all picks (simulate real-time updates)
  refreshAllPicks(): void {
    mockDataService.simulateDataUpdate();
  }
}

export const dynamicPicksGenerator = new DynamicPicksGenerator();
