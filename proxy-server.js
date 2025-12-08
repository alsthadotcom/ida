import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = 3001;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://apwxfppvaadsiiavgwxh.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwd3hmcHB2YWFkc2lpYXZnd3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTM1MjksImV4cCI6MjA4MDIyOTUyOX0.WtDaPvgxdII6rMKK2hR1sPlk5VMvjkuuSubqyHvgd3k';
const supabase = createClient(supabaseUrl, supabaseKey);

// Proxy endpoint for NVIDIA API
app.post('/api/nvidia/v1/chat/completions', async (req, res) => {
    try {
        // Fetch API key and model from Supabase
        const { data: settings, error } = await supabase
            .from('platform_settings')
            .select('key, value')
            .in('key', ['nvidia_nim_api_key', 'nvidia_nim_model']);

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: 'Failed to fetch settings from database' });
        }

        const apiKey = settings?.find(s => s.key === 'nvidia_nim_api_key')?.value;
        const modelName = settings?.find(s => s.key === 'nvidia_nim_model')?.value;

        if (!apiKey) {
            return res.status(500).json({ error: 'NVIDIA API key not configured in database' });
        }

        // Forward request to NVIDIA API
        const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...req.body,
                model: modelName || req.body.model
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('NVIDIA API error:', data);
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 NVIDIA Proxy Server running on http://localhost:${PORT}`);
    console.log(`📡 Forwarding requests to https://integrate.api.nvidia.com`);
});
