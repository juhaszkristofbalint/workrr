insert into public.categories (slug, name_en, name_hu, sort_order) values
  ('plumbing', 'Plumbing', 'Vízvezeték', 1),
  ('electrical', 'Electrical', 'Villanyszerelés', 2),
  ('locksmith', 'Locksmith', 'Zárszerelés', 3),
  ('hvac', 'HVAC', 'Klíma és fűtés', 4),
  ('cleaning', 'Cleaning', 'Takarítás', 5),
  ('handyperson', 'Handyperson', 'Ezermester', 6),
  ('other', 'Other', 'Egyéb', 7)
on conflict (slug) do nothing;
