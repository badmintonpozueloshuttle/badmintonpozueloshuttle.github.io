CREATE TABLE public.info_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  level text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.info_requests TO service_role;

ALTER TABLE public.info_requests ENABLE ROW LEVEL SECURITY;
-- No policies for anon/authenticated: only server code (service role) can insert/read.