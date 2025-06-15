
import { PlayerStats, GameData, BookmakerLine } from './picksCalculation';

export class MockDataService {
  // Mock player data
  private mockPlayers: PlayerStats[] = [
    {
      playerId: 'lebron-james',
      name: 'LeBron James',
      team: 'LAL',
      position: 'SF',
      seasonAverages: { points: 25.8, rebounds: 7.2, assists: 6.8 },
      last10Games: { points: 28.4, rebounds: 8.1, assists: 7.5 },
      vsOpponent: { points: 31.2, rebounds: 8.8, assists: 6.2 }
    },
    {
      playerId: 'luka-doncic',
      name: 'Luka Dončić',
      team: 'DAL',
      position: 'PG',
      seasonAverages: { points: 32.1, rebounds: 8.5, assists: 8.9 },
      last10Games: { points: 34.2, rebounds: 9.1, assists: 9.8 },
      vsOpponent: { points: 29.5, rebounds: 7.8, assists: 10.2 }
    },
    {
      playerId: 'patrick-mahomes',
      name: 'Patrick Mahomes',
      team: 'KC',
      position: 'QB',
      seasonAverages: { passingYards: 278.5, passingTDs: 2.4 },
      last10Games: { passingYards: 285.2, passingTDs: 2.8 },
      vsOpponent: { passingYards: 295.1, passingTDs: 3.1 }
    },
    {
      playerId: 'josh-allen',
      name: 'Josh Allen',
      team: 'BUF',
      position: 'QB',
      seasonAverages: { passingYards: 267.8, passingTDs: 2.2 },
      last10Games: { passingYards: 275.4, passingTDs: 2.6 },
      vsOpponent: { passingYards: 285.2, passingTDs: 2.9 }
    },
    {
      playerId: 'giannis-antetokounmpo',
      name: 'Giannis Antetokounmpo',
      team: 'MIL',
      position: 'PF',
      seasonAverages: { points: 29.2, rebounds: 11.8, assists: 5.9 },
      last10Games: { points: 31.5, rebounds: 12.9, assists: 6.2 },
      vsOpponent: { points: 27.8, rebounds: 13.2, assists: 5.1 }
    },
    {
      playerId: 'jayson-tatum',
      name: 'Jayson Tatum',
      team: 'BOS',
      position: 'SF',
      seasonAverages: { points: 26.9, rebounds: 8.1, assists: 4.8 },
      last10Games: { points: 28.7, rebounds: 9.2, assists: 5.1 },
      vsOpponent: { points: 24.5, rebounds: 10.1, assists: 4.2 }
    },
    {
      playerId: 'connor-mcdavid',
      name: 'Connor McDavid',
      team: 'EDM',
      position: 'C',
      seasonAverages: { shots: 4.2 },
      last10Games: { shots: 4.8 },
      vsOpponent: { shots: 3.9 }
    }
  ];

  private mockGames: GameData[] = [
    {
      gameId: 'lal-gs-1',
      homeTeam: 'LAL',
      awayTeam: 'GSW',
      gameTime: '8:00 PM ET',
      sport: 'nba',
      venue: 'Crypto.com Arena',
      injuries: ['Stephen Curry (ankle)'],
      teamStats: {
        'LAL': { offensiveRating: 115.2, defensiveRating: 108.1, pace: 98.5, homeAdvantage: 3.2 },
        'GSW': { offensiveRating: 118.5, defensiveRating: 112.3, pace: 101.2, homeAdvantage: 0 }
      }
    },
    {
      gameId: 'bos-mia-1',
      homeTeam: 'BOS',
      awayTeam: 'MIA',
      gameTime: '7:30 PM ET',
      sport: 'nba',
      venue: 'TD Garden',
      injuries: [],
      teamStats: {
        'BOS': { offensiveRating: 120.1, defensiveRating: 105.8, pace: 96.8, homeAdvantage: 4.1 },
        'MIA': { offensiveRating: 112.3, defensiveRating: 109.2, pace: 95.2, homeAdvantage: 0 }
      }
    },
    {
      gameId: 'kc-buf-1',
      homeTeam: 'BUF',
      awayTeam: 'KC',
      gameTime: '4:25 PM ET',
      sport: 'nfl',
      venue: 'Highmark Stadium',
      weather: 'Snow, 28°F',
      injuries: ['Travis Kelce (questionable)'],
      teamStats: {
        'BUF': { offensiveRating: 112.5, defensiveRating: 95.2, pace: 65.2, homeAdvantage: 2.8 },
        'KC': { offensiveRating: 118.1, defensiveRating: 98.8, pace: 63.8, homeAdvantage: 0 }
      }
    }
  ];

  private mockLines: BookmakerLine[] = [
    { bookmaker: 'DraftKings', type: 'player_prop', line: 25.5, odds: '+110', prop: 'points', player: 'LeBron James' },
    { bookmaker: 'FanDuel', type: 'player_prop', line: 28.5, odds: '-110', prop: 'points', player: 'Luka Dončić' },
    { bookmaker: 'BetMGM', type: 'player_prop', line: 8.5, odds: '+125', prop: 'rebounds', player: 'Jayson Tatum' },
    { bookmaker: 'FanDuel', type: 'player_prop', line: 2.5, odds: '-115', prop: 'passing_tds', player: 'Patrick Mahomes' },
    { bookmaker: 'DraftKings', type: 'spread', line: -3.5, odds: '-110' },
    { bookmaker: 'BetMGM', type: 'total', line: 218.5, odds: '-115' }
  ];

  getPlayerStats(playerId: string): PlayerStats | null {
    return this.mockPlayers.find(p => p.playerId === playerId) || null;
  }

  getGameData(gameId?: string): GameData[] {
    return gameId ? this.mockGames.filter(g => g.gameId === gameId) : this.mockGames;
  }

  getBookmakerLines(type?: string): BookmakerLine[] {
    return type ? this.mockLines.filter(l => l.type === type) : this.mockLines;
  }

  // Simulate real-time updates
  getRandomVariation(baseValue: number, variationPercent: number = 0.1): number {
    const variation = baseValue * variationPercent * (Math.random() - 0.5) * 2;
    return Math.round((baseValue + variation) * 10) / 10;
  }

  // Add some randomness to simulate changing conditions
  simulateDataUpdate(): void {
    this.mockPlayers.forEach(player => {
      if (player.last10Games.points) {
        player.last10Games.points = this.getRandomVariation(player.last10Games.points, 0.05);
      }
      if (player.last10Games.rebounds) {
        player.last10Games.rebounds = this.getRandomVariation(player.last10Games.rebounds, 0.08);
      }
      if (player.last10Games.assists) {
        player.last10Games.assists = this.getRandomVariation(player.last10Games.assists, 0.1);
      }
    });
  }
}

export const mockDataService = new MockDataService();
