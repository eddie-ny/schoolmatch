-- Corrections: awards that cover tuition only (or whose page does not itemise) are not marked Full. Run after step200.
update scholarships set funding_type = 'Partial' where lower(name) = lower($q$UTS Vice-Chancellor's International Postgraduate Coursework Scholarship$q$) and school_id = 'cfdab7e7-e7bd-45dc-8087-53b55e79b12a';
update scholarships set funding_type = 'Partial' where lower(name) = lower($q$Africa Development Scholarship$q$) and school_id = '14a32f01-da3b-4ca2-adc0-aa728d19ff2e';
update scholarships set funding_type = 'Partial' where lower(name) = lower($q$Tier One Scholarship$q$) and school_id = '57053396-1cbb-47ad-86a5-bc922fb4d9ca';
update scholarships set funding_type = 'Partial' where lower(name) = lower($q$International Presidential Scholarship$q$) and school_id = 'eb290134-8f03-4cf0-bc03-8aa6e21b8acb';
update scholarships set funding_type = 'Partial' where lower(name) = lower($q$UA Competitive Achievement Scholarship$q$) and school_id = 'b2df4a3e-63fa-4029-ab72-36d385083ebf';
update scholarships set funding_type = 'Partial' where lower(name) = lower($q$Presidential Elite Scholarship$q$) and school_id = 'b2df4a3e-63fa-4029-ab72-36d385083ebf';
update scholarships set funding_type = 'Not stated' where lower(name) = lower($q$Mastercard Foundation Scholars Program at Arizona State University$q$) and school_id is null;
