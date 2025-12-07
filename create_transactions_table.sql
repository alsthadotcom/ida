-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Optional if we want to track seller directly
    idea_id UUID REFERENCES public.ideas(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policies

-- Admins can view all transactions
CREATE POLICY "Admins can view all transactions"
    ON public.transactions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can update transactions (approve/reject)
CREATE POLICY "Admins can update transactions"
    ON public.transactions
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Buyers can view their own transactions
CREATE POLICY "Users can view their own transactions"
    ON public.transactions
    FOR SELECT
    USING (auth.uid() = buyer_id);

-- Buyers can create transactions (buy idea)
CREATE POLICY "Users can create transactions"
    ON public.transactions
    FOR INSERT
    WITH CHECK (auth.uid() = buyer_id);

-- Optional: Sellers can view transactions for their ideas? 
-- Let's keep it simple for now, only admin validates payment.

-- Grant access
GRANT ALL ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
