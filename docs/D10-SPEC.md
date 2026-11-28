# D10 build spec: staff customer details page and "record refund" (28 Nov 2026)

Build the SIMPLE version: the button records a refund and removes access; it never moves money. Staff refund the money themselves in the Paystack dashboard first.

## What the owner wants ("like how 365 admin does theirs")
- In the staff area People list, clicking a person opens THEIR OWN PAGE in the same tab (not a new tab), with its own URL, a "Back to People" link, and the browser back button working.
- Quick actions along the top: Edit details, Give or end plan, Record refund, Disable or Reactivate, Delete. Show only what the signed-in staff role allows (same rules as today's row buttons).
- Tabs underneath:
  - Overview: name, email, phone, date of birth, joined date, account status (active, disabled, unconfirmed), under-18 status, parent details and whether the parent confirmed.
  - Plan and payments: current plan, status, end date, free-trial status; every payment (date, amount GHS, plan, Paystack reference, status), each with a "Record refund" button.
  - Profile and documents: SHS attended and programme, study level and field, desired programmes, uploaded documents (private "documents" storage bucket and "documents" table exist).
  - Saved: saved programmes.
  - History: every staff action on this person from audit_log (target_user = this person), with who and when.
- Record refund dialog: full or partial, amount (GHS, cannot exceed amount paid), reason (required), Paystack refund reference (optional), confirm. On save: payment marked refunded, the person's plan ends at once (summaries only, no plan reminder emails), entry written to audit_log. Owner and admins only, signed in with 2-step (aal2), same as admin_end_plan.
- Acceptance test: staff open a person's page, see all their details and payments, record a test refund, the person's access ends, and the action shows in History.

## Existing code to build on (checked 28 Nov on origin/main 47e101f)
- src/pages/StaffArea.jsx: tabs and Routes under `${base}` (base from VITE_STAFF_PATH, see src/lib/staffPaths.js). People route: `<Route path="people" element={<SignupsSection ... canDisable canEditStaff canDelete canPlan />} />`. Add `people/:id` for the new page.
- src/components/StaffParts.jsx: SignupsSection (People table: Name, Email, Phone, Access, Profile, Account, Actions; mobile card list), the edit-student form, and the Plan panel using ownerGrantPlan / ownerEndPlan ("Give this plan", "End plan now"). Reuse these on the new page.
- src/lib/api.js: listUsers() (direct selects on profiles and subscriptions, plus rpc list_staff_roles and list_unconfirmed_users), listAuditLog() (audit_log: id, at, actor_id, actor_role, action, target_user, detail), ownerGrantPlan -> rpc admin_grant_plan, ownerEndPlan -> rpc admin_end_plan, admin_set_account_disabled, deleteAccount, staffUpdateProfile.
- Existing staff RPCs: admin_set_account_disabled, admin_accept_parent, admin_set_rate, admin_grant_plan, admin_end_plan, admin_set_staff_role, admin_list_staff, admin_stats, staff_update_profile, admin_invite_staff, admin_list_invites, admin_cancel_invite, admin_delete_staff, admin_list_archive, admin_delete_account, admin_chart, admin_interest, admin_access_breakdown, admin_study_interest. Copy the role and aal2 checks from admin_end_plan.

## Database facts (checked live 28 Nov)
- payments columns: id, user_id, provider, reference, amount_usd, status, created_at, plan, amount_minor, currency, paid_at, payer_email, payer_name. No CHECK constraint on payments. Status values seen: success, pending.
- subscriptions columns: user_id, plan, status, started_at, expires_at, auto_renew, paystack_ref, updated_at. One row per user. CHECK on status allows ONLY 'active', 'canceled', 'expired'. 'refunded' is NOT allowed yet.
- FOUND: supabase/functions/plan-reminders/index.ts line 82 skips `s.status === 'cancelled' || s.status === 'refunded'`, but the database spells it 'canceled' (one l). Check what admin_end_plan writes; fix the spelling or the check as part of D10.
- Check RLS: whether staff can already select payments, saved programmes and documents for another user. If not, add one SECURITY DEFINER rpc (for example admin_get_person(p_user)) with the same staff check.

## Database changes needed (schema change: owner must approve; give SQL as a file AND paste the SQL in chat; owner runs it in the Supabase SQL editor)
1. payments: add refunded_at timestamptz, refund_amount_minor integer, refund_reason text, refund_reference text, refunded_by uuid. Status 'refunded' for full, 'partially_refunded' for partial (decide with owner).
2. subscriptions status CHECK: add 'refunded' (or reuse 'canceled' and record the reason in audit_log; decide with owner).
3. New rpc admin_record_refund(p_payment, p_amount_minor, p_reason, p_reference): owner or admin only, aal2; refuse if amount > amount_minor or already refunded; update the payment; end the person's subscription now (expires_at = now()) if it is the plan that payment bought; write audit_log action 'refund_recorded' with amount, reason, reference.
4. SQL step numbers: list supabase/ on BOTH main and mobile first. 214 and 215 are each used twice. step217 and step218 are reserved for the 27 Nov private-and-Asia files, so use step219 for D10. Always name the full file.

## Not in scope
- Calling the Paystack refund API (the owner chose the simple version).
- The mobile app: staff features stay web only.

## Working rules
- No em dashes. Truthful; say when unsure. Short replies.
- Schema changes need the owner's approval; data loads do not. Give SQL as a file and paste it in chat; run it only when told.
- Deploying an edge function needs the owner's explicit yes.
- Run `npm run build` before pushing; a push to main deploys to the live site in 1 to 2 minutes.
