import { ProfessionalPick } from './picksService';
import { GeneratedPick } from '../dynamicPicksGenerator';

export class FormatAdapter {
  /**
   * Convert professional pick to legacy format for UI compatibility
   */
  static toGeneratedPick(pick: ProfessionalPick): GeneratedPick {
    // Extract player name from pick description
    const playerName = pick.type === 'player_prop' 
      ? pick.pick.split(' ')[0] 
      : pick.pick.split(' ')[0];
    
    // Determine team
    const team = pick.type === 'player_prop'
      ? pick.pick.split(' - ')[1] || pick.sport
      : pick.pick.split(' ')[0];
    
    // Convert confidence from percentage to 1-5 scale
    const confidence = Math.min(5, Math.max(1, Math.round(pick.confidence / 20)));
    
    // Map category
    const categoryMap = {
      'lock': 'Best Bet',
      'strong': 'Top Prop',
      'value': 'Player Prop',
      'lottery': 'Long Shot'
    };
    
    return {
      id: pick.id,
      player: playerName,
      team: team,
      title: pick.pick,
      sport: pick.sport,
      game: pick.gameTime.toLocaleString(),
      description: pick.description,
      odds: pick.odds,
      platform: pick.platform,
      confidence: confidence,
      insights: pick.insights,
      category: categoryMap[pick.category] || 'Player Prop',
      edge: pick.edge,
      type: pick.type === 'player_prop' ? 'Player Prop' : 'Game Line',
      matchup: pick.gameTime.toLocaleDateString(),
      gameTime: pick.gameTime.toLocaleString(),
      line: pick.line,
      projected: pick.projection
    };
  }
  
  /**
   * Convert array of professional picks
   */
  static toGeneratedPicks(picks: ProfessionalPick[]): GeneratedPick[] {
    return picks.map(pick => this.toGeneratedPick(pick));
  }
}
