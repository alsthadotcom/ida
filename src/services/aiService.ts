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
  };
}

export const validateIdea = async (ideaData: any): Promise<AIValidationResult> => {
  console.log("Starting AI validation with Dual-Model Pipeline...");

  // --- Load Puter.js dynamically if missing ---
  let puterInstance = (window as any).puter;
  if (!puterInstance) {
    console.log("Puter.js not found on window, attempting dynamic load...");
    try {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://js.puter.com/v2/';
        script.onload = () => {
          puterInstance = (window as any).puter;
          console.log("Puter.js loaded dynamically.");
          resolve();
        };
        script.onerror = () =>
          reject(new Error("Failed to load Puter.js dynamically. Check your internet connection."));
        document.head.appendChild(script);
      });
    } catch (e) {
      throw new Error("Puter.js library could not be loaded. Please ensure you are online.");
    }
  }

  // --- Check Auth Status ---
  if (puterInstance.auth && !puterInstance.auth.isSignedIn()) {
    console.warn("User is not signed in to Puter.js");
    throw new Error("NOT_AUTHENTICATED");
  }

  // --- Helper: extract content from diverse Puter responses ---
  const extractContent = (response: any): string => {
    let content: string | null = null;

    if (typeof response === 'string') {
      content = response;
    } else if (response?.message?.content) {
      content = response.message.content;
    } else if (response?.content) {
      content = response.content;
    }

    if (!content) {
      throw new Error("No content found in Puter AI response.");
    }
    return content;
  };

  // --- Stage 1: Deep Analysis (Primary / Secondary / Tertiary) ---
  const stage1Prompt = `
    You are a senior business analyst. Analyze the idea below deeply:
    Title: ${ideaData.title}
    Description: ${ideaData.longDescription || ideaData.shortDescription}
    Problem: ${ideaData.problem}
    Solution: ${ideaData.solution}
    Target Audience: ${ideaData.targetAudience}
    Category: ${ideaData.category}
    Current Price: ${ideaData.price}
    
    Provide a detailed analysis with market potential, saturation, uniqueness, feasibility, and problem-solution fit.
  `;

  let analysis: string | null = null;
  const stage1Models = ["gpt-5.1", "gpt-4.1", "llama-3.1-sonar-large-128k-online"];

  for (const model of stage1Models) {
    try {
      console.log(`Stage 1: Trying model ${model}...`);
      const response = await puterInstance.ai.chat(stage1Prompt, { model });
      analysis = extractContent(response);
      console.log(`Stage 1 successful with ${model}`);
      break;
    } catch (err) {
      console.warn(`Stage 1 failed on model ${model}:`, err);
    }
  }

  if (!analysis) {
    throw new Error("AI validation failed. If you're experiencing quota issues, go to Profile → Settings and click 'Clear Puter Cookies' to reset your session.");
  }

  // --- Stage 2: JSON Scoring (Primary / Secondary) ---
  const stage2Prompt = `
    Convert the following analysis into structured JSON strictly following the AIValidationResult schema.
    Analysis:
    ${analysis}

    Return ONLY the JSON object. Do not include any markdown, explanation, or text outside the JSON.
  `;

  let resultJSON: string | null = null;
  const stage2Models = ["gpt-4.1", "o1-mini"];

  for (const model of stage2Models) {
    try {
      console.log(`Stage 2: Trying model ${model} for JSON output...`);
      const response = await puterInstance.ai.chat(stage2Prompt, { model });
      resultJSON = extractContent(response);
      console.log(`Stage 2 successful with ${model}`);
      break;
    } catch (err) {
      console.warn(`Stage 2 failed on model ${model}:`, err);
    }
  }

  if (!resultJSON) {
    throw new Error("AI validation failed. If you're experiencing quota issues, go to Profile → Settings and click 'Clear Puter Cookies' to reset your session.");
  }

  // --- Parse JSON safely ---
  const firstBrace = resultJSON.indexOf('{');
  const lastBrace = resultJSON.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON object found in AI response.");
  }

  const jsonStr = resultJSON.substring(firstBrace, lastBrace + 1);
  const parsedResult: AIValidationResult = JSON.parse(jsonStr);

  console.log("AI Validation Complete:", parsedResult);
  return parsedResult;
};
