// FIXED OddsApiService - Replace all Math.random() calls with deterministic calculations

import DeterministicCalculationService from './deterministicCalculationService';

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
    if (confidence >= 4) return "Good confidence with solid indicators.";
    if (confidence >= 3) return "Moderate confidence, favorable setup.";
    return "Lower confidence, proceed cautiously.";
  }
  
  private static getProjectionInsight(type: 'Over' | 'Under', projection: number, line: number, diff: number): string {
    if (type === 'Over') {
      return `Model projects ${projection.toFixed(1)} vs line of ${line}.`;
    } else {
      return `Model projects ${projection.toFixed(1)} vs line of ${line}.`;
    }
  }
  
  private static getMarketContext(platform: string, stat: string, type: string): string {
    return `${platform} offering favorable ${type.toLowerCase()} odds on ${stat}.`;
  }
  
  private static getValueAssessment(edge: number, confidence: number): string {
    const combined = edge + confidence;
    if (combined >= 12) return "Excellent value proposition.";
    if (combined >= 9) return "Strong value opportunity.";
    return "Decent value potential.";
  }
  
  private static getTimingContext(gameInfo: string): string {
    if (gameInfo.includes('Tonight') || gameInfo.includes('Today')) {
      return "Prime timing for this prop.";
    }
    return "";
  }
}

export class OddsApiService {
  private apiKey: string;
  private cache: Map<string, CachedData> = new Map();
  private deterministicService: DeterministicCalculationService;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.deterministicService = new DeterministicCalculationService();
  }

  async getWNBAPlayerProps(): Promise<ProcessedProp[]> {
    const cacheKey = 'wnba_props';
    const cached = this.cache.get(cacheKey);
    
    // Return cached data if fresh (within 10 minutes)
    if (cached && Date.now() - cached.timestamp < 600000) {
      console.log('📦 Returning cached WNBA props');
      return cached.data;
    }

    try {
      console.log('🌐 Fetching fresh WNBA props from API');
      
      const url = `https://api.the-odds-api.com/v4/sports/basketball_wnba/odds/?apiKey=${this.apiKey}&regions=us&markets=player_points,player_rebounds,player_assists&oddsFormat=american&bookmakers=draftkings,fanduel,betmgm`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const rawData: OddsApiProp[] = await response.json();
      
      if (!rawData || rawData.length === 0) {
        console.log('⚠️ No WNBA data returned from API');
        return [];
      }

      const processedProps = this.processWNBAProps(rawData);
      
      // Cache the results
      this.cache.set(cacheKey, {
        data: processedProps,
        timestamp: Date.now()
      });

      console.log(`✅ Processed ${processedProps.length} WNBA props`);
      return processedProps;

    } catch (error) {
      console.error('❌ Error fetching WNBA props:', error);
      
      // Return cached data even if stale, or empty array
      const staleCache = this.cache.get(cacheKey);
      return staleCache?.data || [];
    }
  }

  private processWNBAProps(rawData: OddsApiProp[]): ProcessedProp[] {
    const processedProps: ProcessedProp[] = [];

    rawData.forEach(eventOdds => {
      const homeTeam = eventOdds.home_team;
      const awayTeam = eventOdds.away_team;
      const matchup = `${awayTeam} @ ${homeTeam}`;
      
      // Convert commence time
      const gameTime = new Date(eventOdds.commence_time);
      const now = new Date();
      const dayLabel = this.getDayLabel(gameTime, now);
      const gameTimeString = gameTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        timeZone: 'America/New_York'
      });

      eventOdds.bookmakers.forEach(bookmaker => {
        bookmaker.markets.forEach(market => {
          console.log(`    📊 Processing market: ${market.key} for ${bookmaker.title}`);
          
          // Group outcomes by player and stat
          const groups = this.groupOutcomesByPlayerAndStat(market.outcomes, market.key);
          
          groups.forEach(group => {
            // FIXED: Use deterministic calculation instead of random
            const optimalBet = this.createDeterministicOptimalBetFromGroup(
              group, bookmaker, market, eventOdds, matchup, dayLabel, gameTimeString
            );
            
            if (optimalBet) {
              processedProps.push(optimalBet);
            }
          });
        });
      });
    });

    console.log(`📈 Total processed props: ${processedProps.length}`);
    return processedProps;
  }

  // Group outcomes by player and stat to pair Over/Under
  private groupOutcomesByPlayerAndStat(outcomes: any[], marketKey: string): PlayerStatGroup[] {
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

  // FIXED: Replace random createOptimalBetFromGroup with deterministic version
  private createDeterministicOptimalBetFromGroup(
    group: PlayerStatGroup,
    bookmaker: any,
    market: any,
    eventOdds: OddsApiProp,
    matchup: string,
    dayLabel: string,
    gameTimeString: string
  ): ProcessedProp | null {
    
    // STEP 1: Generate DETERMINISTIC projection (NO Math.random())
    const projection = this.deterministicService.generateRealisticProjection(
      group.player,
      group.stat,
      group.line,
      group.overOutcome.price,
      group.underOutcome.price
    );

    console.log(`      🎯 Projection for ${group.player} ${group.stat}: ${projection.toFixed(1)} (line: ${group.line})`);

    // STEP 2: Calculate deterministic edges
    const overEdge = this.deterministicService.calculateDeterministicEdge(
      projection, 
      group.line, 
      'over', 
      group.player + group.stat + 'over'
    );
    
    const underEdge = this.deterministicService.calculateDeterministicEdge(
      projection, 
      group.line, 
      'under', 
      group.player + group.stat + 'under'
    );

    console.log(`      📊 Edges - Over: ${overEdge.edge.toFixed(1)}%, Under: ${underEdge.edge.toFixed(1)}%`);

    // STEP 3: Select optimal side (minimum 2% edge)
    let selectedOutcome: any;
    let selectedType: string;
    let selectedEdge: number;
    let selectedConfidence: number;

    if (overEdge.edge >= 2 && overEdge.edge > underEdge.edge) {
      selectedOutcome = group.overOutcome;
      selectedType = 'Over';
      selectedEdge = overEdge.edge;
      selectedConfidence = overEdge.confidence;
    } else if (underEdge.edge >= 2 && underEdge.edge > overEdge.edge) {
      selectedOutcome = group.underOutcome;
      selectedType = 'Under';
      selectedEdge = underEdge.edge;
      selectedConfidence = underEdge.confidence;
    } else {
      console.log(`      ⚠️ No significant edge found for ${group.player} ${group.stat} - skipping`);
      return null;
    }

    // STEP 4: Get team and prop details
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

    // STEP 5: Generate deterministic insights
    const enhancedInsights = WNBAInsightsGenerator.generateWNBAInsights(
      group.player,
      statKey,
      selectedType as 'Over' | 'Under',
      group.line,
      projection,
      selectedEdge,
      bookmaker.title,
      `${dayLabel} ${gameTimeString}`,
      selectedConfidence
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
      confidence: selectedConfidence,
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

  private getDayLabel(gameTime: Date, now: Date): string {
    const diffTime = gameTime.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    return gameTime.toLocaleDateString();
  }

  // Clear cached data method
  clearCache() {
    this.cache.clear();
    console.log('API cache cleared');
  }
}

export const createOddsApiService = (apiKey: string) => new OddsApiService(apiKey);
