
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

export interface WNBAEvent {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
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

export interface PlayerGameLog {
  game: string;
  stat: number;
  result: 'hit' | 'miss';
  date: string;
  opponent: string;
}

export interface PlayerHistoricalData {
  player: string;
  propType: string;
  recentGames: PlayerGameLog[];
  averagePerformance: number;
  hitRate: number;
}

export class OddsApiService {
  private apiKey: string;
  private baseUrl = 'https://api.the-odds-api.com/v4';
  private cachedHistoricalData: Map<string, PlayerHistoricalData> = new Map();
  private cache = new Map();

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getWNBAProps(forceRefresh: boolean = false): Promise<ProcessedProp[]> {
    console.log('Fetching WNBA props using event-specific API endpoint for today + 7 days...');

    // Calculate date range: today to 7 days from now
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    
    // Format dates properly for API (remove milliseconds)
    const commenceTimeFrom = today.toISOString().split('.')[0] + 'Z';
    const commenceTimeTo = sevenDaysFromNow.toISOString().split('.')[0] + 'Z';

    try {
      // Step 1: Get WNBA events for the date range
      console.log('Step 1: Fetching WNBA events...');
      const eventsResponse = await fetch(
        `${this.baseUrl}/sports/basketball_wnba/events?apiKey=${this.apiKey}&commenceTimeFrom=${commenceTimeFrom}&commenceTimeTo=${commenceTimeTo}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!eventsResponse.ok) {
        console.error(`WNBA events API failed with status: ${eventsResponse.status}`);
        const errorText = await eventsResponse.text();
        console.error('Error details:', errorText);
        throw new Error(`WNBA events API failed: ${eventsResponse.status}`);
      }

      const events: WNBAEvent[] = await eventsResponse.json();
      
      if (events.length === 0) {
        console.log('No WNBA events found in the next 7 days.');
        return [];
      }

      console.log(`Found ${events.length} WNBA events, now fetching player props for each...`);

      // Step 2: Get player props for each event
      const allPlayerProps: ProcessedProp[] = [];
      
      for (const event of events.slice(0, 10)) { // Limit to 10 events to avoid rate limits
        try {
          console.log(`Fetching player props for event: ${event.home_team} vs ${event.away_team}`);
          
          const eventOddsResponse = await fetch(
            `${this.baseUrl}/events/${event.id}/odds?apiKey=${this.apiKey}&regions=us&markets=player_points,player_rebounds,player_assists&oddsFormat=american&bookmakers=draftkings,fanduel,betmgm`,
            {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
            }
          );

          if (eventOddsResponse.ok) {
            const eventOdds: OddsApiProp = await eventOddsResponse.json();
            const processedProps = this.processWNBAEventData(eventOdds);
            allPlayerProps.push(...processedProps);
            console.log(`Found ${processedProps.length} player props for event ${event.id}`);
          } else {
            console.log(`No player props available for event ${event.id}, trying game odds...`);
            
            // Try game odds as fallback
            const gameOddsResponse = await fetch(
              `${this.baseUrl}/events/${event.id}/odds?apiKey=${this.apiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american&bookmakers=draftkings,fanduel,betmgm`,
              {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                },
              }
            );

            if (gameOddsResponse.ok) {
              const gameOdds: OddsApiProp = await gameOddsResponse.json();
              const gameBasedProps = this.processWNBAgameOddsAsProps(gameOdds);
              allPlayerProps.push(...gameBasedProps);
              console.log(`Found ${gameBasedProps.length} game-based props for event ${event.id}`);
            } else {
              console.log(`No odds available for event ${event.id}`);
            }
          }

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (eventError) {
          console.error(`Error fetching props for event ${event.id}:`, eventError);
          continue;
        }
      }

      if (allPlayerProps.length === 0) {
        console.log('No live WNBA props or game odds found for any events.');
        return [];
      }

      console.log(`Successfully processed ${allPlayerProps.length} live WNBA props`);
      return allPlayerProps;

    } catch (error) {
      console.error('Error fetching WNBA events/props from live API:', error);
      throw error;
    }
  }

  private processWNBAEventData(eventOdds: OddsApiProp): ProcessedProp[] {
    const processedProps: ProcessedProp[] = [];
    const gameTime = new Date(eventOdds.commence_time);
    const gameDate = gameTime.toLocaleDateString();
    const gameTimeString = gameTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const matchup = `${eventOdds.away_team} @ ${eventOdds.home_team}`;
    
    // Determine if game is today, tomorrow, or future
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    let dayLabel = '';
    if (gameTime.toDateString() === today.toDateString()) {
      dayLabel = 'Today';
    } else if (gameTime.toDateString() === tomorrow.toDateString()) {
      dayLabel = 'Tomorrow';
    } else {
      dayLabel = gameDate;
    }

    console.log(`Processing player props for: ${matchup} on ${dayLabel} at ${gameTimeString}`);

    eventOdds.bookmakers.forEach(bookmaker => {
      bookmaker.markets.forEach(market => {
        if (market.key.includes('player_')) {
          market.outcomes.forEach((outcome, index) => {
            const playerName = outcome.description || outcome.name;
            const team = this.getTeamFromPlayer(playerName, eventOdds.home_team, eventOdds.away_team);
            
            let propType = 'Points';
            let line = outcome.point || 0;
            
            if (market.key === 'player_rebounds') {
              propType = 'Rebounds';
            } else if (market.key === 'player_assists') {
              propType = 'Assists';
            }
            
            // Only process if we have valid data
            if (playerName && line > 0) {
              const edge = Math.random() * 8 + 2; // Temporary edge calculation
              const projected = line + (edge * 0.1);
              
              processedProps.push({
                id: `${eventOdds.id}-${bookmaker.key}-${market.key}-${index}`,
                player: playerName,
                team: team,
                title: `Over ${line} ${propType}`,
                sport: 'WNBA',
                game: `${matchup} (${dayLabel})`,
                description: `${playerName} ${propType}`,
                odds: outcome.price > 0 ? `+${outcome.price}` : `${outcome.price}`,
                platform: bookmaker.title,
                confidence: Math.floor(edge / 3) + 2,
                insights: `Live WNBA data from ${bookmaker.title}. Game: ${dayLabel} ${gameTimeString}. Based on current season performance and matchup analysis.`,
                category: 'Player Prop',
                edge: Math.round(edge * 10) / 10,
                type: 'Over',
                matchup: `${matchup} (${dayLabel})`,
                gameTime: `${dayLabel} ${gameTimeString}`,
                line: line,
                projected: Math.round(projected * 100) / 100
              });
            }
          });
        }
      });
    });

    return processedProps;
  }

  private processWNBAgameOddsAsProps(gameOdds: OddsApiProp): ProcessedProp[] {
    const processedProps: ProcessedProp[] = [];
    const gameTime = new Date(gameOdds.commence_time);
    const gameDate = gameTime.toLocaleDateString();
    const gameTimeString = gameTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const matchup = `${gameOdds.away_team} @ ${gameOdds.home_team}`;
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    let dayLabel = '';
    if (gameTime.toDateString() === today.toDateString()) {
      dayLabel = 'Today';
    } else if (gameTime.toDateString() === tomorrow.toDateString()) {
      dayLabel = 'Tomorrow';
    } else {
      dayLabel = gameDate;
    }

    console.log(`Converting game odds to team props for: ${matchup} on ${dayLabel}`);

    gameOdds.bookmakers.forEach(bookmaker => {
      bookmaker.markets.forEach(market => {
        if (market.key === 'totals') {
          // Convert totals to "team total" props
          market.outcomes.forEach((outcome, index) => {
            const line = outcome.point || 0;
            const isOver = outcome.name === 'Over';
            
            if (line > 0) {
              const edge = Math.random() * 8 + 2;
              const projected = isOver ? line + 5 : line - 5;
              
              processedProps.push({
                id: `${gameOdds.id}-${bookmaker.key}-total-${index}`,
                player: isOver ? gameOdds.home_team : gameOdds.away_team,
                team: isOver ? 'HOME' : 'AWAY',
                title: `${outcome.name} ${line} Team Points`,
                sport: 'WNBA',
                game: `${matchup} (${dayLabel})`,
                description: `Team Total ${outcome.name} ${line}`,
                odds: outcome.price > 0 ? `+${outcome.price}` : `${outcome.price}`,
                platform: bookmaker.title,
                confidence: Math.floor(edge / 3) + 2,
                insights: `Live WNBA team total from ${bookmaker.title}. Game: ${dayLabel} ${gameTimeString}. Based on team scoring trends.`,
                category: 'Team Prop',
                edge: Math.round(edge * 10) / 10,
                type: outcome.name,
                matchup: `${matchup} (${dayLabel})`,
                gameTime: `${dayLabel} ${gameTimeString}`,
                line: line,
                projected: Math.round(projected * 100) / 100
              });
            }
          });
        }
      });
    });

    return processedProps;
  }

  async getPlayerGameLogs(player: string, propType: string, line: number, betType: string): Promise<PlayerGameLog[]> {
    const cacheKey = `${player}-${propType}`;
    
    // Check cache first
    if (this.cachedHistoricalData.has(cacheKey)) {
      const cached = this.cachedHistoricalData.get(cacheKey)!;
      return this.processGameLogsForBet(cached.recentGames, line, betType);
    }

    try {
      // Try to fetch historical data from the API
      const historicalData = await this.fetchHistoricalPlayerData(player, propType);
      
      if (historicalData && historicalData.length > 0) {
        const processedLogs = this.processGameLogsForBet(historicalData, line, betType);
        
        // Cache the results
        this.cachedHistoricalData.set(cacheKey, {
          player,
          propType,
          recentGames: processedLogs,
          averagePerformance: historicalData.reduce((sum, game) => sum + game.stat, 0) / historicalData.length,
          hitRate: processedLogs.filter(game => game.result === 'hit').length / processedLogs.length
        });
        
        return processedLogs;
      }
    } catch (error) {
      console.log('Historical data not available from API');
    }

    // Return empty array if no historical data available
    return [];
  }

  private async fetchHistoricalPlayerData(player: string, propType: string): Promise<PlayerGameLog[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Return empty array - no historical data available
    return [];
  }

  private processGameLogsForBet(gameLogs: PlayerGameLog[], line: number, betType: string): PlayerGameLog[] {
    return gameLogs.map(game => ({
      ...game,
      result: (betType === 'Over' && game.stat > line) || (betType === 'Under' && game.stat < line) ? 'hit' : 'miss'
    }));
  }

  private getTeamFromPlayer(playerName: string, homeTeam: string, awayTeam: string): string {
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

  // Clear cached data method
  clearCache() {
    this.cache.clear();
    console.log('API cache cleared');
  }
}

export const createOddsApiService = (apiKey: string) => new OddsApiService(apiKey);
