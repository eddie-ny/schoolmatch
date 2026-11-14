-- Removes the shorter duplicate Cambridge Mastercard row. Step202 holds the fuller one ("Mastercard Foundation Scholars Program at the University of Cambridge"). Owner approved the removal on 14 Nov 2026. Safe to run even if the row was never loaded.
delete from scholarships
where lower(name) = lower('Mastercard Foundation African Scholars')
  and school_id = '48ea74c8-a747-4f8e-a065-25fdfb2bc532';
