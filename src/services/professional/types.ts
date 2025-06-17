export interface WeatherConditions {
  temperature: number;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  humidity: number;
}

export interface CalculationFactors {
  seasonAverage: number;
  last10Games: number;
  vsOpponentAverage: number;
  homeAwayAverage: number;
  pace: number;
  oppDefensiveRating: number;
  oppPositionalDefense: number;
  openingLine: number;
  currentLine: number;
  venue?: VenueFactors;
  weather?: WeatherConditions;
  travel?: TravelFactors;
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
