// src/services/professionalCalculationEngine.ts

/**
 * Professional Calculation Engine
 * Implements Billy Walters-inspired methodology with deterministic calculations
 * Replaces all Math.random() with data-driven projections
 */

export interface CalculationFactors {
  // Player factors
  seasonAverage: number;
  last10Games: number;
  vsOpponentAverage: number;
  homeAwayAverage: number;
  
  // Game factors
  pace: number;
  oppDefensiveRating: number;
  oppPositionalDefense: number;
  
  // Environmental factors
  weather?: WeatherConditions;
  venue?: VenueFactors;
  travel?: TravelFactors;
  
  // Market factors
  openingLine: number;
  currentLine: number;
  publicBettingPercentage?: number;
  lineMovementHistory?: LineMovement[];
}

export interface WeatherConditions {
  temperature: number;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  humidity: number;
}

export interface VenueFactors {
  altitude: number;
  parkFactor: number;
  crowdImpact: number;
}

export interface TravelFactors {
  timezone: number;
  restDays: number;
  backToBack: boolean;
}

export interface LineMovement {
  timestamp: Date;
  line: number;
  odds: string;
  volume?: number;
}

export interface ProjectionResult {
  projection: number;
  confidence: number;
  factors: string[];
  weights: { [key: string]: number };
}

export interface EdgeCalculation {
  edge: number;
  trueProbability: number;
  impliedProbability: number;
  expectedValue: number;
}

export interface KellyResult {
  recommendedBetSize: number;
  fractionOfBankroll: number;
  adjustedForRisk: number;
}

export class ProfessionalCalculationEngine {
  private static instance: ProfessionalCalculationEngine;
  
  // Singleton pattern ensures consistent calculations
  static getInstance(): ProfessionalCalculationEngine {
    if (!ProfessionalCalculationEngine.instance) {
      ProfessionalCalculationEngine.instance = new ProfessionalCalculationEngine();
    }
    return ProfessionalCalculationEngine.instance;
  }
  
  /**
   * Calculate player prop projection using multi-factor regression
   */
  calculatePlayerProjection(
    statType: 'points' | 'rebounds' | 'assists' | 'threes' | 'steals' | 'blocks',
    factors: CalculationFactors
  ): ProjectionResult {
    const weights = this.getStatWeights(statType);
    const adjustments = this.calculateAdjustments(factors);
    
    // Base projection from weighted averages
    let projection = 
      factors.seasonAverage * weights.season +
      factors.last10Games * weights.recent +
      factors.vsOpponentAverage * weights.matchup +
      factors.homeAwayAverage * weights.venue;
    
    // Apply defensive adjustments
    const defenseMultiplier = this.calculateDefenseMultiplier(
      factors.oppDefensiveRating,
      factors.oppPositionalDefense
    );
    projection *= defenseMultiplier;
    
    // Apply pace adjustments
    const paceMultiplier = factors.pace / 100; // Normalized to 100
    projection *= paceMultiplier;
    
    // Apply environmental adjustments (if applicable)
    if (factors.weather) {
      projection *= this.getWeatherMultiplier(statType, factors.weather);
    }
    
    // Calculate confidence based on sample size and consistency
    const confidence = this.calculateConfidence(factors);
    
    // Generate human-readable factors
    const factorsList = this.generateFactorsList(factors, adjustments, weights);
    
    return {
      projection: Math.round(projection * 10) / 10,
      confidence,
      factors: factorsList,
      weights
    };
  }
  
  /**
   * Calculate true edge by comparing projection to bookmaker line
   */
  calculateEdge(
    projection: number,
    bookmakerLine: number,
    betType: 'over' | 'under',
    odds: string
  ): EdgeCalculation {
    // Calculate true probability based on projection
    const trueProbability = this.calculateTrueProbability(projection, bookmakerLine, betType);
    
    // Calculate implied probability from odds
    const impliedProbability = this.calculateImpliedProbability(odds);
    
    // Edge is the difference between true and implied probability
    const edge = trueProbability - impliedProbability;
    
    // Calculate expected value
    const expectedValue = this.calculateExpectedValue(
      trueProbability,
      impliedProbability,
      odds
    );
    
    return {
      edge: Math.round(edge * 1000) / 10, // Convert to percentage
      trueProbability,
      impliedProbability,
      expectedValue
    };
  }
  
  /**
   * Calculate optimal bet size using Kelly Criterion
   */
  calculateKellyBetSize(
    edge: EdgeCalculation,
    bankroll: number,
    maxKellyFraction: number = 0.25
  ): KellyResult {
    // Kelly formula: f = (bp - q) / b
    // where f = fraction of bankroll, b = decimal odds - 1, p = win probability, q = loss probability
    const decimalOdds = this.americanToDecimal(edge.impliedProbability);
    const b = decimalOdds - 1;
    const p = edge.trueProbability;
    const q = 1 - p;
    
    let kellyFraction = (b * p - q) / b;
    
    // Apply maximum Kelly fraction for risk management
    kellyFraction = Math.min(kellyFraction, maxKellyFraction);
    
    // Never recommend negative bets
    kellyFraction = Math.max(0, kellyFraction);
    
    // Adjust for confidence and other risk factors
    const riskAdjustedFraction = kellyFraction * this.getRiskMultiplier(edge);
    
    return {
      recommendedBetSize: Math.round(bankroll * riskAdjustedFraction),
      fractionOfBankroll: Math.round(riskAdjustedFraction * 1000) / 10,
      adjustedForRisk: Math.round(riskAdjustedFraction * 1000) / 10
    };
  }
  
  /**
   * Analyze market movement for sharp money indicators
   */
  analyzeMarketMovement(
    lineHistory: LineMovement[],
    publicBettingPercentage?: number
  ): {
    sharpMoneyDetected: boolean;
    reverseLineMovement: boolean;
    steamMove: boolean;
    marketConsensus: 'sharp' | 'public' | 'neutral';
  } {
    if (lineHistory.length < 2) {
      return {
        sharpMoneyDetected: false,
        reverseLineMovement: false,
        steamMove: false,
        marketConsensus: 'neutral'
      };
    }
    
    const openingLine = lineHistory[0].line;
    const currentLine = lineHistory[lineHistory.length - 1].line;
    const lineMovement = currentLine - openingLine;
    
    // Detect reverse line movement
    const reverseLineMovement = publicBettingPercentage 
      ? this.detectReverseLineMovement(lineMovement, publicBettingPercentage)
      : false;
    
    // Detect steam moves (rapid line movement)
    const steamMove = this.detectSteamMove(lineHistory);
    
    // Analyze for sharp money
    const sharpMoneyDetected = reverseLineMovement || steamMove || 
      Math.abs(lineMovement) >= 1.5;
    
    // Determine market consensus
    let marketConsensus: 'sharp' | 'public' | 'neutral' = 'neutral';
    if (sharpMoneyDetected) {
      marketConsensus = 'sharp';
    } else if (publicBettingPercentage && publicBettingPercentage > 70) {
      marketConsensus = 'public';
    }
    
    return {
      sharpMoneyDetected,
      reverseLineMovement,
      steamMove,
      marketConsensus
    };
  }
  
  /**
   * Generate contrarian value score
   */
  calculateContrarianValue(
    publicBettingPercentage: number,
    lineMovement: number,
    currentOdds: string
  ): {
    contrarianValue: number;
    shouldFade: boolean;
    reasoning: string;
  } {
    let contrarianValue = 0;
    const reasons: string[] = [];
    
    // High public betting on one side
    if (publicBettingPercentage > 75) {
      contrarianValue += 30;
      reasons.push(`Heavy public backing (${publicBettingPercentage}%)`);
    } else if (publicBettingPercentage > 65) {
      contrarianValue += 15;
      reasons.push(`Moderate public backing (${publicBettingPercentage}%)`);
    }
    
    // Line moving against public money
    if (publicBettingPercentage > 60 && lineMovement < 0) {
      contrarianValue += 25;
      reasons.push('Reverse line movement detected');
    }
    
    // Good odds on the contrarian side
    const impliedProb = this.calculateImpliedProbability(currentOdds);
    if (impliedProb < 0.45) {
      contrarianValue += 20;
      reasons.push('Favorable contrarian odds');
    }
    
    const shouldFade = contrarianValue >= 50;
    const reasoning = reasons.join('; ');
    
    return {
      contrarianValue,
      shouldFade,
      reasoning
    };
  }
  
  // Private helper methods
  
  private getStatWeights(statType: string): { [key: string]: number } {
    const weights = {
      points: { season: 0.25, recent: 0.45, matchup: 0.20, venue: 0.10 },
      rebounds: { season: 0.30, recent: 0.40, matchup: 0.20, venue: 0.10 },
      assists: { season: 0.30, recent: 0.45, matchup: 0.15, venue: 0.10 },
      threes: { season: 0.35, recent: 0.40, matchup: 0.15, venue: 0.10 },
      steals: { season: 0.40, recent: 0.35, matchup: 0.15, venue: 0.10 },
      blocks: { season: 0.40, recent: 0.35, matchup: 0.15, venue: 0.10 }
    };
    
    return weights[statType] || weights.points;
  }
  
  private calculateDefenseMultiplier(
    oppDefensiveRating: number,
    oppPositionalDefense: number
  ): number {
    // League average is 100, higher is worse defense
    const defenseImpact = (oppDefensiveRating / 100);
    const positionalImpact = (oppPositionalDefense / 100);
    
    // Weight overall defense more than positional
    return (defenseImpact * 0.7) + (positionalImpact * 0.3);
  }
  
  private getWeatherMultiplier(statType: string, weather: WeatherConditions): number {
    // Only affects outdoor sports significantly
    if (statType === 'points' && weather.windSpeed > 20) {
      return 0.95; // Wind affects shooting
    }
    if (weather.temperature < 40) {
      return 0.97; // Cold affects performance
    }
    return 1.0;
  }
  
  private calculateConfidence(factors: CalculationFactors): number {
    let confidence = 50; // Base confidence
    
    // Increase confidence for consistent recent performance
    const consistency = Math.abs(factors.last10Games - factors.seasonAverage) / factors.seasonAverage;
    if (consistency < 0.1) confidence += 20;
    else if (consistency < 0.2) confidence += 10;
    
    // Increase confidence for strong matchup history
    if (factors.vsOpponentAverage > factors.seasonAverage * 1.1) confidence += 15;
    
    // Decrease confidence for high variance
    if (consistency > 0.3) confidence -= 10;
    
    // Cap confidence
    return Math.min(95, Math.max(10, confidence));
  }
  
  private calculateTrueProbability(
    projection: number,
    line: number,
    betType: 'over' | 'under'
  ): number {
    // Use normal distribution to calculate probability
    const variance = projection * 0.15; // Assume 15% standard deviation
    const zScore = (line - projection) / variance;
    
    // Use approximation of normal CDF
    const probability = 1 / (1 + Math.exp(-1.7 * zScore));
    
    return betType === 'over' ? 1 - probability : probability;
  }
  
  private calculateImpliedProbability(odds: string): number {
    const numOdds = parseInt(odds.replace('+', ''));
    
    if (numOdds > 0) {
      // Positive odds
      return 100 / (numOdds + 100);
    } else {
      // Negative odds
      return Math.abs(numOdds) / (Math.abs(numOdds) + 100);
    }
  }
  
  private calculateExpectedValue(
    trueProbability: number,
    impliedProbability: number,
    odds: string
  ): number {
    const numOdds = parseInt(odds.replace('+', ''));
    const payoff = numOdds > 0 ? numOdds / 100 : 100 / Math.abs(numOdds);
    
    return (trueProbability * payoff) - (1 - trueProbability);
  }
  
  private americanToDecimal(impliedProbability: number): number {
    return 1 / impliedProbability;
  }
  
  private getRiskMultiplier(edge: EdgeCalculation): number {
    // Reduce bet size for lower confidence edges
    if (edge.edge < 5) return 0.5;
    if (edge.edge < 10) return 0.75;
    return 1.0;
  }
  
  private detectReverseLineMovement(
    lineMovement: number,
    publicBettingPercentage: number
  ): boolean {
    // Line moves opposite to public money
    return (publicBettingPercentage > 60 && lineMovement < -0.5) ||
           (publicBettingPercentage < 40 && lineMovement > 0.5);
  }
  
  private detectSteamMove(lineHistory: LineMovement[]): boolean {
    if (lineHistory.length < 3) return false;
    
    // Check for rapid movement in short time
    const recentMoves = lineHistory.slice(-3);
    const timeDiff = recentMoves[2].timestamp.getTime() - recentMoves[0].timestamp.getTime();
    const lineChange = Math.abs(recentMoves[2].line - recentMoves[0].line);
    
    // Steam if 1+ point move in less than 1 hour
    return timeDiff < 3600000 && lineChange >= 1;
  }
  
  private generateFactorsList(
    factors: CalculationFactors,
    adjustments: any,
    weights: { [key: string]: number }
  ): string[] {
    const factorsList: string[] = [];
    
    // Recent performance
    factorsList.push(`L10 avg: ${factors.last10Games} (${(weights.recent * 100).toFixed(0)}% weight)`);
    
    // Matchup history
    if (factors.vsOpponentAverage !== factors.seasonAverage) {
      const diff = ((factors.vsOpponentAverage - factors.seasonAverage) / factors.seasonAverage * 100).toFixed(1);
      factorsList.push(`vs Opp: ${diff > 0 ? '+' : ''}${diff}% historical`);
    }
    
    // Pace factor
    if (factors.pace !== 100) {
      factorsList.push(`Pace: ${factors.pace > 100 ? '+' : ''}${(factors.pace - 100).toFixed(1)}%`);
    }
    
    // Defense rating
    if (factors.oppDefensiveRating !== 100) {
      factorsList.push(`Opp Def: ${factors.oppDefensiveRating} rating`);
    }
    
    return factorsList;
  }
  
  private calculateAdjustments(factors: CalculationFactors): any {
    return {
      pace: factors.pace / 100,
      defense: this.calculateDefenseMultiplier(
        factors.oppDefensiveRating,
        factors.oppPositionalDefense
      ),
      venue: factors.venue ? factors.venue.crowdImpact : 1.0,
      weather: factors.weather ? this.getWeatherMultiplier('default', factors.weather) : 1.0
    };
  }
}

// Export singleton instance
export const calculationEngine = ProfessionalCalculationEngine.getInstance();
