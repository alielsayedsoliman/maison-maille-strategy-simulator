-- Maison Maille: make participant results private to one administrator email.
-- Replace the email below with the exact Supabase Auth email used by the admin.
-- This migration removes existing policies on simulation_results, then adds one
-- read policy for that administrator only. Public result submission via the
-- SECURITY DEFINER RPC remains available to anonymous participants.

ALTER TABLE public.simulation_results ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  existing_policy RECORD;
BEGIN
  FOR existing_policy IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'simulation_results'
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.simulation_results',
      existing_policy.policyname
    );
  END LOOP;
END;
$$;

-- No anonymous/public direct table reads. Authenticated users receive SELECT
-- privilege, but RLS limits actual rows to the administrator email below.
REVOKE ALL PRIVILEGES ON TABLE public.simulation_results FROM anon, PUBLIC;
GRANT SELECT ON TABLE public.simulation_results TO authenticated;

CREATE POLICY "Private leaderboard: designated admin only"
ON public.simulation_results
FOR SELECT
TO authenticated
USING (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('REPLACE_WITH_ADMIN_EMAIL')
);

-- Keep public result submission working through the validated database RPC.
REVOKE ALL PRIVILEGES ON FUNCTION public.submit_maille_result(text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_maille_result(text, jsonb) TO anon, authenticated;
