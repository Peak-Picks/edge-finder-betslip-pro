
// apiManager.ts - Handles API initialization and manual refresh
import { dynamicPicksGenerator } from './dynamicPicksGenerator';

export class ApiManager {
  private apiKey: string | null = null;
  private isInitialized: boolean = false;

  // Initialize the API service with your Odds API key
  initialize(apiKey: string): void {
    this.apiKey = apiKey;
    dynamicPicksGenerator.setApiKey(apiKey);
    this.isInitialized = true;
    console.log('🚀 API Manager initialized with Odds API');
  }

  // Check if API is properly initialized
  isReady(): boolean {
    return this.isInitialized && this.apiKey !== null;
  }

  // Manual refresh function to be called by the refresh button
  async manualRefresh(): Promise<{success: boolean; message: string; dataCount: number}> {
    if (!this.isReady()) {
      return {
        success: false,
        message: 'API not initialized. Please set your Odds API key first.',
        dataCount: 0
      };
    }

    try {
      console.log('🔄 Starting manual refresh of WNBA data...');
      
      // Force refresh WNBA data from API
      await dynamicPicksGenerator.refreshWNBAData(true);
      
      // Check if we have data now
      const hasData = dynamicPicksGenerator.hasStoredWNBAData();
      const lastUpdate = dynamicPicksGenerator.getLastUpdateTime();
      
      if (hasData) {
        console.log('✅ Manual refresh completed successfully');
        return {
          success: true,
          message: `WNBA data refreshed at ${lastUpdate}`,
          dataCount: this.getStoredDataCount()
        };
      } else {
        console.log('⚠️ No WNBA data available after refresh');
        return {
          success: false,
          message: 'No WNBA games or props currently available. Try again later.',
          dataCount: 0
        };
      }
    } catch (error) {
      console.error('💥 Error during manual refresh:', error);
      return {
        success: false,
        message: `Refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        dataCount: 0
      };
    }
  }

  // Get count of stored data for display
  private getStoredDataCount(): number {
    try {
      const stored = window.__wnbaStoredData;
      if (!stored) return 0;
      
      return (stored.bestBets?.length || 0) + 
             (stored.gamePicks?.length || 0) + 
             (stored.longShots?.length || 0) + 
             (stored.playerProps?.length || 0);
    } catch {
      return 0;
    }
  }

  // Get data status for UI display
  getDataStatus(): {
    hasData: boolean;
    lastUpdate: string | null;
    dataCount: number;
  } {
    return {
      hasData: dynamicPicksGenerator.hasStoredWNBAData(),
      lastUpdate: dynamicPicksGenerator.getLastUpdateTime(),
      dataCount: this.getStoredDataCount()
    };
  }

  // Clear all stored data
  clearData(): void {
    dynamicPicksGenerator.clearStoredData();
    console.log('🗑️ All stored WNBA data cleared');
  }

  // Test API connection without storing data
  async testConnection(): Promise<{success: boolean; message: string}> {
    if (!this.isReady()) {
      return {
        success: false,
        message: 'API not initialized'
      };
    }

    try {
      // Test by checking upcoming games without storing
      const oddsService = dynamicPicksGenerator['oddsApiService'];
      if (oddsService) {
        await oddsService.checkUpcomingGames();
        return {
          success: true,
          message: 'API connection successful'
        };
      } else {
        return {
          success: false,
          message: 'Odds service not available'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

// Create singleton instance
export const apiManager = new ApiManager();

// Usage instructions:
/*
1. In your app initialization (e.g., App.tsx or main component):
   import { apiManager } from './services/apiManager';
   apiManager.initialize('YOUR_ODDS_API_KEY_HERE');

2. For the refresh button in your UI components:
   const handleRefresh = async () => {
     const result = await apiManager.manualRefresh();
     if (result.success) {
       console.log(result.message);
       // Update UI state to show new data
     } else {
       console.error(result.message);
       // Show error to user
     }
   };

3. To check data status in your components:
   const status = apiManager.getDataStatus();
   console.log(`Has data: ${status.hasData}, Last update: ${status.lastUpdate}`);
*/
