alter table public.jobs
  add column if not exists photo_urls text[] not null default '{}';

comment on column public.jobs.photo_urls is
  'Public Supabase Storage URLs for job photos in the job-images bucket.';
