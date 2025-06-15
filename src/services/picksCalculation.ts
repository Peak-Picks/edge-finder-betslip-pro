
export interface PlayerStats {
  playerId: string;
  name: string;
  team: string;
  position: string;
  seasonAverages: {
    points?: number;
    rebounds?: number;
    assists?: number;
    passingYards?: number;
    passingTDs?: number;
    shots?: number;
  };
  last10Games: {
    points?: number;
    rebounds?: number;
    assists?: number;
    passingYards?: number;
    passingTDs?: number;
    shots?: number;
  };
  vsOpponent: {
    points?: number;
    rebounds?: number;
    assists?: number;
    passingYards?: number;
    passingTDs?: number;
    shots?: number;
  };
}

export interface GameData {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  gameTime: string;
  sport: 'nba' | 'nfl' | 'nhl';
  venue: string;
  weather?: string;
  injuries: string[];
  teamStats: {
    [team: string]: {
      offensiveRating: number;
      defensiveRating: number;
      pace: number;
      homeAdvantage: number;
    };
  };
}

export interface BookmakerLine {
  bookmaker: string;
  type: 'spread' | 'total' | 'moneyline' | 'player_prop';
  line: number;
  odds: string;
  prop?: string;
  player?: string;
}

export class PicksCalculationEngine {
  // Calculate edge by comparing our projection to bookmaker line
  calculateEdge(ourProjection: number, bookmakerLine: number, type: 'over' | 'under' = 'over'): number {
    const difference = type === 'over' 
      ? ourProjection - bookmakerLine 
      : bookmakerLine - ourProjection;
    
    // Convert difference to edge percentage (simplified model)
    const edgePercentage = (difference / bookmakerLine) * 100;
    return Math.max(0, Math.min(25, edgePercentage)); // Cap at 25%
  }

  // Calculate confidence based on multiple factors
  calculateConfidence(edge: number, sampleSize: number, consistency: number): 'low' | 'medium' | 'high' {
    const confidenceScore = (edge * 0.4) + (sampleSize * 0.3) + (consistency * 0.3);
    
    if (confidenceScore >= 15) return 'high';
    if (confidenceScore >= 8) return 'medium';
    return 'low';
  }

  // Player prop calculations
  calculatePlayerProp(player: PlayerStats, prop: string, opponent: string, gameData: GameData): {
    projection: number;
    confidence: number;
    factors: string[];
  } {
    const factors: string[] = [];
    let projection = 0;
    let confidenceFactors = 0;

    switch (prop.toLowerCase()) {
      case 'points':
        // Weight recent performance more heavily
        projection = (player.last10Games.points || 0) * 0.5 + 
                    (player.seasonAverages.points || 0) * 0.3 +
                    (player.vsOpponent.points || 0) * 0.2;
        
        factors.push(`Averaging ${player.last10Games.points} in last 10 games`);
        factors.push(`${player.vsOpponent.points} average vs ${opponent}`);
        
        // Adjust for opponent defense
        const oppDefRating = gameData.teamStats[opponent]?.defensiveRating || 100;
        if (oppDefRating < 95) {
          projection *= 0.9; // Tough defense
          factors.push("Opponent has strong defense");
        } else if (oppDefRating > 110) {
          projection *= 1.1; // Weak defense
          factors.push("Opponent allows high scoring");
        }
        
        confidenceFactors = 8;
        break;

      case 'rebounds':
        projection = (player.last10Games.rebounds || 0) * 0.6 + 
                    (player.seasonAverages.rebounds || 0) * 0.4;
        factors.push(`${player.last10Games.rebounds} rebounds in last 10`);
        confidenceFactors = 7;
        break;

      case 'assists':
        projection = (player.last10Games.assists || 0) * 0.6 + 
                    (player.seasonAverages.assists || 0) * 0.4;
        factors.push(`Team pace affects assist opportunities`);
        confidenceFactors = 6;
        break;

      case 'passing_yards':
        projection = (player.last10Games.passingYards || 0) * 0.5 + 
                    (player.seasonAverages.passingYards || 0) * 0.5;
        factors.push(`Weather conditions: ${gameData.weather || 'Clear'}`);
        confidenceFactors = 9;
        break;

      case 'passing_tds':
        projection = (player.last10Games.passingTDs || 0) * 0.6 + 
                    (player.seasonAverages.passingTDs || 0) * 0.4;
        factors.push(`Red zone efficiency considered`);
        confidenceFactors = 7;
        break;
    }

    return {
      projection: Math.round(projection * 10) / 10,
      confidence: confidenceFactors,
      factors
    };
  }

  // Game-based calculations (spreads, totals, etc.)
  calculateGameProp(gameData: GameData, propType: 'spread' | 'total' | 'moneyline'): {
    projection: number;
    confidence: number;
    factors: string[];
  } {
    const factors: string[] = [];
    let projection = 0;
    let confidence = 8;

    const homeStats = gameData.teamStats[gameData.homeTeam];
    const awayStats = gameData.teamStats[gameData.awayTeam];

    switch (propType) {
      case 'spread':
        // Calculate expected point differential
        const homeAdv = homeStats.homeAdvantage || 3;
        const offensiveDiff = homeStats.offensiveRating - awayStats.offensiveRating;
        const defensiveDiff = awayStats.defensiveRating - homeStats.defensiveRating;
        
        projection = (offensiveDiff + defensiveDiff) / 2 + homeAdv;
        factors.push(`Home advantage: +${homeAdv} points`);
        factors.push(`Offensive rating differential: ${offensiveDiff.toFixed(1)}`);
        break;

      case 'total':
        // Calculate expected total points
        const avgPace = (homeStats.pace + awayStats.pace) / 2;
        const avgOffense = (homeStats.offensiveRating + awayStats.offensiveRating) / 2;
        const avgDefense = (homeStats.defensiveRating + awayStats.defensiveRating) / 2;
        
        projection = (avgPace * avgOffense * 2) / avgDefense;
        factors.push(`Combined pace: ${avgPace.toFixed(1)}`);
        factors.push(`Offensive efficiency: ${avgOffense.toFixed(1)}`);
        break;

      case 'moneyline':
        // Convert spread to moneyline probability
        const spreadProj = this.calculateGameProp(gameData, 'spread').projection;
        projection = 50 + (spreadProj * 2); // Simplified conversion
        factors.push(`Based on projected spread: ${spreadProj.toFixed(1)}`);
        break;
    }

    return {
      projection: Math.round(projection * 10) / 10,
      confidence,
      factors
    };
  }

  // Generate insights text
  generateInsights(factors: string[], edge: number, confidence: string): string {
    const baseInsight = factors.slice(0, 3).join('. ') + '.';
    const edgeNote = edge > 5 ? ` Strong ${edge.toFixed(1)}% edge detected.` : '';
    const confidenceNote = confidence === 'high' ? ' High confidence pick.' : '';
    
    return baseInsight + edgeNote + confidenceNote;
  }
}
