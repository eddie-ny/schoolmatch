-- Removes 3 duplicate Mastercard Foundation rows left by step200 and step202 overlapping. Keeps the fuller row each time:
-- Cambridge (keeps the 2026 page), Oxford AfOx (keeps the main AfOx page), Edinburgh on-campus (keeps "On-campus Masters").
-- Owner approved on 14 Nov 2026. Already applied to the live database. Safe to run again.
delete from scholarships where id in ('7e5918d0-6baa-4d77-a638-da3215e34e0c','53961203-9f31-4db3-9d77-26b86faceb66','ccabea4c-e862-429d-b270-93b2af35b284');
