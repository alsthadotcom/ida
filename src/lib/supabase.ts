import { createClient } from '@supabase/supabase-js';

// Hardcoded for immediate fix as .env loading was failing
const supabaseUrl = "https://apwxfppvaadsiiavgwxh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwd3hmcHB2YWFkc2lpYXZnd3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTM1MjksImV4cCI6MjA4MDIyOTUyOX0.WtDaPvgxdII6rMKK2hR1sPlk5VMvjkuuSubqyHvgd3k";

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
