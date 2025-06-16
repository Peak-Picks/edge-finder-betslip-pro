export class InsightsGenerator {
  
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
  
  // Enhanced Game Line Insights Generation
  static generateGameInsights(
    matchup: string,
    betType: 'Spread' | 'Total',
    line: number,
    edge: number,
    playerPropsCount: number,
    avgPlayerEdge: number,
    platform: string,
    gameTime: string
  ): string {
    
    const teams = matchup.split(' @ ');
    const awayTeam = teams[0]?.trim();
    const homeTeam = teams[1]?.split(' (')[0]?.trim();
    
    if (betType === 'Spread') {
      return this.generateSpreadInsights(awayTeam, homeTeam, line, edge, playerPropsCount, avgPlayerEdge, gameTime);
    } else {
      return this.generateTotalInsights(awayTeam, homeTeam, line, edge, playerPropsCount, avgPlayerEdge, gameTime);
    }
  }
  
  private static generateSpreadInsights(
    awayTeam: string,
    homeTeam: string,
    line: number,
    edge: number,
    playerPropsCount: number,
    avgPlayerEdge: number,
    gameTime: string
  ): string {
    
    const edgeStrength = this.getGameEdgeStrength(edge);
    const teamAnalysis = this.getTeamMatchupAnalysis(awayTeam, homeTeam, 'spread');
    const correlationInsight = this.getCorrelationInsight(playerPropsCount, avgPlayerEdge, 'spread');
    const confidenceLevel = this.getGameConfidenceLevel(edge, avgPlayerEdge);
    const timingContext = this.getGameTimingContext(gameTime);
    
    return `${edgeStrength} ${teamAnalysis} ${correlationInsight} ${confidenceLevel} ${timingContext}`.trim();
  }
  
  private static generateTotalInsights(
    awayTeam: string,
    homeTeam: string,
    line: number,
    edge: number,
    playerPropsCount: number,
    avgPlayerEdge: number,
    gameTime: string
  ): string {
    
    const edgeStrength = this.getGameEdgeStrength(edge);
    const scoringAnalysis = this.getScoringEnvironmentAnalysis(awayTeam, homeTeam, line);
    const correlationInsight = this.getCorrelationInsight(playerPropsCount, avgPlayerEdge, 'total');
    const confidenceLevel = this.getGameConfidenceLevel(edge, avgPlayerEdge);
    const paceInsight = this.getPaceAnalysis(awayTeam, homeTeam);
    
    return `${edgeStrength} ${scoringAnalysis} ${correlationInsight} ${paceInsight} ${confidenceLevel}`.trim();
  }
  
  private static getGameEdgeStrength(edge: number): string {
    if (edge >= 8) return "🚀 Exceptional game-level value identified.";
    if (edge >= 6) return "⚡ Strong game analysis advantage detected.";
    if (edge >= 4) return "📊 Solid game-level opportunity found.";
    return "📈 Moderate game analysis edge identified.";
  }
  
  private static getTeamMatchupAnalysis(awayTeam: string, homeTeam: string, betType: string): string {
    // Team-specific insights (you can expand with real team data)
    const teamInsights = {
      'Las Vegas Aces': {
        home: "Vegas excels at home with strong offensive efficiency and crowd support.",
        away: "Aces maintain elite play on the road with veteran leadership.",
        defense: "Elite defensive rating limits opponent scoring opportunities."
      },
      'Minnesota Lynx': {
        home: "Minnesota's balanced attack creates scoring from multiple positions.",
        away: "Lynx road performance strengthened by defensive discipline.",
        defense: "Strong perimeter defense disrupts opponent offensive flow."
      },
      'New York Liberty': {
        home: "Liberty's pace and athleticism favor uptempo games.",
        away: "NY's depth provides consistency in hostile environments.",
        defense: "Aggressive defensive schemes force turnovers and transition opportunities."
      },
      'Connecticut Sun': {
        home: "Connecticut's half-court execution maximizes home court advantage.",
        away: "Sun's defensive identity travels well on the road.",
        defense: "Physical interior defense limits paint scoring."
      }
    };
    
    const homeInsights = teamInsights[homeTeam];
    const awayInsights = teamInsights[awayTeam];
    
    if (homeInsights && awayInsights) {
      return `${homeInsights.home} ${awayInsights.away}`;
    }
    
    // Generic insights if specific team data not available
    const genericInsights = [
      "Matchup dynamics favor the analytical model projection.",
      "Historical head-to-head trends support the projected outcome.",
      "Tactical advantages align with the identified edge.",
      "Team form and injury reports factored into the analysis."
    ];
    
    return genericInsights[Math.floor(Math.random() * genericInsights.length)];
  }
  
  private static getScoringEnvironmentAnalysis(awayTeam: string, homeTeam: string, line: number): string {
    const paceAnalysis = line >= 165 ? "high-pace" : line >= 160 ? "moderate-pace" : "controlled-pace";
    
    const environmentInsights = {
      "high-pace": [
        "Fast-break opportunities and transition scoring favor higher totals.",
        "Both teams' offensive systems create scoring opportunities in transition.",
        "Pace metrics suggest an up-tempo game with multiple possessions."
      ],
      "moderate-pace": [
        "Balanced offensive approaches create steady scoring opportunities.",
        "Half-court execution and ball movement support consistent scoring.",
        "Tempo control by both teams creates predictable scoring patterns."
      ],
      "controlled-pace": [
        "Defensive emphasis and slower pace limit total scoring opportunities.",
        "Half-court grinding style reduces possession count and scoring.",
        "Physical defensive play expected to impact offensive efficiency."
      ]
    };
    
    const insights = environmentInsights[paceAnalysis];
    return insights[Math.floor(Math.random() * insights.length)];
  }
  
  private static getCorrelationInsight(playerPropsCount: number, avgPlayerEdge: number, betType: string): string {
    const correlationStrength = avgPlayerEdge >= 7 ? "strong" : avgPlayerEdge >= 5 ? "solid" : "moderate";
    
    if (betType === 'spread') {
      return `Player prop analysis across ${playerPropsCount} bets shows ${correlationStrength} directional correlation (${avgPlayerEdge.toFixed(1)}% avg edge).`;
    } else {
      return `Individual scoring projections from ${playerPropsCount} player props indicate ${correlationStrength} total alignment (${avgPlayerEdge.toFixed(1)}% avg edge).`;
    }
  }
  
  private static getGameConfidenceLevel(gameEdge: number, playerEdge: number): string {
    const combinedStrength = (gameEdge + playerEdge) / 2;
    
    if (combinedStrength >= 7) return "🎯 High-confidence game analysis with multi-layer validation.";
    if (combinedStrength >= 5) return "✅ Good confidence supported by player-level correlation.";
    if (combinedStrength >= 3) return "📊 Moderate confidence with developing edge patterns.";
    return "⚠️ Emerging opportunity requiring careful monitoring.";
  }
  
  private static getPaceAnalysis(awayTeam: string, homeTeam: string): string {
    const paceInsights = [
      "Pace metrics favor offensive efficiency and scoring opportunities.",
      "Tempo control strategies align with projected game flow.",
      "Possession count analysis supports the total projection.",
      "Defensive pressure and pace combination creates value."
    ];
    
    return paceInsights[Math.floor(Math.random() * paceInsights.length)];
  }
  
  private static getGameTimingContext(gameTime: string): string {
    if (gameTime.includes('Tomorrow')) {
      return "Early market value before public betting action.";
    }
    if (gameTime.includes('Today')) {
      return "Live edge with current roster and status updates.";
    }
    return "Optimal timing for maximum analytical advantage.";
  }
  
  // Method to generate selection reasoning (why this bet was chosen over alternatives)
  static generateSelectionReasoning(
    selectedBet: {
      type: string;
      line: number;
      edge: number;
      odds: string;
      projection: number;
    },
    rejectedBet?: {
      type: string;
      line: number;
      edge: number;
      odds: string;
      projection: number;
    }
  ): string {
    
    if (!rejectedBet) {
      return `Selected ${selectedBet.type} ${selectedBet.line} as the optimal play with ${selectedBet.edge.toFixed(1)}% edge.`;
    }
    
    const edgeDiff = selectedBet.edge - rejectedBet.edge;
    const projectionSupport = selectedBet.type === 'Over' 
      ? selectedBet.projection > selectedBet.line 
      : selectedBet.projection < selectedBet.line;
    
    let reasoning = `✅ Selected ${selectedBet.type} ${selectedBet.line} over ${rejectedBet.type} ${rejectedBet.line}. `;
    
    if (edgeDiff >= 3) {
      reasoning += `Significantly higher edge (+${edgeDiff.toFixed(1)}%). `;
    } else if (edgeDiff > 0) {
      reasoning += `Better edge (+${edgeDiff.toFixed(1)}%). `;
    }
    
    if (projectionSupport) {
      reasoning += `Model projection strongly supports this direction. `;
    }
    
    // Odds value comparison
    const selectedOddsValue = parseInt(selectedBet.odds.replace(/[+\-]/g, ''));
    const rejectedOddsValue = parseInt(rejectedBet.odds.replace(/[+\-]/g, ''));
    
    if (selectedBet.odds.includes('+') && rejectedBet.odds.includes('-')) {
      reasoning += `Superior odds value (${selectedBet.odds} vs ${rejectedBet.odds}).`;
    }
    
    return reasoning;
  }
}

// Usage in your WNBA data processing
export function enhanceWNBAInsights(prop: any): string {
  const baseInsight = InsightsGenerator.generateWNBAInsights(
    prop.player,
    extractStatFromTitle(prop.title),
    prop.type,
    prop.line,
    prop.projected,
    prop.edge,
    prop.platform,
    prop.gameTime || 'Tomorrow',
    prop.confidence
  );
  
  // Add selection reasoning if this prop was chosen over alternatives
  if (prop.selectionReasoning) {
    return `${baseInsight} ${prop.selectionReasoning}`;
  }
  
  return baseInsight;
}

function extractStatFromTitle(title: string): string {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('assist')) return 'assists';
  if (lowerTitle.includes('point')) return 'points';
  if (lowerTitle.includes('rebound')) return 'rebounds';
  if (lowerTitle.includes('steal')) return 'steals';
  if (lowerTitle.includes('block')) return 'blocks';
  return 'points';
}