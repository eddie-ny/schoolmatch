-- Fees in any currency, search by country, Australian schools and programmes (CRICOS). Applied through the Supabase tool.
alter table programs add column if not exists fee_amount numeric, add column if not exists fee_currency text;
-- search_programs_c(p_scope, p_q, p_field, p_level, p_school, p_limit, p_offset, p_country) and program_countries(p_scope) were created.
