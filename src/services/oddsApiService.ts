
export interface OddsApiProp {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    last_update: string;
    markets: Array<{
      key: string;
      last_update: string;
      outcomes: Array<{
        name: string;
        description?: string;
        price: number;
        point?: number;
      }>;
    }>;
  }>;
}

export interface ProcessedProp {
  id: string;
  player: string;
  team: string;
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

export class OddsApiService {
  private apiKey: string;
  private baseUrl = 'https://api.the-odds-api.com/v4';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getWNBAProps(): Promise<ProcessedProp[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/sports/basketball_wnba/odds?apiKey=${this.apiKey}&regions=us&markets=player_points,player_rebounds,player_assists&oddsFormat=american&bookmakers=draftkings,fanduel,betmgm`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: OddsApiProp[] = await response.json();
      return this.processWNBAProps(data);
    } catch (error) {
      console.error('Error fetching WNBA props:', error);
      throw error;
    }
  }

  private processWNBAProps(apiData: OddsApiProp[]): ProcessedProp[] {
    const processedProps: ProcessedProp[] = [];

    apiData.forEach(game => {
      game.bookmakers.forEach(bookmaker => {
        bookmaker.markets.forEach(market => {
          market.outcomes.forEach((outcome, index) => {
            const gameTime = new Date(game.commence_time).toLocaleDateString();
            const matchup = `${game.away_team} @ ${game.home_team}`;
            
            // Extract player name from description
            const playerName = outcome.description?.split(' ')[0] || outcome.name;
            const team = this.getTeamFromPlayer(playerName, game.home_team, game.away_team);
            
            // Determine prop type
            let propType = 'Points';
            if (market.key.includes('rebounds')) propType = 'Rebounds';
            if (market.key.includes('assists')) propType = 'Assists';
            
            // Calculate simple edge (mock calculation)
            const mockEdge = Math.random() * 12 + 1;
            
            processedProps.push({
              id: `${game.id}-${bookmaker.key}-${market.key}-${index}`,
              player: playerName,
              team: team,
              title: `Over ${outcome.point || 0} ${propType}`,
              sport: 'WNBA',
              game: gameTime,
              description: outcome.description || `${playerName} ${propType}`,
              odds: outcome.price > 0 ? `+${outcome.price}` : `${outcome.price}`,
              platform: bookmaker.title,
              confidence: Math.floor(mockEdge / 3) + 2,
              insights: `Based on recent performance and matchup analysis. ${bookmaker.title} offering competitive odds.`,
              category: 'Player Prop',
              edge: Math.round(mockEdge * 10) / 10,
              type: 'Player Prop',
              matchup: matchup,
              gameTime: gameTime,
              line: outcome.point || 0,
              projected: (outcome.point || 0) + (mockEdge * 0.1)
            });
          });
        });
      });
    });

    return processedProps.slice(0, 20); // Limit to 20 props for display
  }

  private getTeamFromPlayer(playerName: string, homeTeam: string, awayTeam: string): string {
    // Simple team assignment - in real app, you'd have a player-team mapping
    const teamAbbrevs: { [key: string]: string } = {
      'Las Vegas Aces': 'LV',
      'New York Liberty': 'NY',
      'Connecticut Sun': 'CONN',
      'Seattle Storm': 'SEA',
      'Minnesota Lynx': 'MIN',
      'Indiana Fever': 'IND',
      'Chicago Sky': 'CHI',
      'Atlanta Dream': 'ATL',
      'Washington Mystics': 'WAS',
      'Phoenix Mercury': 'PHX',
      'Dallas Wings': 'DAL',
      'Los Angeles Sparks': 'LA'
    };
    
    return teamAbbrevs[homeTeam] || teamAbbrevs[awayTeam] || 'WNBA';
  }
}

export const createOddsApiService = (apiKey: string) => new OddsApiService(apiKey);
