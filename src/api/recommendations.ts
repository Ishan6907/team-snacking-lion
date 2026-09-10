import { apiClient } from './client';

export interface RecommendationRequest {
  projectName: string;
  sector: string;
  state: string;
  delayDays: number;
  riskLevel: string;
  primaryBottleneck: string;
  factors: Array<{
    name: string;
    importance: number;
    direction: string;
  }>;
}

export interface RecommendationResponse {
  recommendations: string[];
  source: 'gemini' | 'ai-predictive' | 'static';
  projectName: string;
}

export const recommendationsApi = {
  getRecommendations: async (request: RecommendationRequest): Promise<RecommendationResponse> => {
    try {
      const { data } = await apiClient.post<RecommendationResponse>('/recommendations', request);
      return data;
    } catch {
      // Fallback to client-side static recommendations if backend is unreachable
      return {
        recommendations: generateFallbackRecommendations(request),
        source: 'static',
        projectName: request.projectName,
      };
    }
  },
};

function generateFallbackRecommendations(req: RecommendationRequest): string[] {
  const recs: string[] = [];
  const topFactor = req.factors.sort((a, b) => b.importance - a.importance)[0];

  if (topFactor) {
    recs.push(`Priority: Address ${topFactor.name.replace(/_/g, ' ')} (${(topFactor.importance * 100).toFixed(0)}% impact) — this is the dominant delay driver for ${req.projectName}.`);
  }

  if (req.primaryBottleneck) {
    recs.push(`Escalate "${req.primaryBottleneck}" through inter-ministerial coordination. Consider PRAGATI-level intervention for stalled clearances.`);
  }

  if (req.delayDays > 180) {
    recs.push(`Critical: With ${req.delayDays} days of predicted delay, invoke Vivad se Vishwas II conciliation mechanisms for any pending contractor disputes to release working capital.`);
    recs.push(`Initiate parallel execution on unencumbered stretches/sections while contested parcels undergo RFCTLARR Section 19 gazette notification.`);
  } else if (req.delayDays > 60) {
    recs.push(`Moderate Risk: Deploy 24x7 double-shift operations on critical-path activities to recover the ${req.delayDays}-day schedule gap.`);
    recs.push(`Conduct weekly milestone reviews with the implementing agency to track recovery progress against the revised completion target.`);
  } else {
    recs.push(`The project is within acceptable tolerance. Continue routine monitoring and ensure statutory clearance renewals are submitted 30 days before expiry.`);
  }

  if (req.sector === 'Railways' || req.sector === 'Roads & Highways') {
    recs.push(`For ${req.sector} in ${req.state}: Verify Right-of-Way (RoW) clearances and utility shifting status are synchronized with the civil paving/track-laying schedule.`);
  }

  return recs.slice(0, 5);
}
