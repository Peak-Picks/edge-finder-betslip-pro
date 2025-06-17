// src/services/apiManager.ts
import { professionalPicksService } from './professional/picksService';
import { dataManager } from './professional/dataManager';

interface RefreshResult {
  success: boolean;
  message: string;
  dataCount: number;
}

class ApiManager {
  private apiKey: string = '';
  private isInitialized: boolean = false;

  /**
   * Initialize the API manager with Odds API key
   */
  initialize(apiKey: string): void {
    if (!apiKey) {
      console.error('❌ No API key provided to ApiManager');
      return;
    }

    this.apiKey = apiKey;
    
    try {
      // Initialize professional services
      dataManager.initialize(apiKey);
      professionalPicksService.initialize(apiKey);
      
      this.isInitialized = true;
      console.log('✅ Professional API Manager initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize API Manager:', error);
      this.isInitialized = false;
    }
  }

  /**
   * Check if API manager is ready
   */
  isReady(): boolean {
    return this.isInitialized && this.apiKey !== '';
  }

  /**
   * Manual refresh of all data
   */
  async manualRefresh(): Promise<RefreshResult> {
    if (!this.isReady()) {
      return {
        success: false,
        message: 'API Manager not initialized. Please check your API key.',
        dataCount: 0
      };
    }

    try {
      console.log('🔄 Starting professional data refresh...');
      
      // Clear cache for fresh data
      dataManager.clearCache(/sports/);
      
      // Fetch new picks for all enabled sports
      const picks = await professionalPicksService.getBestBets();
      const playerProps = await professionalPicksService.getPlayerProps();
      const gameLines = await professionalPicksService.getGameLines();
      
      const totalPicks = picks.length + playerProps.length + gameLines.length;
      
      console.log(`✅ Refresh complete: ${totalPicks} total picks`);
      console.log(`   - Best Bets: ${picks.length}`);
      console.log(`   - Player Props: ${playerProps.length}`);
      console.log(`   - Game Lines: ${gameLines.length}`);
      
      return {
        success: true,
        message: `Successfully refreshed ${totalPicks} picks`,
        dataCount: totalPicks
      };
    } catch (error) {
      console.error('💥 Error during refresh:', error);
      return {
        success: false,
        message: `Refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        dataCount: 0
      };
    }
  }

  /**
   * Get data status for UI display
   */
  getDataStatus(): {
    hasData: boolean;
    lastUpdate: string | null;
    dataCount: number;
    cacheStats: any;
  } {
    const cacheStats = dataManager.getCacheStats();
    
    return {
      hasData: cacheStats.cache.size > 0,
      lastUpdate: new Date().toLocaleString(),
      dataCount: cacheStats.cache.size,
      cacheStats: cacheStats
    };
  }

  /**
   * Clear all cached data
   */
  clearData(): void {
    dataManager.clearCache();
    console.log('🗑️ All cached data cleared');
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<{success: boolean; message: string}> {
    if (!this.isReady()) {
      return {
        success: false,
        message: 'API not initialized'
      };
    }

    try {
      // Test by fetching minimal data
      const testData = await dataManager.fetchSportsData(
        'basketball_wnba',
        ['spreads'],
        ['draftkings']
      );
      
      return {
        success: true,
        message: `API connection successful. Found ${testData.length} games.`
      };
    } catch (error) {
      return {
        success: false,
        message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get API usage statistics
   */
  getApiUsage(): {
    requestsRemaining: number | null;
    cacheHitRate: number;
    activeSports: string[];
  } {
    const cacheStats = dataManager.getCacheStats();
    
    return {
      requestsRemaining: null, // Would be populated from API response headers
      cacheHitRate: cacheStats.cache.hitRate,
      activeSports: ['basketball_wnba', 'baseball_mlb']
    };
  }
}

// Create singleton instance
export const apiManager = new ApiManager();
