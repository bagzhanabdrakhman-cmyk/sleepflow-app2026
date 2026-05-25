
insert into storage.buckets (id, name, public)
values ('audio', 'audio', true)
on conflict (id) do update set public = true;

-- Public read for audio bucket
drop policy if exists "Public read for audio" on storage.objects;
create policy "Public read for audio"
on storage.objects for select
using (bucket_id = 'audio');
