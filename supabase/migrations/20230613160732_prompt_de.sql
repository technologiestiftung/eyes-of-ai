alter table "public"."eotai_images" add column "prompt_de" text;


create policy "Public Access"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'eotai_images'::text));



