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
  console.log("Starting AI validation with Puter.js...");

  const prompt = `
    You are the AI backbone for the IDA platform. Your role is to validate and analyze submitted business ideas with precision, clarity, and structured output.
    
    Analyze the following idea:
    Title: ${ideaData.title}
    Description: ${ideaData.longDescription || ideaData.shortDescription}
    Problem: ${ideaData.problem}
    Solution: ${ideaData.solution}
    Target Audience: ${ideaData.targetAudience}
    Category: ${ideaData.category}
    Current Price: ${ideaData.price}
    
    ## Output Format
    Return ONLY a raw JSON object (no markdown, no explanations, no code blocks):
    {
      "metrics": {
        "clarity": 85,
        "uniqueness": 70,
        "feasibility": 60,
        "executability": 75,
        "capital_intensive": 40
      },
      "market_validation": {
        "potential": "$50M-$500M",
        "price_validation": "$199-$499"
      },
      "problem_solution": {
        "problem_validity": 90,
        "solution_fit": 85
      },
      "summary": "Concise 2-3 sentence summary highlighting key strengths and market opportunity.",
      "category": {
        "recommended": "HealthTech"
      }
    }
    
    IMPORTANT:
    - All scores in "metrics" and "problem_solution" must be integers 0-100 (not percentages with %)
    - "market_validation.potential" must be a realistic market size range in USD (e.g., "$10M-$100M")
    - "price_validation" must be a realistic price range in USD (e.g., "$99-$299")
    - "category.recommended" must be one of: AI/ML, FinTech, HealthTech, EdTech, Sustainability, Consumer Products, Services, Other
    `;

  // Ensure Puter is loaded
  const puter = (window as any).puter;
  if (!puter) {
    throw new Error("Puter.js library is not loaded. Please ensure the script tag is present in index.html and you are online.");
  }

  try {
    let response;
    try {
      console.log("Attempting with gemini-3-pro-preview...");
      // Try with the specific high-quality model first
      response = await puter.ai.chat(prompt, { model: 'gemini-3-pro-preview' });
    } catch (specificError) {
      console.log("Note: Gemini 3 Pro model unavailable, switching to standard Puter model.");
      // Fallback to default model if specific one fails
      response = await puter.ai.chat(prompt);
    }

    // --- DETAILED LOGGING ---
    try {
      const currentUser = await puter.auth.getUser();

      console.group("🧠 AI Request Details");
      console.log("👤 Puter Account:", currentUser?.email || currentUser?.username || "Anonymous/Not Logged In");

      // Extract usage and model from response (based on observed structure)
      // Structure seen in logs: { usage: [{ type: 'prompt', model: '...', amount: ... }, ...], ... }
      if (response?.usage && Array.isArray(response.usage)) {
        const promptUsage = response.usage.find((u: any) => u.type === 'prompt');
        const completionUsage = response.usage.find((u: any) => u.type === 'completion');
        const model = promptUsage?.model || completionUsage?.model || "Unknown";

        // Infer provider from model name
        let provider = "Unknown";
        if (model.startsWith("gpt") || model.startsWith("o1")) provider = "OpenAI (via Puter)";
        else if (model.includes("claude")) provider = "Anthropic (via Puter)";
        else if (model.includes("sonar")) provider = "Perplexity (via Puter)";
        else if (model.includes("gemini")) provider = "Google (via Puter)";
        else if (model.includes("mistral")) provider = "Mistral AI (via Puter)";
        else if (model.includes("meta") || model.includes("llama")) provider = "Meta (via Puter)";

        console.log("🏭 Model Provider:", provider);
        console.log("ℹ️ Note: Puter manages the upstream API keys. The specific Provider Account email is internal to Puter infrastructure and not visible.");

        console.log("🤖 Model Used:", model);
        console.log("📊 Token Usage:");
        console.log(`   • Input:  ${promptUsage?.amount || 0}`);
        console.log(`   • Output: ${completionUsage?.amount || 0}`);
        console.log(`   • Total:  ${(promptUsage?.amount || 0) + (completionUsage?.amount || 0)}`);
      } else {
        console.log("🤖 Model info not available in standard format.");
      }
      console.groupEnd();
    } catch (logError) {
      console.warn("Failed to log detailed AI stats:", logError);
    }

    // Handle various response shapes from Puter
    // Sometimes it's { message: { content: "..." } }, sometimes { content: "..." }, sometimes just a string.
    let content = null;
    if (typeof response === 'string') {
      content = response;
    } else if (response?.message?.content) {
      content = response.message.content;
    } else if (response?.content) {
      content = response.content;
    }

    if (!content) {
      throw new Error("No content received from Puter AI. Raw response: " + JSON.stringify(response));
    }

    console.log("Extracted Content:", content);

    // Extract JSON from response (handle markdown and explanatory text)
    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No JSON object found in AI response");
    }

    const jsonStr = content.substring(firstBrace, lastBrace + 1);
    return JSON.parse(jsonStr);

  } catch (error) {
    console.error("AI Validation Error:", error);
    throw error;
  }
};
