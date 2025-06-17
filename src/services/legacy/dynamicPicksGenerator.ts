import { unifiedPicksService } from './professional/unifiedPicksService';
import { FormatAdapter } from './professional/adapter';

export interface GeneratedPick {
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

class DynamicPicksGenerator {
  private isInitialized: boolean = false;

  initializeWithApiKey(apiKey: string) {
    // This is now handled by apiManager
    this.isInitialized = true;
  }

  async generateBestBets(): Promise<GeneratedPick[]> {
    try {
      const allPicks = await unifiedPicksService.getAllPicks();
      return FormatAdapter.toGeneratedPicks(allPicks.bestBets);
    } catch (error) {
      console.error('Error generating best bets:', error);
      return [];
    }
  }

  async generatePlayerProps(): Promise<GeneratedPick[]> {
    try {
      const allPicks = await unifiedPicksService.getAllPicks();
      return FormatAdapter.toGeneratedPicks(allPicks.playerProps);
    } catch (error) {
      console.error('Error generating player props:', error);
      return [];
    }
  }

  async generateLongShots(): Promise<GeneratedPick[]> {
    try {
      const allPicks = await unifiedPicksService.getAllPicks();
      return FormatAdapter.toGeneratedPicks(allPicks.longShots);
    } catch (error) {
      console.error('Error generating long shots:', error);
      return [];
    }
  }

  async generateGameBasedPicks(): Promise<GeneratedPick[]> {
    try {
      const allPicks = await unifiedPicksService.getAllPicks();
      return FormatAdapter.toGeneratedPicks(allPicks.gameLines);
    } catch (error) {
      console.error('Error generating game picks:', error);
      return [];
    }
  }

  hasStoredWNBAData(): boolean {
    return true; // Always return true since we're using the unified service
  }

  getLastUpdateTime(): string | null {
    const status = unifiedPicksService.getAllPicks();
    return new Date().toLocaleString();
  }

  clearStoredData(): void {
    // Handled by data manager
  }

  refreshAllPicks(): void {
    unifiedPicksService.forceRefresh();
  }
}

export const dynamicPicksGenerator = new DynamicPicksGenerator();
