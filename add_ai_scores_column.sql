-- Add ai_scores column to ideas table to store AI validation results
-- This will store all AI metrics, scores, and recommendations

ALTER TABLE ideas ADD COLUMN IF NOT EXISTS ai_scores JSONB;

-- Add a comment to the column
COMMENT ON COLUMN ideas.ai_scores IS 'Stores AI validation scores and recommendations in JSON format';

-- Example structure:
-- {
--   "clarity": 90,
--   "uniqueness": 80,
--   "feasibility": 70,
--   "executability": 80,
--   "capital_intensive": 30,
--   "market_potential": 85,
--   "price_validation": 70,
--   "problem_validity": 95,
--   "solution_fit": 90,
--   "summary": "AI-generated summary...",
--   "recommended_category": "HealthTech",
--   "validated_at": "2024-12-08T12:00:00Z"
-- }
