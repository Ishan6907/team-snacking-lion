export interface DelayPrediction {
  projectId: string;
  predictedDelayDays: number;
  confidence: number;
  riskScore: number;
  predictionDate: string;
  modelVersion: string;
  factors: DelayFactor[];
}

export interface DelayFactor {
  name: string;
  displayName: string;
  importance: number;
  value: number | string;
  direction: 'increases_delay' | 'decreases_delay';
}

export interface PredictionTrend {
  date: string;
  predictedDelay: number;
  actualDelay: number | null;
  confidence: number;
}
