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

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    console.log('🔧 OddsApiService initialized with API key:', apiKey ? 'Present' : 'Missing');
  }

  async getWNBAProps(forceRefresh: boolean = false): Promise<ProcessedProp[]> {
    console.log('🎯 getWNBAProps called - starting process...');
    console.log('🔑 API Key check:', this.apiKey ? `Present (${this.apiKey.length} chars)` : 'MISSING');
    
    // Check in-memory cache first (unless force refresh is requested)
    if (!forceRefresh && this.cache.has('wnba_props')) {
      const cached = this.cache.get('wnba_props');
      const now = Date.now();
      // Cache for 5 minutes
      if (cached && (now - cached.timestamp) < 5 * 60 * 1000) {
        console.log('💾 Returning cached WNBA props from memory');
        return cached.data;
      }
    }

    console.log('🏀 Starting fresh WNBA props fetch process...');

    // Validate API key first
    if (!this.apiKey || this.apiKey.trim() === '') {
      console.error('❌ API key is missing or empty');
      return [];
    }

    try {
      // STEP 1: Get all upcoming WNBA games first
      console.log('🔍 Step 1: Fetching upcoming WNBA games...');
      const gamesUrl = `${this.baseUrl}/sports/basketball_wnba/odds?apiKey=${this.apiKey}&regions=us&markets=h2h&oddsFormat=american`;
      
      console.log('📡 Making games API request to:', gamesUrl.replace(this.apiKey, '[HIDDEN]'));
      
      const gamesResponse = await fetch(gamesUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!gamesResponse.ok) {
        const errorText = await gamesResponse.text();
        console.error('❌ Games API request failed:', gamesResponse.status, gamesResponse.statusText);
        console.error('❌ Error response body:', errorText);
        return [];
      }

      const gamesData: OddsApiProp[] = await gamesResponse.json();
      console.log(`✅ Found ${gamesData.length} upcoming WNBA games`);

      if (gamesData.length === 0) {
        console.log('⚠️ No upcoming WNBA games found');
        return [];
      }

      // STEP 2: For each game, fetch player props
      console.log('🔍 Step 2: Fetching player props for each game...');
      const allPlayerProps: ProcessedProp[] = [];

      for (const [index, game] of gamesData.entries()) {
        console.log(`\n🏀 Processing game ${index + 1}/${gamesData.length}:`);
        console.log(`   Event ID: ${game.id}`);
        console.log(`   Matchup: ${game.away_team} @ ${game.home_team}`);
        console.log(`   Game Time: ${game.commence_time}`);

        try {
          // CORRECTED: Use event-specific endpoint for player props
          const playerPropsUrl = `${this.baseUrl}/sports/basketball_wnba/events/${game.id}/odds?apiKey=${this.apiKey}&regions=us&markets=player_points,player_rebounds,player_assists&oddsFormat=american&bookmakers=draftkings,fanduel,betmgm`;
          
          console.log('📡 Fetching player props for event:', game.id);
          
          const propsResponse = await fetch(playerPropsUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });

          if (!propsResponse.ok) {
            console.error(`❌ Player props request failed for game ${game.id}:`, propsResponse.status);
            const errorText = await propsResponse.text();
            console.error('❌ Error details:', errorText);
            
            // If it's a 422 error, player props might not be available yet
            if (propsResponse.status === 422) {
              console.log('⚠️ Player props not available for this game yet - continuing with next game');
            }
            continue;
          }

          const propsData: OddsApiProp = await propsResponse.json();
          console.log(`✅ Player props data received for game ${game.id}`);
          console.log(`   Bookmakers with props: ${propsData.bookmakers?.length || 0}`);

          // Process the player props for this game
          const gameProps = this.processWNBAEventData(propsData);
          console.log(`✅ Processed ${gameProps.length} props for this game`);
          
          allPlayerProps.push(...gameProps);

          // Add a small delay to avoid hitting rate limits
          if (index < gamesData.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }

        } catch (gameError) {
          console.error(`💥 Error processing game ${game.id}:`, gameError);
          continue;
        }
      }

      console.log(`\n🏆 Final results: ${allPlayerProps.length} total WNBA player props processed`);

      if (allPlayerProps.length > 0) {
        // Cache the results in memory
        this.cache.set('wnba_props', {
          data: allPlayerProps,
          timestamp: Date.now()
        });
        console.log('💾 Saved props to memory cache');
        return allPlayerProps;
      } else {
        console.log('⚠️ No player props found across all games');
        console.log('   This might be because:');
        console.log('   - Player props are not yet available (try closer to game time)');
        console.log('   - WNBA season is not active');
        console.log('   - Bookmakers haven\'t posted props for these games yet');
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

  // Helper method to check what games are available
  async checkUpcomingGames(): Promise<void> {
    if (!this.apiKey) {
      console.error('❌ API key required for games check');
      return;
    }

    try {
      const gamesUrl = `${this.baseUrl}/sports/basketball_wnba/odds?apiKey=${this.apiKey}&regions=us&markets=h2h&oddsFormat=american`;
      
      console.log('🔍 Checking upcoming WNBA games...');
      const response = await fetch(gamesUrl);
      
      if (response.ok) {
        const games = await response.json();
        console.log(`📊 Found ${games.length} upcoming games:`);
        
        games.forEach((game: any, index: number) => {
          const gameTime = new Date(game.commence_time);
          console.log(`${index + 1}. ${game.away_team} @ ${game.home_team}`);
          console.log(`   Game ID: ${game.id}`);
          console.log(`   Time: ${gameTime.toLocaleString()}`);
          console.log(`   Bookmakers: ${game.bookmakers?.length || 0}`);
        });
      } else {
        console.error('❌ Games check failed:', response.status, await response.text());
      }
    } catch (error) {
      console.error('❌ Error checking games:', error);
    }
  }

  // Test a specific game's player props
  async testGamePlayerProps(gameId: string): Promise<void> {
    if (!this.apiKey) {
      console.error('❌ API key required');
      return;
    }

    try {
      const propsUrl = `${this.baseUrl}/sports/basketball_wnba/events/${gameId}/odds?apiKey=${this.apiKey}&regions=us&markets=player_points,player_rebounds,player_assists&oddsFormat=american`;
      
      console.log(`🔍 Testing player props for game ${gameId}...`);
      const response = await fetch(propsUrl);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Player props response:', JSON.stringify(data, null, 2));
      } else {
        const errorText = await response.text();
        console.error('❌ Player props test failed:', response.status, errorText);
      }
    } catch (error) {
      console.error('❌ Error testing player props:', error);
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

      console.log('   📊 Available markets:', bookmaker.markets.map(m => m.key).join(', '));

      bookmaker.markets.forEach((market, marketIndex) => {
        console.log(`   📊 Processing market ${marketIndex + 1}: ${market.key}`);
        console.log(`      Outcomes count: ${market.outcomes?.length || 0}`);

        // Process player prop markets
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

            // Extract player information
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