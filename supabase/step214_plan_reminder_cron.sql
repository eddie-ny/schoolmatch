-- step214: daily plan reminder emails (owner approved 2026-11-25).
-- pg_net lets the database call the plan-reminders edge function; pg_cron runs it every day at 08:00 UTC (08:00 in Ghana).
-- The function sends at most two emails per plan (3 days before the end, and after it ends) and marks each on the
-- user's account, so a repeated call sends nothing new. The key below is the public anon key (the same one the
-- website and app ship with), not a secret.
create extension if not exists pg_net;

select cron.schedule(
  'plan-reminder-emails',
  '0 8 * * *',
  $$select net.http_post(
      url := 'https://zzuoqdeeegzmgtuvspgz.supabase.co/functions/v1/plan-reminders',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dW9xZGVlZWd6bWd0dXZzcGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1ODc4MDksImV4cCI6MjEwNzE2MzgwOX0.jwEB1H67AfZ8lBURcL470MGmKhZAvfK2gqJyja3sc7E'),
      body := '{}'::jsonb,
      timeout_milliseconds := 60000)$$
);
