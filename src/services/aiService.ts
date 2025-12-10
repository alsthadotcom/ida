// @ts-ignore
declare const puter: any;

export interface AIValidationResult {
  metrics: {
    clarity: number;
    uniqueness: number;
    feasibility: number;
    executability: number;
    capital_intensive: number;
  };
  market_validation: {
    potential: string; // e.g., "$10M-$100M"
    market_saturation_percentage: number; // e.g. 65
    market_saturation_description: string; // e.g. "Highly Saturated"
    price_validation: string; // e.g., "$199-$499"
  };
  problem_solution: {
    problem_validity: number;
    solution_fit: number;
  };
  summary: string;
  category: {
    recommended: string;
    details?: string;
  };
}

const STAGE_1_MODELS = ["gpt-5.1", "gpt-4.1", "llama-3.1-sonar-large-128k-online"];
const STAGE_2_MODELS = ["gpt-4.1", "o1-mini"];

// Helper to load Puter.js
const loadPuterJs = async (): Promise<any> => {
  if ((window as any).puter) return (window as any).puter;

  console.log("Puter.js not found, loading dynamically...");
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js.puter.com/v2/';
    script.onload = () => {
      console.log("Puter.js loaded.");
      resolve((window as any).puter);
    };
    script.onerror = () => reject(new Error("Failed to load Puter.js. Check connection."));
    document.head.appendChild(script);
  });
};

export const validateIdea = async (ideaData: any): Promise<AIValidationResult> => {
  console.log("🚀 Starting AI validation...");

  let puterInstance;
  try {
    puterInstance = await loadPuterJs();
  } catch (e) {
    throw new Error("Could not initialize AI service. Please check your connection.");
  }

  // Auth Check
  if (puterInstance.auth && !puterInstance.auth.isSignedIn()) {
    console.warn("User not signed into Puter.js");
    // Consider triggering a login modal or throwing a specific error code
    throw new Error("NOT_AUTHENTICATED: Please sign in to Puter.js to use AI features.");
  }

  // --- Helper: extract content ---
  const extractContent = (response: any): string => {
    const content = typeof response === 'string' ? response
      : response?.message?.content
        ? response.message.content
        : response?.content;

    if (!content) throw new Error("Empty response from AI model.");
    return content;
  };

  // --- Stage 1: Assessment ---
  const stage1Prompt = `
    Analyze this business idea deeply acting as a Senior Venture Capital Analyst:
    
    Title: ${ideaData.title}
    Details: ${ideaData.description} (Problem: ${ideaData.problem}, Solution: ${ideaData.solution})
    Target: ${ideaData.targetAudience}
    Sector: ${ideaData.category}
    Pricing: ${ideaData.price}
    
    Provide a comprehensive analysis covering:
    1. Market Potential (TAM/SAM/SOM estimation)
    2. Saturation & Competition
    3. Uniqueness factors
    4. Feasibility & Executability
    5. Problem-Solution Fit
  `;

  let analysis: string | null = null;
  for (const model of STAGE_1_MODELS) {
    try {
      console.log(`🤖 Stage 1: Analyzing with ${model}...`);
      const response = await puterInstance.ai.chat(stage1Prompt, { model });
      analysis = extractContent(response);
      console.log(`✅ Stage 1 complete (${model})`);
      break;
    } catch (err) {
      console.warn(`⚠️ Stage 1 failed (${model}):`, err);
    }
  }

  if (!analysis) throw new Error("AI analysis failed. Please try again later or check quota.");

  // --- Stage 2: Structuring ---
  const stage2Prompt = `
    Based on the following analysis, generate a strictly valid JSON object matching the AIValidationResult schema.
    
    Analysis:
    ${analysis}

    Constraints:
    - metrics: 0-100 integers
    - market_saturation_percentage: 0-100 integer
    - Return ONLY the raw JSON. No markdown formatting.
  `;

  let resultJSON: string | null = null;
  for (const model of STAGE_2_MODELS) {
    try {
      console.log(`Formatting output with ${model}...`);
      const response = await puterInstance.ai.chat(stage2Prompt, { model });
      resultJSON = extractContent(response);
      break;
    } catch (err) {
      console.warn(`Stage 2 failed (${model}):`, err);
    }
  }

  if (!resultJSON) throw new Error("Failed to generate structured data.");

  // Clean and parse JSON
  try {
    const jsonStr = resultJSON.replace(/```json\n?|\n?```/g, '').trim();
    const start = jsonStr.indexOf('{');
    const end = jsonStr.lastIndexOf('}');

    if (start === -1 || end === -1) throw new Error("No JSON found");

    const cleanJson = jsonStr.substring(start, end + 1);
    const parsedResult: AIValidationResult = JSON.parse(cleanJson);

    console.log("🎉 AI Validation Successful:", parsedResult);
    return parsedResult;
  } catch (e) {
    console.error("JSON Parse Error:", e);
    throw new Error("Received invalid data from AI. Please retry.");
  }
};
