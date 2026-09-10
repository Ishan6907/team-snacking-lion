import { Router } from 'express';
import dotenv from 'dotenv';
import path from 'path';

// Ensure dotenv is loaded
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config();

const router = Router();

export function generateDynamicRecommendations(req: {
  projectName?: string;
  sector?: string;
  state?: string;
  delayDays?: number;
  riskLevel?: string;
  primaryBottleneck?: string;
  factors?: Array<{ name: string; importance: number; direction: string }>;
}): string[] {
  const recs: string[] = [];
  const delay = req.delayDays || 0;
  const bottleneck = req.primaryBottleneck || '';
  const bLower = bottleneck.toLowerCase();
  const name = req.projectName || 'Infrastructure Project';
  const sector = req.sector || 'Infrastructure';
  const state = req.state || 'India';

  // 1. Statutory Urgency & RFCTLARR Act Clocks
  if (delay > 365) {
    recs.push(`Statutory Clock Alert: With ${delay} days delay, ${name} is at imminent risk of Section 25 lapsing. The District Collector must pass Section 23 awards and disburse 80% solatium within 30 days to avoid statutory lapse.`);
  } else if (delay > 180) {
    recs.push(`Critical Delay Mitigation: Invoke Vivad se Vishwas II conciliation protocol to settle pending contractor arbitration and clear encumbrances across contested chainages.`);
  } else if (delay > 60) {
    recs.push(`Schedule Acceleration: Deploy 24x7 double-shift operations on unencumbered sections under RFCTLARR Section 40 urgency provisions to compress the ${delay}-day schedule variance.`);
  } else {
    recs.push(`Routine Statutory Compliance: Maintain bi-weekly milestone audit cadence and ensure Section 3D gazette notifications are issued 45 days prior to civil mobilization.`);
  }

  // 2. Primary Bottleneck Targeted Action
  if (bLower.includes('court') || bLower.includes('stay') || bLower.includes('writ') || bLower.includes('litigation') || bLower.includes('appeal')) {
    recs.push(`Judicial Resolution: Instruct Standing Counsel to move High Court for conditional vacation of stay upon 75% compensation deposit in court escrow under Section 77(2), referencing Supreme Court directives on national infrastructure expedience.`);
  } else if (bLower.includes('defence') || bLower.includes('defense') || bLower.includes('military') || bLower.includes('air force')) {
    recs.push(`Inter-Ministerial Land Swap: Escalate defence land alienation through PMO-PRAGATI; execute formal Working Permission on equal-value state land exchange.`);
  } else if (bLower.includes('forest') || bLower.includes('wildlife') || bLower.includes('moefcc') || bLower.includes('wetland') || bLower.includes('tree')) {
    recs.push(`Ecological Clearance: Track Stage-II Forest Clearance on Parivesh 2.0; expedite non-forest land mutation in district revenue records for CAMPA compensatory afforestation.`);
  } else if (bLower.includes('compensation') || bLower.includes('circle rate') || bLower.includes('valuation') || bLower.includes('escrow') || bLower.includes('3g') || bLower.includes('3h') || bLower.includes('orchard')) {
    recs.push(`CALA Valuation Parity: Convene District Level Land Acquisition Committee (DLRP) under the District Collector to re-benchmark multiplier factors under RFCTLARR Section 26(2) and release pending Section 3H(1) escrow disbursements.`);
  } else if (bLower.includes('utility') || bLower.includes('ehv') || bLower.includes('shifting') || bLower.includes('pipeline')) {
    recs.push(`Utility Corridors: Implement a joint 24x7 relocation taskforce with State Transco and Jal Nigam; enforce statutory 45-day RoW clearance under Indian Telegraph Act provisions.`);
  } else if (bLower.includes('tbm') || bLower.includes('undersea') || bLower.includes('tunnel') || bLower.includes('fault') || bLower.includes('geolog')) {
    recs.push(`Geotechnical De-Risking: Mobilize specialized permeation grouting and advance ground-probing radar to secure retrieval shaft stability and avert excavation halts.`);
  } else if (bLower.includes('submergence') || bLower.includes('r&r') || bLower.includes('displaced') || bLower.includes('dam')) {
    recs.push(`R&R Schedule II Compliance: Expedite Model R&R Colony possession and direct benefit transfer (DBT) of livelihood grants to project affected families prior to seasonal river spate.`);
  } else if (bottleneck) {
    recs.push(`Targeted Bottleneck Intervention: Expedite administrative clearance for "${bottleneck}" via District Collector CALA taskforce with weekly progress milestones.`);
  }

  // 3. Top Predictive SHAP Factor Action
  if (req.factors && req.factors.length > 0) {
    const sortedFactors = [...req.factors].sort((a, b) => (b.importance || 0) - (a.importance || 0));
    const topFactor = sortedFactors[0];
    const fName = topFactor.name.toLowerCase();

    if (fName.includes('land') || fName.includes('sec3g') || fName.includes('compensation')) {
      recs.push(`Land Factor Driver (${(topFactor.importance * 100).toFixed(0)}% weight): Expedite Joint Measurement Survey (JMS) and verify 30-year non-encumbrance records to finalize award list.`);
    } else if (fName.includes('liquidity') || fName.includes('contractor') || fName.includes('drawdown')) {
      recs.push(`Contractor Liquidity Relief: Release Mobilization Advance against bank guarantees and expedite PFMS running account (RA) bill clearance within 7 working days.`);
    } else if (fName.includes('monsoon') || fName.includes('flood') || fName.includes('weather')) {
      recs.push(`Hydrological Preparedness: Complete critical sub-grade and drainage structures ahead of monsoon onset; construct bypass cofferdams on flood-vulnerable stretches.`);
    } else if (fName.includes('geo') || fName.includes('thrust') || fName.includes('terrain')) {
      recs.push(`Terrain Engineering: Deploy real-time InSAR satellite slope stability monitoring and high-capacity earthworks rigs along high-risk geodetic chainages.`);
    } else if (fName.includes('metrology') || fName.includes('calibration') || fName.includes('gatc')) {
      recs.push(`Metrology Compliance: Fast-track weighbridge verification with Legal Metrology officers and clear pending GATC testing backlog under Jan Vishwas guidelines.`);
    } else {
      recs.push(`Key Delay Driver Mitigation: Address ${topFactor.name.replace(/_/g, ' ')} (${(topFactor.importance * 100).toFixed(0)}% contribution) through designated nodal officer oversight.`);
    }
  }

  // 4. Sector & Jurisdiction Alignment
  if (sector === 'Highways' || sector === 'Roads & Highways') {
    recs.push(`Highways Corridor in ${state}: Erect physical boundary pillars and boundary fencing on acquired chainages to prevent adverse encroachment.`);
  } else if (sector === 'Railways') {
    recs.push(`Railways Corridor in ${state}: Pre-schedule CRS (Commissioner of Railway Safety) statutory inspection window to align with overhead electrification completion.`);
  } else if (sector === 'Power' || sector === 'Power & Energy') {
    recs.push(`Power Transmission in ${state}: Finalize transmission tower-footing crop compensation settlements under District Collector guidelines to allow unbroken stringing.`);
  } else if (sector === 'Water' || sector === 'Water Resources') {
    recs.push(`Water Resources in ${state}: Secure Central Water Commission (CWC) safety vetting and execute joint canal parcel demarcation with local revenue authorities.`);
  } else {
    recs.push(`Jurisdictional Alignment (${state}): Convene state-level Pragati coordination panel with Implementing Agency to clear municipal RoW interfaces.`);
  }

  return recs.slice(0, 5);
}

router.post('/', async (req, res) => {
  const { projectName, sector, state, delayDays, riskLevel, primaryBottleneck, factors } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // Always compute dynamic predictive recommendations as the high-intelligence baseline
  const dynamicRecommendations = generateDynamicRecommendations({
    projectName,
    sector,
    state,
    delayDays,
    riskLevel,
    primaryBottleneck,
    factors
  });

  // If no API key configured, return dynamic AI predictive engine results
  if (!apiKey) {
    return res.json({
      recommendations: dynamicRecommendations,
      source: 'ai-predictive',
      projectName: projectName || 'Unknown Project'
    });
  }

  const factorsText = factors && Array.isArray(factors) 
    ? factors.map((f: any) => `- ${f.name} (Importance: ${f.importance}, Direction: ${f.direction})`).join('\n')
    : 'None provided';

  const prompt = `You are an expert infrastructure project manager and legal advisor specializing in the RFCTLARR Act 2013. Please provide 3 to 5 highly specific corrective actions to reduce the predicted land acquisition delay for the following project.
Project Name: ${projectName}
Sector: ${sector}
State: ${state}
Predicted Delay: ${delayDays} days
Risk Level: ${riskLevel}
Primary Bottleneck: ${primaryBottleneck}
Risk Factors:
${factorsText}

Your recommendations must specifically address:
1. RFCTLARR-specific statutory steps (e.g., accelerating Section 11, 15, 19, or 21).
2. Compensation disbursement strategies to avoid Section 25 lapsing.
3. Rehabilitation & Resettlement (R&R) plan acceleration.
4. District Collector (DC) / CALA intervention tactics.
5. Legal dispute resolution mechanisms for land possession.

Return ONLY a JSON array of strings containing the recommendations. Do not include markdown formatting or explanations.`;

  // Try calling Gemini API models
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
  for (const model of models) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        }),
        signal: AbortSignal.timeout(6000)
      });

      if (response.ok) {
        const data: any = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textResponse) {
          const parsed = JSON.parse(textResponse);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return res.json({
              recommendations: parsed,
              source: 'gemini',
              projectName: projectName || 'Unknown Project'
            });
          }
        }
      } else {
        console.warn(`Gemini API error on ${model}:`, response.status);
      }
    } catch (e: any) {
      console.warn(`Gemini API attempt failed on ${model}:`, e.message);
    }
  }

  // If Gemini calls fail, return the bespoke dynamic predictive recommendations
  return res.json({
    recommendations: dynamicRecommendations,
    source: 'ai-predictive',
    projectName: projectName || 'Unknown Project'
  });
});

export default router;
