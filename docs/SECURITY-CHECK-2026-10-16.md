# Security and health check, 16 Oct 2026

Read-only checks on Supabase project zzuoqdeeegzmgtuvspgz (eu-west-1, Postgres 17, healthy). Source: Supabase advisors plus catalog queries.

## Confirmed
- All 22 public tables have row-level security on.
- No security-definer function is callable by signed-out visitors.
- All 21 functions callable by signed-in users start with a role check. Owner-only functions (admin_delete_account, admin_invite_staff, admin_set_staff_role and similar) also require a 2-step login (aal2). Staff-level functions use is_staff().
- payments.reference has a unique constraint, so one payment reference cannot be saved twice.

## Open
- Leaked password protection is off. The owner reports it needs the Supabase Pro plan, which is not bought yet. Turn on after upgrading.
- Backups and point-in-time recovery: the owner reports these need the Pro plan too. Until then there is no backup to restore from. Upgrade before real students and payments, or export the tables by hand on a regular schedule.
- schools_summary, programs_summary, scholarships_summary are security-definer views (advisor ERROR). By design, so users without full access see summaries. Review before launch.
- 6 tables have row-level security and no policies (deleted_accounts, import_stage, parent_confirmations, reminders, staff_invites, trial_ledger). This blocks direct access and is probably intended.
- import_stage: dropped by the owner in the SQL Editor on 16 Oct 2026 (not re-checked by Claude).
- 14 tables have overlapping read policies. Minor at this size.
- Not confirmable from here: backup plan and point-in-time recovery, database network restrictions, payment callback behaviour under repeated calls, error alerts and uptime monitoring (none set up).
