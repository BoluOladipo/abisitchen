
CREATE OR REPLACE FUNCTION public.claim_admin_if_empty()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE existing int; uid uuid;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT count(*) INTO existing FROM public.user_roles WHERE role = 'admin';
  IF existing > 0 THEN RETURN false; END IF;
  INSERT INTO public.user_roles(user_id, role) VALUES (uid, 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END $$;

REVOKE EXECUTE ON FUNCTION public.claim_admin_if_empty() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_admin_if_empty() TO authenticated;
