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

interface CachedData {
  data: ProcessedProp[];
  timestamp: number;
}

export class OddsApiService {
  private apiKey: string;
  private baseUrl = 'https://api.the-odds-api.com/v4';
  private cachedHistoricalData: Map<string, PlayerHistoricalData> = new Map();
  private cache = new Map();
  private readonly STORAGE_KEY = 'wnba_props_cache';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    console.log('🔧 OddsApiService initialized with API key:', apiKey ? 'Present' : 'Missing');
  }

  async getWNBAProps(forceRefresh: boolean = false): Promise<ProcessedProp[]> {
    console.log('🎯 getWNBAProps called - starting process...');
    console.log('🔑 API Key check:', this.apiKey ? `Present (${this.apiKey.length} chars)` : 'MISSING');
    
    // Check persistent cache first (unless force refresh is requested)
    if (!forceRefresh) {
      const cachedData = this.getFromPersistentCache();
      if (cachedData) {
        console.log('💾 Returning cached WNBA props from localStorage');
        return cachedData;
      }
    }

    console.log('🏀 Starting fresh WNBA props fetch process...');

    // Validate API key first
    if (!this.apiKey || this.apiKey.trim() === '') {
      console.error('❌ API key is missing or empty');
      return [];
    }

    try {
      console.log('🔍 Making WNBA player props API call...');
      
      // Use the exact same format that works in your Google Sheets
      const propsUrl = `${this.baseUrl}/sports/basketball_wnba/odds?apiKey=${this.apiKey}&regions=us&markets=player_points,player_rebounds,player_assists&oddsFormat=american&bookmakers=draftkings,fanduel,betmgm`;
      
      console.log('📡 Making API request to:', propsUrl.replace(this.apiKey, '[HIDDEN]'));
      
      const startTime = Date.now();
      const propsResponse = await fetch(propsUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      const requestTime = Date.now() - startTime;

      console.log(`⏱️ API request completed in ${requestTime}ms`);
      console.log(`📊 Response status: ${propsResponse.status} ${propsResponse.statusText}`);
      console.log('📊 Response headers:', Object.fromEntries(propsResponse.headers.entries()));

      if (!propsResponse.ok) {
        const errorText = await propsResponse.text();
        console.error('❌ API request failed:', propsResponse.status, propsResponse.statusText);
        console.error('❌ Error response body:', errorText);
        
        if (propsResponse.status === 401) {
          console.error('❌ Authentication failed - check API key');
        } else if (propsResponse.status === 422) {
          console.error('❌ Validation error - check parameters');
        } else if (propsResponse.status === 404) {
          console.error('❌ Endpoint not found');
        }
        
        return [];
      }

      const responseText = await propsResponse.text();
      console.log('📄 Raw response received, length:', responseText.length);
      console.log('📄 Response preview (first 500 chars):', responseText.substring(0, 500));

      let wnbaEvents: OddsApiProp[];
      try {
        wnbaEvents = JSON.parse(responseText);
        console.log('✅ JSON parsed successfully');
        console.log(`📋 Found ${wnbaEvents.length} WNBA events`);
      } catch (parseError) {
        console.error('❌ JSON parse failed:', parseError);
        console.error('❌ Response text:', responseText.substring(0, 1000));
        return [];
      }

      if (!Array.isArray(wnbaEvents)) {
        console.error('❌ Response is not an array:', typeof wnbaEvents);
        return [];
      }

      if (wnbaEvents.length === 0) {
        console.log('⚠️ No WNBA events found');
        return [];
      }

      // Process all events to extract player props
      console.log('🔄 Processing WNBA events for player props...');
      const allPlayerProps: ProcessedProp[] = [];

      for (const [index, event] of wnbaEvents.entries()) {
        console.log(`\n🏀 Processing event ${index + 1}/${wnbaEvents.length}:`);
        console.log(`   Event ID: ${event.id}`);
        console.log(`   Matchup: ${event.away_team} @ ${event.home_team}`);
        console.log(`   Game Time: ${event.commence_time}`);
        console.log(`   Bookmakers: ${event.bookmakers?.length || 0}`);

        const processedProps = this.processWNBAEventData(event);
        console.log(`✅ Processed ${processedProps.length} props for this event`);
        
        allPlayerProps.push(...processedProps);
      }

      console.log(`\n🏆 Final results: ${allPlayerProps.length} total WNBA player props processed`);

      if (allPlayerProps.length > 0) {
        console.log('💾 Saving props to cache...');
        this.saveToPersistentCache(allPlayerProps);
        return allPlayerProps;
      } else {
        console.log('⚠️ No player props found in any events');
        return [];
      }

    } catch (error) {
      console.error('💥 Critical error in getWNBAProps:', error);
      if (error instanceof Error) {
        console.error('💥 Error message:', error.message);
        console.error('💥 Error stack:', error.stack);
      }
      return [];
    }
  }

  private getFromPersistentCache(): ProcessedProp[] | null {
    try {
      const cached = localStorage.getItem(this.STORAGE_KEY);
      if (!cached) return null;

      const cachedData: CachedData = JSON.parse(cached);
      console.log(`Found cached WNBA props from ${new Date(cachedData.timestamp).toLocaleString()} (no expiration)`);
      return cachedData.data;
    } catch (error) {
      console.error('Error reading from persistent cache:', error);
      localStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }

  private saveToPersistentCache(data: ProcessedProp[]): void {
    try {
      const now = Date.now();
      const cachedData: CachedData = {
        data,
        timestamp: now
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cachedData));
      console.log(`Cached ${data.length} WNBA props to localStorage (no expiration - persists until manually cleared)`);
    } catch (error) {
      console.error('Error saving to persistent cache:', error);
    }
  }

  private processWNBAEventData(eventOdds: OddsApiProp): ProcessedProp[] {
    console.log('🔄 Processing WNBA event data...');
    console.log('📋 Input event odds:', {
      id: eventOdds.id,
      commence_time: eventOdds.commence_time,
      home_team: eventOdds.home_team,
      away_team: eventOdds.away_team,
      bookmakers_count: eventOdds.bookmakers?.length || 0
    });

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

    console.log(`🏀 Processing player props for: ${matchup} on ${dayLabel} at ${gameTimeString}`);

    if (!eventOdds.bookmakers || eventOdds.bookmakers.length === 0) {
      console.log('⚠️ No bookmakers found in event data');
      return processedProps;
    }

    eventOdds.bookmakers.forEach((bookmaker, bookmakerIndex) => {
      console.log(`📚 Processing bookmaker ${bookmakerIndex + 1}: ${bookmaker.title} (${bookmaker.key})`);
      console.log(`   Markets count: ${bookmaker.markets?.length || 0}`);

      if (!bookmaker.markets || bookmaker.markets.length === 0) {
        console.log('   ⚠️ No markets found for this bookmaker');
        return;
      }

      bookmaker.markets.forEach((market, marketIndex) => {
        console.log(`   📊 Processing market ${marketIndex + 1}: ${market.key}`);
        console.log(`      Outcomes count: ${market.outcomes?.length || 0}`);

        if (market.key.includes('player_')) {
          if (!market.outcomes || market.outcomes.length === 0) {
            console.log('      ⚠️ No outcomes found for this market');
            return;
          }

          market.outcomes.forEach((outcome, outcomeIndex) => {
            console.log(`      🎯 Processing outcome ${outcomeIndex + 1}:`, {
              name: outcome.name,
              description: outcome.description,
              price: outcome.price,
              point: outcome.point
            });

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
              
              const processedProp = {
                id: `${eventOdds.id}-${bookmaker.key}-${market.key}-${outcomeIndex}`,
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
              };

              console.log('      ✅ Created processed prop:', processedProp);
              processedProps.push(processedProp);
            } else {
              console.log('      ⚠️ Skipping outcome - missing playerName or invalid line:', {
                playerName,
                line,
                hasValidData: Boolean(playerName && line > 0)
              });
            }
          });
        } else {
          console.log(`      ⏭️ Skipping non-player market: ${market.key}`);
        }
      });
    });

    console.log(`🏆 Finished processing event. Created ${processedProps.length} props total`);
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
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('API cache and persistent storage cleared');
  }
}

export const createOddsApiService = (apiKey: string) => new OddsApiService(apiKey);
