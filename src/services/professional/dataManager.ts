// src/services/professionalDataManager.ts

import { calculationEngine } from './professionalCalculationEngine';
import { wnbaModel, mlbModel } from './sportSpecificModels';

/**
 * Professional Data Manager
 * Implements smart caching, rate limiting, and efficient data aggregation
 */

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum entries
  priority: 'high' | 'medium' | 'low';
}

export interface CachedData<T> {
  data: T;
  timestamp: number;
  expires: number;
  hits: number;
  priority: string;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  retryAfter: number;
}

export interface APIRequest {
  endpoint: string;
  params?: Record<string, any>;
  priority?: number;
  retries?: number;
}

export interface AggregatedGameData {
  game: GameInfo;
  lines: MarketLines;
  props: PlayerProp[];
  marketMovement: LineMovement[];
  publicBetting?: PublicBettingData;
  weather?: WeatherData;
  injuries?: InjuryReport[];
}

export class SmartCache<T = any> {
  private cache: Map<string, CachedData<T>>;
  private readonly defaultTTL: number;
  private readonly maxSize: number;
  
  constructor(defaultTTL: number = 300000, maxSize: number = 1000) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
    this.maxSize = maxSize;
    
    // Periodic cleanup
    setInterval(() => this.cleanup(), 60000); // Every minute
  }
  
  /**
   * Get data from cache with automatic refresh if expired
   */
  async get(
    key: string,
    fetcher?: () => Promise<T>,
    ttl?: number
  ): Promise<T | null> {
    const cached = this.cache.get(key);
    
    if (cached && cached.expires > Date.now()) {
      // Valid cache hit
      cached.hits++;
      return cached.data;
    }
    
    // Cache miss or expired
    if (fetcher) {
      try {
        const data = await fetcher();
        this.set(key, data, ttl);
        return data;
      } catch (error) {
        // Return stale data if available
        if (cached) {
          console.warn(`Using stale cache for ${key} due to fetch error`);
          return cached.data;
        }
        throw error;
      }
    }
    
    return null;
  }
  
  /**
   * Set data in cache with TTL
   */
  set(key: string, data: T, ttl?: number): void {
    const effectiveTTL = ttl || this.defaultTTL;
    const now = Date.now();
    
    // Evict least recently used if at capacity
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expires: now + effectiveTTL,
      hits: 0,
      priority: 'medium'
    });
  }
  
  /**
   * Invalidate cache entries matching pattern
   */
  invalidate(pattern: string | RegExp): number {
    let invalidated = 0;
    
    for (const [key] of this.cache.entries()) {
      if (typeof pattern === 'string' ? key.includes(pattern) : pattern.test(key)) {
        this.cache.delete(key);
        invalidated++;
      }
    }
    
    return invalidated;
  }
  
  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    hitRate: number;
    avgAge: number;
    memoryUsage: number;
  } {
    let totalHits = 0;
    let totalAge = 0;
    let entries = 0;
    
    for (const [, cached] of this.cache.entries()) {
      totalHits += cached.hits;
      totalAge += Date.now() - cached.timestamp;
      entries++;
    }
    
    return {
      size: this.cache.size,
      hitRate: entries > 0 ? totalHits / entries : 0,
      avgAge: entries > 0 ? totalAge / entries : 0,
      memoryUsage: this.estimateMemoryUsage()
    };
  }
  
  private cleanup(): void {
    const now = Date.now();
    let removed = 0;
    
    for (const [key, cached] of this.cache.entries()) {
      if (cached.expires < now) {
        this.cache.delete(key);
        removed++;
      }
    }
    
    if (removed > 0) {
      console.log(`Cache cleanup: removed ${removed} expired entries`);
    }
  }
  
  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruTime = Infinity;
    
    for (const [key, cached] of this.cache.entries()) {
      const lastAccess = cached.timestamp + (cached.hits * 60000); // Weight by usage
      if (lastAccess < lruTime) {
        lruTime = lastAccess;
        lruKey = key;
      }
    }
    
    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }
  
  private estimateMemoryUsage(): number {
    // Rough estimate in bytes
    return this.cache.size * 1024; // Assume 1KB average per entry
  }
}

export class RateLimiter {
  private requests: Map<string, number[]>;
  private config: RateLimitConfig;
  private queue: Array<{
    request: APIRequest;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }>;
  private processing: boolean;
  
  constructor(config: RateLimitConfig) {
    this.requests = new Map();
    this.config = config;
    this.queue = [];
    this.processing = false;
  }
  
  /**
   * Execute request with rate limiting
   */
  async execute<T>(
    request: APIRequest,
    executor: (request: APIRequest) => Promise<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        request: { ...request, priority: request.priority || 0 },
        resolve,
        reject
      });
      
      // Sort queue by priority
      this.queue.sort((a, b) => (b.request.priority || 0) - (a.request.priority || 0));
      
      if (!this.processing) {
        this.processQueue(executor);
      }
    });
  }
  
  private async processQueue<T>(executor: (request: APIRequest) => Promise<T>): Promise<void> {
    this.processing = true;
    
    while (this.queue.length > 0) {
      const { request, resolve, reject } = this.queue.shift()!;
      
      // Check rate limit
      if (!this.canMakeRequest(request.endpoint)) {
        const waitTime = this.getWaitTime(request.endpoint);
        console.log(`Rate limit reached, waiting ${waitTime}ms`);
        await this.delay(waitTime);
      }
      
      // Record request
      this.recordRequest(request.endpoint);
      
      try {
        const result = await executor(request);
        resolve(result);
      } catch (error) {
        // Retry logic
        if (request.retries && request.retries > 0) {
          console.log(`Retrying request, ${request.retries} attempts left`);
          this.queue.unshift({
            request: { ...request, retries: request.retries - 1 },
            resolve,
            reject
          });
        } else {
          reject(error);
        }
      }
      
      // Small delay between requests
      await this.delay(100);
    }
    
    this.processing = false;
  }
  
  private canMakeRequest(endpoint: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(endpoint) || [];
    const recentRequests = requests.filter(time => time > now - this.config.windowMs);
    
    return recentRequests.length < this.config.maxRequests;
  }
  
  private getWaitTime(endpoint: string): number {
    const now = Date.now();
    const requests = this.requests.get(endpoint) || [];
    const windowStart = now - this.config.windowMs;
    const oldestRequest = requests.find(time => time > windowStart);
    
    if (oldestRequest) {
      return this.config.windowMs - (now - oldestRequest) + 100;
    }
    
    return this.config.retryAfter;
  }
  
  private recordRequest(endpoint: string): void {
    const now = Date.now();
    const requests = this.requests.get(endpoint) || [];
    requests.push(now);
    
    // Clean old requests
    const cleaned = requests.filter(time => time > now - this.config.windowMs);
    this.requests.set(endpoint, cleaned);
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export class ProfessionalDataManager {
  private static instance: ProfessionalDataManager;
  private cache: SmartCache;
  private rateLimiter: RateLimiter;
  private apiKey: string;
  
  private constructor() {
    this.cache = new SmartCache(300000, 2000); // 5 min default TTL, 2000 max entries
    this.rateLimiter = new RateLimiter({
      maxRequests: 500, // Odds API limit
      windowMs: 3600000, // 1 hour
      retryAfter: 5000
    });
    this.apiKey = '';
  }
  
  static getInstance(): ProfessionalDataManager {
    if (!ProfessionalDataManager.instance) {
      ProfessionalDataManager.instance = new ProfessionalDataManager();
    }
    return ProfessionalDataManager.instance;
  }
  
  /**
   * Initialize with API key
   */
  initialize(apiKey: string): void {
    this.apiKey = apiKey;
  }
  
  /**
   * Fetch sports data with caching and rate limiting
   */
  async fetchSportsData(
    sport: string,
    markets: string[],
    bookmakers: string[]
  ): Promise<AggregatedGameData[]> {
    const cacheKey = `sports_${sport}_${markets.join('_')}`;
    
    return this.cache.get(cacheKey, async () => {
      // Fetch with rate limiting
      const data = await this.rateLimiter.execute(
        {
          endpoint: `/sports/${sport}/odds`,
          params: { markets, bookmakers },
          priority: sport === 'baseball_mlb' ? 10 : 5
        },
        async (request) => {
          return this.makeAPIRequest(request);
        }
      );
      
      // Process and aggregate data
      return this.aggregateGameData(data);
    }, 300000); // 5 minute cache for odds
  }
  
  /**
   * Fetch player props with intelligent batching
   */
  async fetchPlayerProps(
    sport: string,
    gameIds: string[]
  ): Promise<PlayerProp[]> {
    const props: PlayerProp[] = [];
    
    // Batch requests efficiently
    const batches = this.createBatches(gameIds, 5); // 5 games per request
    
    for (const batch of batches) {
      const batchKey = `props_${sport}_${batch.join('_')}`;
      
      const batchProps = await this.cache.get(batchKey, async () => {
        return this.rateLimiter.execute(
          {
            endpoint: `/sports/${sport}/props`,
            params: { gameIds: batch },
            priority: 8
          },
          async (request) => {
            return this.makeAPIRequest(request);
          }
        );
      }, 180000); // 3 minute cache for props
      
      if (batchProps) {
        props.push(...batchProps);
      }
    }
    
    return props;
  }
  
  /**
   * Fetch real-time line movement
   */
  async fetchLineMovement(
    gameId: string,
    marketType: string
  ): Promise<LineMovement[]> {
    const cacheKey = `lines_${gameId}_${marketType}`;
    
    return this.cache.get(cacheKey, async () => {
      return this.rateLimiter.execute(
        {
          endpoint: `/games/${gameId}/lines`,
          params: { market: marketType },
          priority: 6
        },
        async (request) => {
          // Fetch from multiple sources if needed
          const movements = await this.makeAPIRequest(request);
          
          // Detect sharp action
          return this.analyzeLineMovement(movements);
        }
      );
    }, 60000); // 1 minute cache for line movement
  }
  
  /**
   * Fetch weather data for outdoor games
   */
  async fetchWeatherData(
    venue: string,
    gameTime: Date
  ): Promise<WeatherData> {
    const cacheKey = `weather_${venue}_${gameTime.toISOString()}`;
    
    return this.cache.get(cacheKey, async () => {
      // Use weather API with longer cache for future games
      const hoursUntilGame = (gameTime.getTime() - Date.now()) / 3600000;
      const cacheTTL = hoursUntilGame > 24 ? 21600000 : 3600000; // 6hr or 1hr cache
      
      return this.rateLimiter.execute(
        {
          endpoint: '/weather',
          params: { venue, time: gameTime.toISOString() },
          priority: 3
        },
        async (request) => {
          return this.makeWeatherAPIRequest(venue, gameTime);
        }
      );
    });
  }
  
  /**
   * Aggregate data from multiple sources
   */
  async aggregateMultiSourceData(
    sport: string,
    gameId: string
  ): Promise<AggregatedGameData> {
    // Parallel fetch from multiple sources
    const [gameData, props, movement, weather, injuries] = await Promise.all([
      this.fetchGameData(sport, gameId),
      this.fetchPlayerProps(sport, [gameId]),
      this.fetchLineMovement(gameId, 'all'),
      this.fetchWeatherIfApplicable(sport, gameId),
      this.fetchInjuryReports(sport, gameId)
    ]);
    
    // Calculate derived metrics
    const marketAnalysis = calculationEngine.analyzeMarketMovement(
      movement,
      gameData.publicBettingPercentage
    );
    
    // Process props with projections
    const enhancedProps = await this.enhancePropsWithProjections(
      props,
      sport,
      injuries
    );
    
    return {
      game: gameData,
      lines: gameData.lines,
      props: enhancedProps,
      marketMovement: movement,
      publicBetting: gameData.publicBetting,
      weather: weather,
      injuries: injuries,
      analysis: {
        sharpMoney: marketAnalysis.sharpMoneyDetected,
        reverseLineMovement: marketAnalysis.reverseLineMovement,
        steamMove: marketAnalysis.steamMove,
        marketConsensus: marketAnalysis.marketConsensus
      }
    };
  }
  
  /**
   * Get optimal picks across all sports
   */
  async getOptimalPicks(
    sports: string[],
    config: {
      minEdge: number;
      minConfidence: number;
      maxPicks: number;
      categories: string[];
    }
  ): Promise<OptimalPick[]> {
    const allPicks: OptimalPick[] = [];
    
    // Fetch data for each sport
    for (const sport of sports) {
      const sportKey = `optimal_${sport}_${JSON.stringify(config)}`;
      
      const sportPicks = await this.cache.get(sportKey, async () => {
        // Get all games
        const games = await this.fetchSportsData(
          sport,
          ['spreads', 'totals', 'player_props'],
          ['draftkings', 'fanduel', 'betmgm', 'pointsbet']
        );
        
        // Process each game
        const picks: OptimalPick[] = [];
        
        for (const gameData of games) {
          // Game line picks
          const gameLinePicks = this.processGameLines(gameData, config);
          picks.push(...gameLinePicks);
          
          // Player prop picks
          const propPicks = await this.processPlayerProps(
            gameData,
            sport,
            config
          );
          picks.push(...propPicks);
        }
        
        return picks;
      }, 300000); // 5 minute cache
      
      if (sportPicks) {
        allPicks.push(...sportPicks);
      }
    }
    
    // Sort by edge and confidence
    allPicks.sort((a, b) => {
      const scoreA = a.edge * 0.6 + a.confidence * 0.4;
      const scoreB = b.edge * 0.6 + b.confidence * 0.4;
      return scoreB - scoreA;
    });
    
    // Apply limits per category
    return this.applyPickLimits(allPicks, config);
  }
  
  /**
   * Process game lines for optimal picks
   */
  private processGameLines(
    gameData: AggregatedGameData,
    config: any
  ): OptimalPick[] {
    const picks: OptimalPick[] = [];
    
    // Process spreads
    if (config.categories.includes('spreads')) {
      const spreadAnalysis = this.analyzeSpread(gameData);
      if (spreadAnalysis.edge >= config.minEdge) {
        picks.push(this.createGameLinePick(gameData, spreadAnalysis, 'spread'));
      }
    }
    
    // Process totals
    if (config.categories.includes('totals')) {
      const totalAnalysis = this.analyzeTotal(gameData);
      if (totalAnalysis.edge >= config.minEdge) {
        picks.push(this.createGameLinePick(gameData, totalAnalysis, 'total'));
      }
    }
    
    return picks;
  }
  
  /**
   * Process player props with projections
   */
  private async processPlayerProps(
    gameData: AggregatedGameData,
    sport: string,
    config: any
  ): Promise<OptimalPick[]> {
    const picks: OptimalPick[] = [];
    
    if (!config.categories.includes('player_props')) {
      return picks;
    }
    
    for (const prop of gameData.props) {
      // Get projection based on sport
      let projection: any;
      
      if (sport === 'basketball_wnba') {
        projection = await this.getWNBAProjection(prop, gameData);
      } else if (sport === 'baseball_mlb') {
        projection = await this.getMLBProjection(prop, gameData);
      } else {
        continue; // Skip unsupported sports for now
      }
      
      // Calculate edge
      const edge = calculationEngine.calculateEdge(
        projection.projection,
        prop.line,
        prop.betType,
        prop.odds
      );
      
      if (edge.edge >= config.minEdge && projection.confidence >= config.minConfidence) {
        picks.push(this.createPlayerPropPick(prop, projection, edge, gameData));
      }
    }
    
    return picks;
  }
  
  /**
   * Create batches for efficient API requests
   */
  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    
    return batches;
  }
  
  /**
   * Make API request with error handling
   */
  private async makeAPIRequest(request: APIRequest): Promise<any> {
    const url = `https://api.the-odds-api.com/v4${request.endpoint}`;
    const params = new URLSearchParams({
      apiKey: this.apiKey,
      ...request.params
    });
    
    try {
      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Log remaining requests
      const remaining = response.headers.get('x-requests-remaining');
      if (remaining) {
        console.log(`API requests remaining: ${remaining}`);
      }
      
      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }
  
  /**
   * Aggregate game data from raw API response
   */
  private aggregateGameData(rawData: any[]): AggregatedGameData[] {
    return rawData.map(game => {
      // Extract best lines across bookmakers
      const lines = this.extractBestLines(game.bookmakers);
      
      // Extract player props if available
      const props = this.extractPlayerProps(game.bookmakers);
      
      return {
        game: {
          id: game.id,
          sport: game.sport_title,
          homeTeam: game.home_team,
          awayTeam: game.away_team,
          commenceTime: new Date(game.commence_time)
        },
        lines: lines,
        props: props,
        marketMovement: [],
        publicBetting: undefined,
        weather: undefined,
        injuries: []
      };
    });
  }
  
  /**
   * Extract best lines from bookmaker data
   */
  private extractBestLines(bookmakers: any[]): MarketLines {
    const lines: MarketLines = {
      spread: { home: null, away: null },
      total: { over: null, under: null },
      moneyline: { home: null, away: null }
    };
    
    bookmakers.forEach(bookmaker => {
      bookmaker.markets?.forEach((market: any) => {
        if (market.key === 'spreads') {
          market.outcomes.forEach((outcome: any) => {
            const current = outcome.name === game.home_team ? lines.spread.home : lines.spread.away;
            if (!current || outcome.price > current.odds) {
              const target = outcome.name === game.home_team ? 'home' : 'away';
              lines.spread[target] = {
                line: outcome.point,
                odds: outcome.price,
                bookmaker: bookmaker.title
              };
            }
          });
        }
        // Process other market types...
      });
    });
    
    return lines;
  }
  
  /**
   * Analyze line movement for sharp action
   */
  private analyzeLineMovement(movements: any[]): LineMovement[] {
    return movements.map((movement, index) => {
      const isSharp = index > 0 && 
        Math.abs(movement.line - movements[index - 1].line) >= 0.5 &&
        movement.timestamp - movements[index - 1].timestamp < 3600000;
      
      return {
        timestamp: new Date(movement.timestamp),
        line: movement.line,
        odds: movement.odds,
        volume: movement.volume,
        isSharp: isSharp
      };
    });
  }
  
  /**
   * Get cache statistics for monitoring
   */
  getCacheStats(): any {
    return {
      cache: this.cache.getStats(),
      rateLimiter: {
        queueSize: this.rateLimiter.queue?.length || 0
      }
    };
  }
  
  /**
   * Clear cache for specific pattern
   */
  clearCache(pattern?: string | RegExp): number {
    if (pattern) {
      return this.cache.invalidate(pattern);
    }
    
    // Clear all
    this.cache = new SmartCache(300000, 2000);
    return -1;
  }
}

// Type definitions
export interface GameInfo {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: Date;
}

export interface MarketLines {
  spread: {
    home: LineInfo | null;
    away: LineInfo | null;
  };
  total: {
    over: LineInfo | null;
    under: LineInfo | null;
  };
  moneyline: {
    home: LineInfo | null;
    away: LineInfo | null;
  };
}

export interface LineInfo {
  line: number;
  odds: number;
  bookmaker: string;
}

export interface PlayerProp {
  id: string;
  player: string;
  team: string;
  stat: string;
  line: number;
  betType: 'over' | 'under';
  odds: string;
  bookmaker: string;
}

export interface LineMovement {
  timestamp: Date;
  line: number;
  odds: string;
  volume?: number;
  isSharp?: boolean;
}

export interface PublicBettingData {
  spreadPercentage: { home: number; away: number };
  totalPercentage: { over: number; under: number };
  moneylinePercentage: { home: number; away: number };
  ticketCount: number;
  moneyPercentage: { home: number; away: number };
}

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  humidity: number;
  conditions: string;
}

export interface InjuryReport {
  player: string;
  team: string;
  status: 'out' | 'doubtful' | 'questionable' | 'probable';
  injury: string;
  lastUpdate: Date;
}

export interface OptimalPick {
  id: string;
  sport: string;
  type: 'spread' | 'total' | 'moneyline' | 'player_prop';
  pick: string;
  line: number;
  odds: string;
  edge: number;
  confidence: number;
  kellySize: number;
  factors: string[];
  category: 'lock' | 'strong' | 'value' | 'lottery';
}

// Export singleton instance
export const dataManager = ProfessionalDataManager.getInstance();
