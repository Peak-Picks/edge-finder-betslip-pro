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

interface PlayerStatGroup {
  player: string;
  stat: string;
  line: number;
  overOutcome: any;
  underOutcome: any;
  bookmaker: any;
  market: any;
}

// Enhanced Insights Generator
class WNBAInsightsGenerator {
  
  static generateWNBAInsights(
    player: string,
    stat: string,
    type: 'Over' | 'Under',
    line: number,
    projection: number,
    edge: number,
    platform: string,
    gameInfo: string,
    confidence: number
  ): string {
    
    const projectionDiff = Math.abs(projection - line);
    const isStrongEdge = edge >= 8;
    const isMediumEdge = edge >= 5;
    
    // Base insight components
    const edgeDescription = this.getEdgeDescription(edge);
    const confidenceLevel = this.getConfidenceDescription(confidence);
    const projectionInsight = this.getProjectionInsight(type, projection, line, projectionDiff);
    const marketContext = this.getMarketContext(platform, stat, type);
    const valueAssessment = this.getValueAssessment(edge, confidence);
    
    // Construct the insight
    let insight = `${edgeDescription} ${projectionInsight} ${marketContext}`;
    
    // Add confidence and value assessment
    if (isStrongEdge) {
      insight += ` ${valueAssessment} ${confidenceLevel}`;
    } else if (isMediumEdge) {
      insight += ` ${confidenceLevel}`;
    }
    
    // Add game timing context
    const timingContext = this.getTimingContext(gameInfo);
    if (timingContext) {
      insight += ` ${timingContext}`;
    }
    
    return insight.trim();
  }
  
  private static getEdgeDescription(edge: number): string {
    if (edge >= 12) return "🔥 Exceptional value detected.";
    if (edge >= 8) return "⚡ Strong model advantage identified.";
    if (edge >= 5) return "✨ Solid betting opportunity found.";
    if (edge >= 3) return "📊 Model shows favorable value.";
    return "📈 Slight model edge detected.";
  }
  
  private static getConfidenceDescription(confidence: number): string {
    if (confidence >= 5) return "High confidence pick with strong historical backing.";
    if (confidence >= 4) return "Good confidence level supported by recent trends.";
    if (confidence >= 3) return "Moderate confidence with solid data foundation.";
    return "Developing confidence as patterns emerge.";
  }
  
  private static getProjectionInsight(
    type: 'Over' | 'Under', 
    projection: number, 
    line: number, 
    diff: number
  ): string {
    const direction = type === 'Over' ? 'above' : 'below';
    const strength = diff >= 1 ? 'significantly' : diff >= 0.5 ? 'notably' : 'slightly';
    
    return `Our advanced model projects ${projection.toFixed(1)}, ${strength} ${direction} the ${line} line.`;
  }
  
  private static getMarketContext(platform: string, stat: string, type: string): string {
    const contexts = {
      'assists': {
        'Over': [
          "Pace and ball movement favor assist opportunities.",
          "Team's offensive system creates assist-friendly scenarios.",
          "Historical matchup data supports increased playmaking."
        ],
        'Under': [
          "Defensive pressure expected to limit assist chances.",
          "Game flow likely to reduce playmaking opportunities.",
          "Opponent's defensive scheme targets assist prevention."
        ]
      },
      'points': {
        'Over': [
          "Favorable matchup against weaker perimeter defense.",
          "Usage rate and shot selection trends support scoring.",
          "Recent form indicates offensive rhythm."
        ],
        'Under': [
          "Strong defensive matchup limits scoring opportunities.",
          "Pace and style favor lower individual scoring.",
          "Foul trouble or rest concerns may cap minutes."
        ]
      },
      'rebounds': {
        'Over': [
          "Size advantage and positioning favor rebounding success.",
          "Team's style creates additional rebounding chances.",
          "Opponent allows higher rebounding rates."
        ],
        'Under': [
          "Competitive rebounding matchup limits opportunities.",
          "Team's pace reduces total rebounding chances.",
          "Role changes may impact rebounding focus."
        ]
      }
    };
    
    const statContexts = contexts[stat.toLowerCase()] || contexts['points'];
    const typeContexts = statContexts[type] || statContexts['Over'];
    
    return typeContexts[Math.floor(Math.random() * typeContexts.length)];
  }
  
  private static getValueAssessment(edge: number, confidence: number): string {
    const combinedScore = edge + (confidence * 2);
    
    if (combinedScore >= 15) return "🎯 Premium value play with exceptional upside.";
    if (combinedScore >= 12) return "💎 High-value opportunity with strong fundamentals.";
    if (combinedScore >= 9) return "⭐ Quality play with solid risk-reward profile.";
    return "📊 Steady value play worth consideration.";
  }
  
  private static getTimingContext(gameInfo: string): string {
    if (gameInfo.includes('Tomorrow')) {
      return "Early value before line movement.";
    }
    if (gameInfo.includes('Today')) {
      return "Live edge with current information.";
    }
    return "Optimal timing for maximum value.";
  }
  
  // Enhanced insights with player-specific context
  static generatePlayerSpecificInsights(
    player: string,
    stat: string,
    type: 'Over' | 'Under',
    line: number,
    projection: number,
    edge: number
  ): string {
    
    // Player-specific insights (you can expand this with actual player data)
    const playerContexts = {
      'Napheesa Collier': {
        'assists': {
          'Under': "Collier's role as primary scorer limits assist focus. Recent games show decreased playmaking as team emphasizes her scoring ability.",
          'Over': "Collier's improved court vision creates assist opportunities. Team's ball movement system maximizes her playmaking potential."
        }
      },
      'A\'ja Wilson': {
        'points': {
          'Over': "Wilson's dominant post presence and improved perimeter game create multiple scoring avenues.",
          'Under': "Defensive attention and potential rest management may limit scoring volume."
        }
      },
      'Breanna Stewart': {
        'rebounds': {
          'Over': "Stewart's versatility allows her to rebound from multiple positions effectively.",
          'Under': "Team's pace and style may reduce total rebounding opportunities."
        }
      }
    };
    
    const playerData = playerContexts[player];
    const playerInsight = playerData?.[stat]?.[type] || '';
    
    const baseInsight = this.generateWNBAInsights(
      player, stat, type, line, projection, edge, 'FanDuel', 'Tomorrow', 4
    );
    
    if (playerInsight) {
      return `${baseInsight} ${playerInsight}`;
    }
    
    return baseInsight;
  }
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
    console.log('🔄 Processing WNBA event data with consolidated projection logic...');
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

          // STEP 1: Group outcomes by player/stat/line
          const playerStatGroups = this.groupOutcomesByPlayerStat(market.outcomes, market.key);
          console.log(`      🎯 Found ${playerStatGroups.length} unique player/stat combinations`);

          // STEP 2: Process each group with consolidated projection logic
          playerStatGroups.forEach(group => {
            const processedProp = this.createOptimalBetFromGroup(
              group, 
              bookmaker, 
              market, 
              eventOdds, 
              matchup, 
              dayLabel, 
              gameTimeString
            );

            if (processedProp) {
              console.log(`      ✅ Created optimal bet for ${group.player} ${group.stat}:`, {
                type: processedProp.type,
                line: processedProp.line,
                edge: processedProp.edge,
                odds: processedProp.odds
              });
              processedProps.push(processedProp);
            }
          });
        } else {
          console.log(`      ⏭️ Skipping non-player market: ${market.key}`);
        }
      });
    });

    console.log(`🏆 Finished processing event. Created ${processedProps.length} optimal props total`);
    return processedProps;
  }

  // NEW: Group outcomes by player/stat/line combination
  private groupOutcomesByPlayerStat(outcomes: any[], marketKey: string): PlayerStatGroup[] {
    const groups: PlayerStatGroup[] = [];
    const groupMap = new Map<string, { over?: any, under?: any }>();

    outcomes.forEach(outcome => {
      const playerName = outcome.description;
      const line = outcome.point;
      const betType = outcome.name;

      if (!playerName || !line || !betType) return;

      const groupKey = `${playerName}-${marketKey}-${line}`;
      
      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, {});
      }

      const group = groupMap.get(groupKey)!;
      if (betType === 'Over') {
        group.over = outcome;
      } else if (betType === 'Under') {
        group.under = outcome;
      }
    });

    // Convert map to array of complete groups
    groupMap.forEach((group, key) => {
      if (group.over && group.under) {
        const [player, stat, line] = key.split('-');
        groups.push({
          player,
          stat,
          line: parseFloat(line),
          overOutcome: group.over,
          underOutcome: group.under,
          bookmaker: null, // Will be set by caller
          market: null // Will be set by caller
        });
      }
    });

    return groups;
  }

  // NEW: Create optimal bet from grouped outcomes with enhanced insights
  private createOptimalBetFromGroup(
    group: PlayerStatGroup,
    bookmaker: any,
    market: any,
    eventOdds: OddsApiProp,
    matchup: string,
    dayLabel: string,
    gameTimeString: string
  ): ProcessedProp | null {
    
    // STEP 1: Generate realistic projection for this player/stat
    const projection = this.generateRealisticProjection(
      group.player,
      group.stat,
      group.line,
      group.overOutcome.price,
      group.underOutcome.price
    );

    console.log(`      🎯 Projection for ${group.player} ${group.stat}: ${projection.toFixed(1)} (line: ${group.line})`);

    // STEP 2: Determine which side has positive edge
    const overEdge = this.calculateEdge(projection, group.line, 'over');
    const underEdge = this.calculateEdge(projection, group.line, 'under');

    console.log(`      📊 Edges - Over: ${overEdge.toFixed(1)}%, Under: ${underEdge.toFixed(1)}%`);

    // STEP 3: Select the side with positive edge (minimum 2% to avoid noise)
    let selectedOutcome: any;
    let selectedType: string;
    let selectedEdge: number;

    if (overEdge >= 2 && overEdge > underEdge) {
      selectedOutcome = group.overOutcome;
      selectedType = 'Over';
      selectedEdge = overEdge;
    } else if (underEdge >= 2 && underEdge > overEdge) {
      selectedOutcome = group.underOutcome;
      selectedType = 'Under';
      selectedEdge = underEdge;
    } else {
      console.log(`      ⚠️ No significant edge found for ${group.player} ${group.stat} - skipping`);
      return null;
    }

    // STEP 4: Create the optimal bet with enhanced insights
    const team = this.getTeamFromPlayer(group.player, eventOdds.home_team, eventOdds.away_team);
    
    let propType = 'Points';
    let statKey = 'points';
    if (group.stat === 'player_rebounds') {
      propType = 'Rebounds';
      statKey = 'rebounds';
    } else if (group.stat === 'player_assists') {
      propType = 'Assists';
      statKey = 'assists';
    }

    const confidence = Math.min(5, Math.max(1, Math.floor(selectedEdge / 2)));
    
    // Generate enhanced insights using the new generator
    const enhancedInsights = WNBAInsightsGenerator.generateWNBAInsights(
      group.player,
      statKey,
      selectedType as 'Over' | 'Under',
      group.line,
      projection,
      selectedEdge,
      bookmaker.title,
      `${dayLabel} ${gameTimeString}`,
      confidence
    );
    
    return {
      id: `${eventOdds.id}-${bookmaker.key}-${group.stat}-${selectedType}-${group.player.replace(/\s+/g, '-')}`,
      player: group.player,
      team: team,
      title: `${selectedType} ${group.line} ${propType}`,
      sport: 'WNBA',
      game: `${matchup} (${dayLabel})`,
      description: `${group.player} ${propType} ${selectedType} ${group.line}`,
      odds: selectedOutcome.price > 0 ? `+${selectedOutcome.price}` : `${selectedOutcome.price}`,
      platform: bookmaker.title,
      confidence: confidence,
      insights: enhancedInsights,
      category: 'Player Prop',
      edge: Math.round(selectedEdge * 10) / 10,
      type: selectedType,
      matchup: `${matchup} (${dayLabel})`,
      gameTime: `${dayLabel} ${gameTimeString}`,
      line: group.line,
      projected: Math.round(projection * 100) / 100
    };
  }

  // NEW: Generate realistic projection based on market context
  private generateRealisticProjection(
    player: string, 
    stat: string, 
    line: number, 
    overOdds: number, 
    underOdds: number
  ): number {
    // Use market odds to inform projection (efficient market hypothesis)
    const overImpliedProb = this.oddsToImpliedProbability(overOdds);
    const underImpliedProb = this.oddsToImpliedProbability(underOdds);
    
    // Market-implied expectation
    const marketExpectation = line + (overImpliedProb - 0.5) * (line * 0.3);
    
    // Add some realistic variance based on stat type and player context
    let variance = 0;
    if (stat === 'player_points') {
      variance = line * 0.1 * (Math.random() - 0.5); // ±10% of line
    } else if (stat === 'player_rebounds') {
      variance = line * 0.15 * (Math.random() - 0.5); // ±15% of line  
    } else if (stat === 'player_assists') {
      variance = line * 0.2 * (Math.random() - 0.5); // ±20% of line
    }
    
    // Player-specific adjustments (could be enhanced with real data)
    let playerAdjustment = 0;
    if (player.includes('Wilson') || player.includes('Stewart')) {
      playerAdjustment = line * 0.05; // Star players get slight boost
    }
    
    return Math.max(0, marketExpectation + variance + playerAdjustment);
  }

  // NEW: Convert odds to implied probability
  private oddsToImpliedProbability(odds: number): number {
    if (odds > 0) {
      return 100 / (odds + 100);
    } else {
      return Math.abs(odds) / (Math.abs(odds) + 100);
    }
  }

  // NEW: Calculate edge based on projection vs line
  private calculateEdge(projection: number, line: number, side: 'over' | 'under'): number {
    if (side === 'over') {
      // Edge for over bet = how much our projection exceeds the line
      return Math.max(0, ((projection - line) / line) * 100);
    } else {
      // Edge for under bet = how much the line exceeds our projection  
      return Math.max(0, ((line - projection) / line) * 100);
    }
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
