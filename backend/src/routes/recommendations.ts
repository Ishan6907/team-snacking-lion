import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
  const { projectName, sector, state, delayDays, riskLevel, primaryBottleneck, factors } = req.body;
  
  const apiKey = process.env.GEMINI_API_KEY;
  const staticFallback = {
    recommendations: [
      "Accelerate Section 11 preliminary notification publication in the official gazette to lock in cutoff dates.",
      "Convene a joint session with the District Collector and CALA to resolve pending Section 3G compensation disbursement disputes.",
      "Expedite Rehabilitation & Resettlement (R&R) scheme approval under Section 15 to clear community objections.",
      "Establish a localized fast-track grievance redressal mechanism for legal disputes stalling land possession.",
      "Re-allocate immediate funds for timely disbursement of compensation awards to avoid statutory lapsing under Section 25."
    ],
    source: 'static',
    projectName: projectName || 'Unknown Project'
  };

  if (!apiKey) {
    return res.json(staticFallback);
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

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      console.error('Gemini API error:', await response.text());
      return res.json(staticFallback);
    }

    const data: any = await response.json();
    try {
      const textResponse = data.candidates[0].content.parts[0].text;
      const parsedRecommendations = JSON.parse(textResponse);
      
      return res.json({
        recommendations: parsedRecommendations,
        source: 'gemini',
        projectName: projectName || 'Unknown Project'
      });
    } catch (e) {
      console.error('Failed to parse Gemini response:', e);
      return res.json(staticFallback);
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return res.json(staticFallback);
  }
});

export default router;
