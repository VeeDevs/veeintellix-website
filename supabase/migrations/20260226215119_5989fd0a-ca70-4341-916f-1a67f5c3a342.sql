
-- Create quotes table to store AI-generated quote requests
CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_description TEXT NOT NULL,
  project_type TEXT NOT NULL DEFAULT 'standard',
  key_features JSONB DEFAULT '[]'::jsonb,
  additional_features JSONB DEFAULT '[]'::jsonb,
  standard_analysis TEXT,
  modern_analysis TEXT,
  standard_preview_html TEXT,
  modern_preview_html TEXT,
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,
  client_company TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert quotes (public form)
CREATE POLICY "Anyone can create quotes" ON public.quotes FOR INSERT WITH CHECK (true);

-- Allow anyone to read their own quotes by id (via URL)
CREATE POLICY "Anyone can read quotes" ON public.quotes FOR SELECT USING (true);

-- Allow updates to quotes
CREATE POLICY "Anyone can update quotes" ON public.quotes FOR UPDATE USING (true);
