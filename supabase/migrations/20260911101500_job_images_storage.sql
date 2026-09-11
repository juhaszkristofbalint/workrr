insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'job-images',
  'job-images',
  true,
  10485760,
  array[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
    'image/gif'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists job_images_storage_select on storage.objects;
drop policy if exists job_images_storage_insert on storage.objects;
drop policy if exists job_images_storage_update on storage.objects;
drop policy if exists job_images_storage_delete on storage.objects;

create policy job_images_storage_select
on storage.objects
for select
using (bucket_id = 'job-images');

create policy job_images_storage_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'job-images'
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy job_images_storage_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'job-images'
  and split_part(name, '/', 1) = auth.uid()::text
)
with check (
  bucket_id = 'job-images'
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy job_images_storage_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'job-images'
  and split_part(name, '/', 1) = auth.uid()::text
);
