export interface BetOption {
  id: string;
  player: string;
  team: string;
  stat: string;
  line: number;
  type: 'Over' | 'Under';
  odds: string;
  edge: number;
  projection: number;
  confidence: number;
  platform: string;
}

export class BestBetOptimizer {
  private calculateBetStrength(bet: BetOption): number {
    const { edge, confidence, projection, line, type } = bet;
    
    const edgeScore = edge * 0.4;
    const confidenceScore = (confidence / 5) * 10 * 0.3;
    
    const projectionDistance = Math.abs(projection - line);
    const isProjectionFavorable = type === 'Over' ? projection > line : projection < line;
    const distanceScore = isProjectionFavorable ? projectionDistance * 3 * 0.3 : 0;
    
    const edgeBonus = edge > 8 ? 2 : edge > 5 ? 1 : 0;
    const oddsValue = this.parseOdds(bet.odds);
    const oddsPenalty = oddsValue < -200 ? -1 : 0;
    
    const totalStrength = edgeScore + confidenceScore + distanceScore + edgeBonus + oddsPenalty;
    return Math.round(totalStrength * 100) / 100;
  }
  
  private parseOdds(odds: string): number {
    const cleanOdds = odds.replace(/[+\s]/g, '');
    return parseInt(cleanOdds) || 0;
  }
  
  private createBetKey(bet: BetOption): string {
    return `${bet.player.toLowerCase()}-${bet.stat.toLowerCase()}-${bet.line}`;
  }
  
  filterToStrongestBets(bets: BetOption[]): BetOption[] {
    const betGroups = new Map<string, BetOption[]>();
    
    bets.forEach(bet => {
      const key = this.createBetKey(bet);
      if (!betGroups.has(key)) {
        betGroups.set(key, []);
      }
      betGroups.get(key)!.push(bet);
    });
    
    const strongestBets: BetOption[] = [];
    
    betGroups.forEach((groupBets, key) => {
      if (groupBets.length === 1) {
        strongestBets.push(groupBets[0]);
      } else {
        let strongestBet = groupBets[0];
        let highestStrength = this.calculateBetStrength(groupBets[0]);
        
        groupBets.forEach(bet => {
          const strength = this.calculateBetStrength(bet);
          if (strength > highestStrength) {
            strongestBet = bet;
            highestStrength = strength;
          }
        });
        
        (strongestBet as any).strengthScore = highestStrength;
        strongestBets.push(strongestBet);
      }
    });
    
    return strongestBets;
  }
  
  filterToStrongestBetsWithThreshold(bets: BetOption[], minEdge: number = 2): BetOption[] {
    const qualifyingBets = bets.filter(bet => bet.edge >= minEdge);
    return this.filterToStrongestBets(qualifyingBets);
  }
  
  getBetSelectionReason(selectedBet: BetOption, alternativeBets: BetOption[]): string {
    const strength = this.calculateBetStrength(selectedBet);
    const { edge, confidence, projection, line, type } = selectedBet;
    
    let reason = `Selected ${type} ${line} (${edge}% edge, ${confidence}/5 confidence). `;
    
    if (projection !== undefined) {
      const projectionDiff = Math.abs(projection - line);
      reason += `Our model projects ${projection.toFixed(1)} vs line ${line} (${projectionDiff.toFixed(1)} ${type === 'Over' ? 'above' : 'below'}). `;
    }
    
    if (alternativeBets.length > 0) {
      const altBet = alternativeBets[0];
      const altStrength = this.calculateBetStrength(altBet);
      reason += `Chosen over ${altBet.type} ${altBet.line} (${altBet.edge}% edge) - ${(strength - altStrength).toFixed(1)} strength advantage.`;
    }
    
    return reason;
  }
}

function extractStatType(title: string): string {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('point')) return 'points';
  if (lowerTitle.includes('assist')) return 'assists';
  if (lowerTitle.includes('rebound')) return 'rebounds';
  if (lowerTitle.includes('steal')) return 'steals';
  if (lowerTitle.includes('block')) return 'blocks';
  if (lowerTitle.includes('three') || lowerTitle.includes('3pt')) return 'threes';
  return 'other';
}

export function enhanceWNBADataProcessing(wnbaProps: any[]): any[] {
  const optimizer = new BestBetOptimizer();
  const playerStatGroups = new Map<string, any[]>();
  
  wnbaProps.forEach(prop => {
    const key = `${prop.player}-${extractStatType(prop.title)}-${prop.line}`;
    if (!playerStatGroups.has(key)) {
      playerStatGroups.set(key, []);
    }
    playerStatGroups.get(key)!.push(prop);
  });
  
  const optimizedProps: any[] = [];
  
  playerStatGroups.forEach((props, key) => {
    if (props.length === 1) {
      optimizedProps.push(props[0]);
    } else {
      let strongest = props[0];
      let highestStrength = optimizer.calculateBetStrength({
        id: props[0].id,
        player: props[0].player,
        team: props[0].team,
        stat: extractStatType(props[0].title),
        line: props[0].line,
        type: props[0].type,
        odds: props[0].odds,
        edge: props[0].edge,
        projection: props[0].projected,
        confidence: props[0].confidence,
        platform: props[0].platform
      });
      
      props.forEach(prop => {
        const strength = optimizer.calculateBetStrength({
          id: prop.id,
          player: prop.player,
          team: prop.team,
          stat: extractStatType(prop.title),
          line: prop.line,
          type: prop.type,
          odds: prop.odds,
          edge: prop.edge,
          projection: prop.projected,
          confidence: prop.confidence,
          platform: prop.platform
        });
        
        if (strength > highestStrength) {
          strongest = prop;
          highestStrength = strength;
        }
      });
      
      const alternatives = props.filter(p => p.id !== strongest.id);
      const reasoning = optimizer.getBetSelectionReason(
        {
          id: strongest.id,
          player: strongest.player,
          team: strongest.team,
          stat: extractStatType(strongest.title),
          line: strongest.line,
          type: strongest.type,
          odds: strongest.odds,
          edge: strongest.edge,
          projection: strongest.projected,
          confidence: strongest.confidence,
          platform: strongest.platform
        },
        alternatives.map(alt => ({
          id: alt.id,
          player: alt.player,
          team: alt.team,
          stat: extractStatType(alt.title),
          line: alt.line,
          type: alt.type,
          odds: alt.odds,
          edge: alt.edge,
          projection: alt.projected,
          confidence: alt.confidence,
          platform: alt.platform
        }))
      );
      
      strongest.insights += ` Model Selection: ${reasoning}`;
      optimizedProps.push(strongest);
    }
  });
  
  console.log(`🎯 Optimized ${wnbaProps.length} props to ${optimizedProps.length} strongest bets`);
  return optimizedProps;
}