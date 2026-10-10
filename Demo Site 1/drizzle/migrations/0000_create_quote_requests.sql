CREATE TABLE public.quote_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 created_at timestamptz NOT NULL DEFAULT now(),
 name text NOT NULL,
 phone text NOT NULL,
 email text NOT NULL DEFAULT '',
 service text NOT NULL,
 message text NOT NULL DEFAULT ''
);
GRANT ALL ON public.quote_requests TO service_role;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.quote_rate_limits (
 key text PRIMARY KEY,
 window_start timestamptz NOT NULL DEFAULT now(),
 attempts integer NOT NULL DEFAULT 1
);
GRANT ALL ON public.quote_rate_limits TO service_role;
ALTER TABLE public.quote_rate_limits ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.check_quote_rate_limit(rate_key text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE hits integer;
BEGIN
 INSERT INTO public.quote_rate_limits(key) VALUES (rate_key)
 ON CONFLICT (key) DO UPDATE SET
 attempts = CASE WHEN quote_rate_limits.window_start < now() - interval '1 hour' THEN 1 ELSE quote_rate_limits.attempts + 1 END,
 window_start = CASE WHEN quote_rate_limits.window_start < now() - interval '1 hour' THEN now() ELSE quote_rate_limits.window_start END
 RETURNING attempts INTO hits;
 RETURN hits <= 5;
END;
$$;
REVOKE ALL ON FUNCTION public.check_quote_rate_limit(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_quote_rate_limit(text) TO service_role;