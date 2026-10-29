-- Schema change approved by the user on 2026-10-29.
alter table public.programs add column if not exists internal_note text;
comment on column public.programs.internal_note is 'Staff-only research notes (where the data came from, verification status). Never shown to students.';
-- Data: every existing entry_note was copied to internal_note, then entry_note was rewritten for students:
-- provenance sentences (UNVERIFIED, "Listed on ... page", urls, source names, ChatGPT, advert, register) removed,
-- provenance parentheticals removed, useful rules (entry rule, class needed, interview, etc.) kept.
-- 3315 notes processed; 401 ended up empty.
