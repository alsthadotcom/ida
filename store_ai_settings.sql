INSERT INTO public.platform_settings (key, value, description)
VALUES 
  ('nvidia_nim_api_key', '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', 'API Key for NVIDIA NIM'),
  ('nvidia_nim_model', 'nvidia/llama-3.1-nemotron-safety-guard-8b-v3', 'Model name for AI validation')
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value;
