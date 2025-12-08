-- Update the NVIDIA model to a valid one that exists on NVIDIA NIM
-- The previous model "nvidia/llama-3.1-nemotron-safety-guard-8b-v3" doesn't exist
-- Using meta/llama-3.1-70b-instruct which is widely available

UPDATE platform_settings 
SET value = 'meta/llama-3.1-70b-instruct' 
WHERE key = 'nvidia_nim_model';

-- If the row doesn't exist, insert it
INSERT INTO platform_settings (key, value, description)
VALUES ('nvidia_nim_model', 'meta/llama-3.1-70b-instruct', 'Model name for AI validation')
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value;
