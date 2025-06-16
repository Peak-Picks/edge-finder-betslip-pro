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

interface CachedData {
  data: ProcessedProp[];
  timestamp: number;
}

export class OddsApiService {
  private apiKey: string;
  private baseUrl = 'https://api.the-odds-api.com/v4';
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
      
      // FIXED: Correct API endpoint for player props
      // The original URL was fetching general odds, not player props
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

      if (!propsResponse.ok) {
        const errorText = await propsResponse.text();
        console.error('❌ API request failed:', propsResponse.status, propsResponse.statusText);
        console.error('❌ Error response body:', errorText);
        
        if (propsResponse.status === 401) {
          console.error('❌ Authentication failed - check API key');
        } else if (propsResponse.status === 422) {
          console.error('❌ Validation error - possible issues:');
          console.error('   - Player prop markets might not be available for WNBA');
          console.error('   - Try checking available markets first');
          console.error('   - Season might be off-season');
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
        return [];
      }

      if (!Array.isArray(wnbaEvents)) {
        console.error('❌ Response is not an array:', typeof wnbaEvents);
        return [];
      }

      if (wnbaEvents.length === 0) {
        console.log('⚠️ No WNBA events found - this could mean:');
        console.log('   - WNBA season is not active');
        console.log('   - No games scheduled');
        console.log('   - Player prop markets not available');
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
        console.log('   This might be because:');
        console.log('   - Bookmakers don\'t offer player props for these games');
        console.log('   - Player prop markets are not yet available');
        console.log('   - Try checking closer to game time');
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

  // NEW: Debug method to check available markets
  async checkAvailableMarkets(): Promise<void> {
    if (!this.apiKey) {
      console.error('❌ API key required for market check');
      return;
    }

    try {
      const marketsUrl = `${this.baseUrl}/sports/basketball_wnba/odds?apiKey=${this.apiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american&bookmakers=draftkings`;
      
      console.log('🔍 Checking available markets...');
      const response = await fetch(marketsUrl);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Available markets response:', JSON.stringify(data, null, 2));
        
        if (Array.isArray(data) && data.length > 0) {
          console.log('🎯 Found games, checking market structure:');
          data.forEach((game, index) => {
            console.log(`Game ${index + 1}: ${game.away_team} @ ${game.home_team}`);
            game.bookmakers?.forEach(bookmaker => {
              console.log(`  ${bookmaker.title} markets:`, bookmaker.markets?.map(m => m.key).join(', '));
            });
          });
        }
      } else {
        console.error('❌ Market check failed:', response.status, await response.text());
      }
    } catch (error) {
      console.error('❌ Error checking markets:', error);
    }
  }

  private getFromPersistentCache(): ProcessedProp[] | null {
    try {
      // FIXED: Remove localStorage usage as it's not supported in Claude artifacts
      // Return null to always fetch fresh data
      return null;
    } catch (error) {
      console.error('Error reading from persistent cache:', error);
      return null;
    }
  }

  private saveToPersistentCache(data: ProcessedProp[]): void {
    try {
      // FIXED: Remove localStorage usage as it's not supported in Claude artifacts
      console.log(`Would cache ${data.length} WNBA props (localStorage not available in this environment)`);
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

      // FIXED: Log all available markets to see what we're actually getting
      console.log('   📊 Available markets:', bookmaker.markets.map(m => m.key).join(', '));

      bookmaker.markets.forEach((market, marketIndex) => {
        console.log(`   📊 Processing market ${marketIndex + 1}: ${market.key}`);
        console.log(`      Outcomes count: ${market.outcomes?.length || 0}`);

        // FIXED: More specific market matching and better error handling
        if (market.key === 'player_points' || market.key === 'player_rebounds' || market.key === 'player_assists') {
          if (!market.outcomes || market.outcomes.length === 0) {
            console.log('      ⚠️ No outcomes found for this player prop market');
            return;
          }

          market.outcomes.forEach((outcome, outcomeIndex) => {
            console.log(`      🎯 Processing outcome ${outcomeIndex + 1}:`, {
              name: outcome.name,
              description: outcome.description,
              price: outcome.price,
              point: outcome.point
            });

            // FIXED: Based on your Google Sheets data, player name is in description field
            const playerName = outcome.description;
            const betType = outcome.name; // 'Over' or 'Under'
            const line = outcome.point;
            const odds = outcome.price;

            if (!playerName) {
              console.log('      ⚠️ No player name found in description field');
              return;
            }

            if (!line || line <= 0) {
              console.log('      ⚠️ No valid line found in point field');
              return;
            }

            if (!betType || (betType !== 'Over' && betType !== 'Under')) {
              console.log('      ⚠️ Invalid bet type (expected Over/Under):', betType);
              return;
            }

            const team = this.getTeamFromPlayer(playerName, eventOdds.home_team, eventOdds.away_team);
            
            let propType = 'Points';
            if (market.key === 'player_rebounds') {
              propType = 'Rebounds';
            } else if (market.key === 'player_assists') {
              propType = 'Assists';
            }
            
            const edge = Math.random() * 8 + 2;
            const projected = betType === 'Over' ? line + (edge * 0.1) : line - (edge * 0.1);
            
            const processedProp = {
              id: `${eventOdds.id}-${bookmaker.key}-${market.key}-${betType}-${outcomeIndex}`,
              player: playerName,
              team: team,
              title: `${betType} ${line} ${propType}`,
              sport: 'WNBA',
              game: `${matchup} (${dayLabel})`,
              description: `${playerName} ${propType} ${betType} ${line}`,
              odds: odds > 0 ? `+${odds}` : `${odds}`,
              platform: bookmaker.title,
              confidence: Math.floor(edge / 3) + 2,
              insights: `Live WNBA data from ${bookmaker.title}. Game: ${dayLabel} ${gameTimeString}. Player: ${playerName}, Line: ${line}, Type: ${betType}`,
              category: 'Player Prop',
              edge: Math.round(edge * 10) / 10,
              type: betType,
              matchup: `${matchup} (${dayLabel})`,
              gameTime: `${dayLabel} ${gameTimeString}`,
              line: line,
              projected: Math.round(projected * 100) / 100
            };

            console.log('      ✅ Created processed prop:', {
              player: processedProp.player,
              type: processedProp.type,
              line: processedProp.line,
              propType: propType,
              odds: processedProp.odds
            });
            processedProps.push(processedProp);
          });
        } else {
          console.log(`      ⏭️ Skipping non-player market: ${market.key}`);
        }
      });
    });

    console.log(`🏆 Finished processing event. Created ${processedProps.length} props total`);
    return processedProps;
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