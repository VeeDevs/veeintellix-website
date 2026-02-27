
-- Drop the overly permissive update policy on quotes
DROP POLICY "Anyone can update quotes" ON public.quotes;

-- Only admins can update quotes
CREATE POLICY "Admins can update quotes" ON public.quotes
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to read all quotes (existing SELECT policy is fine for public read)
-- Allow admins to delete quotes
CREATE POLICY "Admins can delete quotes" ON public.quotes
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
