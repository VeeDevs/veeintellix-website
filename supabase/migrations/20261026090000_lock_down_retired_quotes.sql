-- Enquiries now go directly to the server-side email endpoint. The legacy
-- quotes table is retained for historical data but the public app no longer
-- reads or writes it. Remove its former public read/insert policies.
DROP POLICY IF EXISTS "Anyone can create quotes" ON public.quotes;
DROP POLICY IF EXISTS "Anyone can read quotes" ON public.quotes;
DROP POLICY IF EXISTS "Admins can update quotes" ON public.quotes;
DROP POLICY IF EXISTS "Admins can delete quotes" ON public.quotes;

REVOKE ALL ON TABLE public.quotes FROM anon, authenticated;
